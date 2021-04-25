import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, Renderer2, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BpmnJsService } from '../../services/bpmn-js.service';
import BpmnJS from 'bpmn-js/lib/Modeler.js';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { ModelerRightClikEventService } from '../../services/modeler-right-clik-event.service';

@Component({
  selector: 'app-user-task-properties',
  templateUrl: './user-task-properties.component.html',
  styleUrls: ['./user-task-properties.component.css']
})
export class UserTaskPropertiesComponent implements AfterViewInit {

  @ViewChild("panel") panelEl: ElementRef;
  private formEl;
  private assigneeEl;
  private warningEl;
  private okayEl;
  //showPanel=true;
  bpmnData:any;
  bpmnSubscription: Subscription;
  private bpmnJS: BpmnJS;
  rightClickEvent:any;
  rightClickSubscription: Subscription;
  static readonly HIGH_PRIORITY = 1500;
  businessObject:getBusinessObject;
  newAssignee: any;
  assignee: any;
  moddle: any;
  modeling: any;
  element:any;
  static readonly USER_TASK = "bpmn:UserTask";

/*
        lastCheckedEl = document.getElementById('last-checked'),
  */
  constructor(private renderer2: Renderer2,private elRef: ElementRef, private bpmn:BpmnJsService, private rightClick:ModelerRightClikEventService) {}

  
  ngAfterViewInit(){
    this.formEl=this.panelEl.nativeElement.children["form"];
    this.assigneeEl=this.panelEl.nativeElement.children["form"]["assignee"];
    this.warningEl=this.panelEl.nativeElement.children["form"]["warning"];
    this.okayEl=this.panelEl.nativeElement.children["form"]["okay"];
    this.hidepanel();
    
    this.bpmnSubscription = this.bpmn.currentMessage.subscribe(message => {
      if (message!='default message') {
        this.bpmnJS=message;
        console.log(">>>>>>>>>>>>>UserTaskPropertiesComponent>>>>>>>>>>>>>>>ngAfterViewInit()");
        console.info(this.bpmnJS);
      }
    });
    // open user task properties panel if user right clicks on element
    this.rightClickSubscription = this.rightClick.currentMessage.subscribe(message => {
      if (message!='default message') {
        this.rightClickEvent = message;
        let element:any;
        console.info(this.rightClickEvent);
        ({element } = this.rightClickEvent);
        if (element.type !=UserTaskPropertiesComponent.USER_TASK){
          if(this.elRef.nativeElement.children.length>1){
            this.hidepanel();
          }
          return;
        }
        this.showPanel();
        this.element=element;
        // ignore root element
        if (!element.parent) {
          return;
        }

        this.businessObject = getBusinessObject(element);
        console.info(this.businessObject);
        this.assignee  = this.businessObject['$attrs']['activiti:assignee']||this.businessObject['$attrs'].assignee||'';
      }
    });
 }

  // set suitability core and last checked if user submits
  handleProperties(){
    this.moddle = this.bpmnJS.get('moddle');
    this.modeling = this.bpmnJS.get('modeling');
    console.info(this.moddle);
    var ElementVariables = this.moddle.create('bpmn:ExtensionElements');
    console.info(ElementVariables);
    this.moddle.create('bpmn:ExtensionElements');
    const extensionElements = this.businessObject.extensionElements || this.moddle.create('bpmn:ExtensionElements');
    console.info(extensionElements);
    //this.validate();
    this.assignee=this.assigneeEl.value;
    if (this.businessObject['$attrs'].assignee){
      this.modeling.updateProperties(this.element, {
        extensionElements,
        "assignee": this.assignee
      });
    }else{
        this.modeling.updateProperties(this.element, {
          extensionElements,
          "activiti:assignee": this.assignee
      });

    }
    console.info(this.element);
    this.businessObject.extensionElements.get('values').push(ElementVariables);  
    this.hidepanel();
    this.bpmnJS.saveXML({ format: true }, (err, xml) =>{
      // here xml is the bpmn format 
      console.log("xml===", xml);
    });
  }

  validate(){
    if (!this.assigneeEl.value) return;
  }

  showPanel() {
    let x= this.rightClickEvent.originalEvent.screenX,
      y= this.rightClickEvent.originalEvent.screenY;
    this.panelEl.nativeElement.setAttribute(
      'style',
      'position: absolute; left: '+x+'px; top: '+y+'px;'
    );
    console.log(this.panelEl.nativeElement);
    this.renderer2.appendChild(this.elRef.nativeElement, this.panelEl.nativeElement);
  }

 

  // hide user properties panel if user click escape
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.hidepanel();
  }

  hidepanel(){
    this.renderer2.removeChild(this.elRef.nativeElement, this.panelEl.nativeElement);
  }

}
/*
    //this.renderer2.addClass(this.panelEl.nativeElement,"hidden");
    //this.renderer2.removeClass(this.panelEl.nativeElement,"hidden");
    
    console.log(this.panelEl);
    //console.log(">>>>>>>>>>>>showPanel= "+this.showPanel);
    let hostElem = this.panelEl.nativeElement;
    console.log(hostElem.children["form"]["assignee"].type);
    console.log(hostElem.children["form"]["warning"].type);
    //hostElem.children["form"]["assignee"].innerHTML=200; // < ... id="assignee">200</...>
    //hostElem.children["form"]["assignee"].value=200; // < ... id="assignee" value = 200 >
    console.log(this.panelEl.nativeElement.children[0].offsetHeight); // valeur en pixels de la hauteur totale de l'élément
    console.log(hostElem.children["form"]["assignee"]);

    console.log(hostElem.parentNode);

    //this.divView.nativeElement.innerHTML = "Hello Angular 10!";
// hide properties palet when user click outside the component
  /*
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      this.eRef.nativeElement.className='hidden'; // hidden style in the parent component
    }
  }
  */