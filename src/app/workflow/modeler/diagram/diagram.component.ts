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
import { DataService } from './services/data.service';
import { BpmnJsService } from './services/bpmn-js.service';
import { ModelerRightClikEventService } from './services/modeler-right-clik-event.service';
import  {default as customControlsModule}  from './custom';
import { Workflow } from '../../../models/workflow';
import { WorkflowService } from './../../services/workflow.service';
//import * as fs from "fs";
//import  fs from "fs";
//import * as path from 'path';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Actions } from '../../../models/actions.enum';

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
  private users=["muhamed","amin","fathi"];
  private userSelect: string;
  private script:string=null;
  constructor(private http: HttpClient,
    private renderer:Renderer2,
    private data: DataService,
    private bpmn:BpmnJsService,
    private rightClick:ModelerRightClikEventService,
    private workflowRest: WorkflowService
  ){
    this.userSelect=this.setUserSelect(this.users);
    this.script=this.setScript();
  }
  setScript():string{
    let script="<script>";
    script+=`var onAssigneeChange= function () {
      let userList = document.getElementById("select-user");
      let userId = userList.value;
      let assignee=document.getElementById("camunda-assignee");
      assignee.value=userId;
      console.log(assignee);
  }`;
    script+="</script>";
    return script;
  }
  setUserSelect(users:string[]):string{
    let userSelect=`<select onchange="onAssigneeChange()" id="select-user">`;
    for (let i of this.users){
      userSelect+= `<option value = "`+i+`" >`+i+`</option>`;
    }
    userSelect+=`</select>`;
    return userSelect;
  }
  ngOnInit(): void { 
    this.subscription = this.data.currentMessage.subscribe(message => {
      if (message!='default message') {
        this.fileData = message;
        this.importDiagram(this.fileData);
        this.sendBpmn();
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
  }
  ngAfterViewInit():void{
    this.bpmnJS = new BpmnJS({
      container: "#diagram-component",
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        minimapModule,
        propertiesPanelModule,
        propertiesProviderModule,
        customControlsModule,
      ],
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
    this.bpmnJS.createDiagram();
    if (this.url!=null) {
      this.loadUrl(this.url);
      console.log("this.url "+this.url);
    }
    this.sendBpmn();
    
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
      if(this.el.nativeElement.contains(event.target)) {
        var newContent = `<p id='camunda-assignee'>ppppppp</p>`;  
        let elements = this.panel.nativeElement.querySelector('.bpp-field-wrapper');  
        console.log(elements);
        if(elements.querySelector('#camunda-assignee')) this.renderer.setProperty(elements, 'innerHTML', newContent);
         elements = this.panel.nativeElement.querySelector('#camunda-assignee');
         
        console.log(elements);  
    }
  }
*/
  onAssigneeChange() {
    let userList =this.panel.nativeElement.querySelector('#select-user');
    let userId = userList.value;
    let assignee= this.panel.nativeElement.querySelector('#camunda-assignee');
    assignee.value=userId;
    console.log(assignee);
  }
  ngAfterViewChecked(){
  /*  var newContent = `<select id="listbox1 id='camunda-assignee'">
    <option value="Green">Green</option>
    <option selected value="Orange">Orange</option>
    <option value="Red">Red</option>
    <option>Blue</option>
    <option>Violet</option>
    <option>Periwinkle</option>
 </select>`;  
  */
    let selectUser=this.panel.nativeElement.querySelector('#select-user');
    if (selectUser==null){
      console.info(selectUser);
      let assignee=this.panel.nativeElement.querySelector('#camunda-assignee');
      if(assignee) {
        let parent=this.renderer.parentNode(assignee); 
        console.log(parent);
        this.renderer.setProperty(parent, 'innerHTML', this.userSelect);
        //this.renderer.destroyNode(assignee);
        this.renderer.appendChild(parent,assignee);
        //this.renderer.setProperty(parent, 'innerHTML', this.userSelect); 
        this.renderer.setStyle(assignee,"display","none");
        console.log(parent);
      }
    }     
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
      //let file = new File ([xml],"text.xml", {type: 'text/xml'});
      
      //fs.appendFile(path.join(__dirname,'../../assets/mynewfile1.txt'), 'Hello content!', function (err) {
      /*
      fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
          if (err) throw err;
        console.log('Saved!');
      });
      */
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
    let elements = this.bpmnJS.get('elementRegistry')._elements;  
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
    /*if (changes.content) {
      console.log("changes.content.currentValue"+changes.content.currentValue);
      if (this.content!='default message') this.importDiagram(this.content);
     /*  this.bpmnJS.importXML(this.content,(err, warnings) => {
        if (err) {
          this.importDone.emit({
            type: 'error',
            error: err
          })
        } else {
          this.importDone.emit({
            type: 'success',
            warnings: warnings
          });
        }
      });
    } */
