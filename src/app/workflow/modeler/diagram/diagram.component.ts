import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  AfterViewInit,
  Inject,
  AfterViewChecked,
  Renderer2,
  HostListener
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

//import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import BpmnJS from 'bpmn-js/lib/Modeler.js';
import  userTaskExtension from './../../../../resources/user-task-properties.json';
import minimapModule  from 'diagram-js-minimap';

import { from, Observable, Subscription } from 'rxjs';
import { DataService } from './../../services/data.service';
import { BpmnJsService } from './services/bpmn-js.service';
import { ModelerRightClikEventService } from './services/modeler-right-clik-event.service';
import  {default as customControlsModule}  from './custom';
import { Workflow } from '../../../models/workflow';
import { WorkflowService } from './../../services/workflow.service';
import { UserService } from './../../../services/user.service';
import { User } from 'src/app/models/user';
import { InfoService } from './services/info.service';
import { Info } from 'src/app/models/info';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Actions } from '../../../models/actions.enum';

import CustomPaletteProvider from './custom/CustomPaletteProvider';
import CustomReplaceMenuProvider from './custom/CustomReplaceMenuProvider';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'diagram',
  templateUrl: './diagram.component.html',
  styleUrls: [
    './diagram.component.css'
    ]
})
export class DiagramComponent implements AfterViewInit,AfterViewChecked, OnChanges, OnDestroy, OnInit {
  private bpmnJS: BpmnJS;

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @ViewChild('panel', { static: true }) private panel: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  @Input() private url: string ;
  private fileData:any;
  private subscription: Subscription;
  private bpmnData:any;
  private bpmnSubscription: Subscription;
  private rightClickEvent:any;
  private rightClickSubscription: Subscription;
  static readonly HIGH_PRIORITY = 1500;
  static readonly ASSIGNEE ="#camunda-assignee";
  private users: User[]= [];
  private userSelect: string=null;
  private javaClasses:Info[]=[];
  private classEl: ElementRef;
  private classSelect: string=null;
  private expressions:Info[]=[];
  private expressionEl: ElementRef;
  private expressionSelect: string=null;
  private elementRegistry:any;
  private modeling:any;
  private implementationValue:string;
  
 
  constructor(
    private http: HttpClient,
    private renderer:Renderer2,
    private data: DataService,
    private bpmn:BpmnJsService,
    private rightClick:ModelerRightClikEventService,
    private workflowRest: WorkflowService,
    private userService: UserService,
    private infoService: InfoService
  ){     
   }
  
  setUserSelect(users:User[],userId:number):string{
    let userSelect=`<select onchange="onInputChange('select-user','camunda-assignee')" id="select-user">`;
    userSelect+=`<option disabled selected value></option>`;
    let user=null;
    for(let i=0;i<users.length;i++){
      user=users[i];
      userSelect+= `<option value = "`+user.id;
      if(String(userId)==String(user.id)) userSelect+= `" selected `;
      userSelect+= `" >`+user.username+`</option>`;
    }
    userSelect+=`</select>`;
    console.log("userSelect="+userSelect);
    return userSelect;
  }
  setSelect(infoes:Info[],infoValue:string,type?:string):string{
    let select=`<select onchange="onInputChange('select-delegate','camunda-delegate')" id="select-delegate">`;
    select+=`<option disabled selected value></option>`;
    let info=null;
    let pred="";
    let post="";
    if (type=="expression"){
      pred="${";
      post="}";
    }
    for(let i=0;i<infoes.length;i++){
      info=infoes[i];
      select+= `<option value = "`+pred+info.value+post;
      if(pred+info.value+post==infoValue) select+= `" selected `;
      select+= `" >`+info.key+`</option>`;
    }
    select+=`</select>`;
    console.log("info select ="+select);
    return select;
  }
  ngOnInit(): void { 
    this.subscription = this.data.currentMessage.subscribe(message => {
      if (message!='default message') {
        this.fileData = message;
        console.log(this.fileData);
      }
    });
    this.rightClickSubscription = this.rightClick.currentMessage.subscribe(message => {
      if (message!='default message') {
        this.rightClickEvent = message;
      }
    });
    this.bpmnSubscription = this.bpmn.currentMessage.subscribe(message => {
      if (message!='default message') {
        this.bpmnJS=message;
      }
    });
    this.userService.getAll().subscribe((data: User[])=>{
      this.users = data;
      this.userSelect=this.setUserSelect(this.users,null);
      console.log(this.users);
    });
    this.infoService.getClasses().subscribe((data: Info[])=>{
      this.javaClasses = data;
      this.classSelect=this.setSelect(this.javaClasses,null);
      console.log(this.javaClasses);
    });
    this.infoService.getExpressions().subscribe((data: Info[])=>{
      this.expressions = data;
      this.expressionSelect=this.setSelect(this.expressions,null,'expression');
      console.log(this.expressions);
    });
  }

  ngAfterViewInit():void{
    this.bpmnJS = new BpmnJS({
      container: "#diagram-component",
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      __init__: [ 'ReplaceMenuProvider' ],
      additionalModules: [
        minimapModule,
        {paletteProvider: [ 'type', CustomPaletteProvider ]},
        {'ReplaceMenuProvider': [ 'type', CustomReplaceMenuProvider ]},
        propertiesPanelModule,
        propertiesProviderModule,
        customControlsModule,
      ],
      // a descriptor that defines Camunda related BPMN 2.0 XML extensions
      // needed if you'd like to maintain camunda:XXX properties in the properties panel
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      },
      userTE: userTaskExtension,
    });
    console.info(this.bpmnJS);
    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    }); 
    if (this.fileData) {
      console.log(this.fileData);
      this.importDiagram(this.fileData);
      this.sendBpmn();
    }else this.bpmnJS.createDiagram();
    if (this.url!=null) {
      this.loadUrl(this.url);
      console.log("this.url "+this.url);
    }
    this.sendBpmn();
    this.elementRegistry=this.bpmnJS.get('elementRegistry');
    this.modeling = this.bpmnJS.get('modeling');
    // broadcast right click event
    this.bpmnJS.on('element.contextmenu', DiagramComponent.HIGH_PRIORITY, (event) => {
      this.onRightClick(event);
      console.log("diagram send right click event");
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();  
    });
   
  }
 /* @HostListener('document:click', ['$event'])
    clickEvent(event) {
    }
  }
*/
  changeAssigneeInput(){
    let selectUser=this.panel.nativeElement.querySelector('#select-user');
    //console.log(selectUser);
    if (selectUser==null){
      let assignee=this.panel.nativeElement.querySelector('#camunda-assignee');
      if(assignee) {
        let parent=this.renderer.parentNode(assignee); 
        console.log(parent);
        let selectedElements = this.bpmnJS.get('selection').get();
        console.log(selectedElements[0].businessObject.assignee);
        let assigneeValue=selectedElements[0].businessObject.assignee;
        console.log(selectedElements);
        if (assigneeValue){
          console.log(assigneeValue);
          this.userSelect=this.setUserSelect(this.users,assigneeValue);
        }else{
          this.userSelect=this.setUserSelect(this.users,null);
          console.log(this.userSelect);
        } 
        this.renderer.setProperty(parent, 'innerHTML', this.userSelect);
        this.renderer.appendChild(parent,assignee);
          this.renderer.setStyle(assignee,"display","none");
          console.log(parent);               
      }
    }    
  }
  onChange(event){
    console.log(event);
    let implementationSelect=this.panel.nativeElement.querySelector('#camunda-implementation-select');
    this.implementationValue=implementationSelect.options[implementationSelect.selectedIndex].value;
    console.log(this.implementationValue);        
  }

  createDelegateSelect(selectedElements,list,selectList,parent,delegate:any,attribute:string){
    console.log(selectedElements[0].businessObject[attribute]);
    let attributeValue=selectedElements[0].businessObject[attribute];
    console.log(selectedElements);
    if (!attributeValue) attributeValue=null;else console.log(attributeValue);
    selectList=this.setSelect(list,attributeValue,attribute);
    this.renderer.setProperty(parent, 'innerHTML', selectList);
    this.renderer.appendChild(parent,delegate);
    this.renderer.setStyle(delegate,"display","none");
  }
  changeDelegateInput(){
    let implementationSelect=this.panel.nativeElement.querySelector('#camunda-implementation-select');
    if (implementationSelect) {
      implementationSelect.addEventListener('change', this.onChange.bind(this));
      this.implementationValue=implementationSelect.options[implementationSelect.selectedIndex].value;
    }
    let delegateSellect=this.panel.nativeElement.querySelector('#select-delegate');
    let delegate=this.panel.nativeElement.querySelector('#camunda-delegate');
    if(delegate) {
      let parent=this.renderer.parentNode(delegate);
      let selectedElements = this.bpmnJS.get('selection').get(); 
      console.log(this.implementationValue);
      let delegateEl=new ElementRef(delegateSellect);
      console.log(delegateEl);
      switch (this.implementationValue) {
        case 'class':
          console.log(this.classEl);
          if((delegateEl.nativeElement==null)||(this.classEl==null)) {
            this.createDelegateSelect(selectedElements,this.javaClasses,this.classSelect,parent,delegate,"class");
            this.classEl=new ElementRef(this.panel.nativeElement.querySelector('#select-delegate'));
            console.log(this.classEl.nativeElement);
          }
        break;
        case 'expression':
          console.log(this.expressionEl);
          if((delegateEl.nativeElement==null)||(this.expressionEl==null)) {
            this.createDelegateSelect(selectedElements,this.expressions,this.expressionSelect,parent,delegate,"expression");
            this.expressionEl=new ElementRef(this.panel.nativeElement.querySelector('#select-delegate'));
            console.log(this.expressionEl.nativeElement);
          }
        break;
        case 'delegateExpression':
            console.log('delegateExpression');
            if(delegateSellect) this.renderer.removeChild(parent,delegateSellect);
            this.renderer.setStyle(delegate,"display","inline");
            console.log(parent);
        break;
      }        
    }        
  }
  ngAfterViewChecked(){
    this.changeAssigneeInput();
    this.changeDelegateInput();
    //to detect the change and update assignee/delegate input  value
    this.bpmnJS.get('selection');
    //var selectedElements = this.bpmnJS.get('selection.changed').get();
    //console.info(selectedElements);
  }
  ngOnChanges(changes: SimpleChanges) {
    console.info(changes);
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
      console.log("changes.url.currentValue= "+changes.url.currentValue);
      this.sendBpmn();
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
    this.subscription.unsubscribe();
    this.bpmnSubscription.unsubscribe();
  }
  
  saveFile(isDraft:boolean, action: string){
    console.log("saveFile()");
    console.info(this.isValid());
    this.bpmnJS.saveXML({ format: true }, (err, xml) =>{
      // here xml is the bpmn format 
      console.info("xml===", xml);
      this.data.changeMessage(xml);
      let workflow= new Workflow(this.processName(),isDraft,xml,action);
      console.info(this.workflowRest.save(workflow));
      console.info(workflow);
    });
  }
  

  /**
   * Load diagram from URL and emit completion event
   */
  private loadUrl(url: string): Subscription {
    if ( url == null) return;
    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
  }
      
  private sendBpmn() {
    this.bpmn.changeMessage(this.bpmnJS);
    console.log(this.bpmnJS);
  }
  private onRightClick(event:any){
    this.rightClick.changeMessage(event);
  }


  private processName ():string {
    let elements = this.elementRegistry._elements;  
    let element;
    for (let k in elements) {
        element=elements[k].element;
        if (element.type=="bpmn:Process") {
          console.info("processName= "+element.id);
          return element.id;
        }
    }
    console.info("processName not found");
    return null; 
  }
  isValid ():boolean {
    let elements = this.bpmnJS.get('elementRegistry')._elements;  
    console.info(elements);
    console.info(Object.keys(elements).length);
    let element;
    let valid= true;
    for (let k in elements) {
        element=elements[k].element;
        console.info("------------------------------------------------------------------");
        console.info(element);
        if ((element.type.toLowerCase( ).includes('task')||element.type.toLowerCase( ).includes('start'))&&(element.outgoing.length==0)) valid=false;
        console.info("valid="+valid);
        if  (valid==false)   break;
    }
    console.info(valid+"******************************************************************");
    return valid; 
  }

  private getElement(elementType: string): any {
    let elementRegistry = this.bpmnJS.get('elementRegistry');  
    console.info(elementRegistry);
    let elements = elementRegistry.filter(function (element) {
      return is(element, elementType);
    });
    return elements;
  }
}