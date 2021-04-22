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
  AfterViewInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

//import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import BpmnJS from 'bpmn-js/lib/Modeler.js';
import  userTaskExtension from './../../resources/user-task-properties.json';
import minimapModule  from 'diagram-js-minimap';

import { from, Observable, Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { BpmnJsService } from '../services/bpmn-js.service';
import { ModelerRightClikEventService } from '../services/modeler-right-clik-event.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: [
    './diagram.component.css',
    '../user-task-properties/user-task-properties.component.css'
  ]
})
export class DiagramComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  private bpmnJS: BpmnJS;

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  @Input() private url: string;
  fileData:any;
  subscription: Subscription;
  bpmnData:any;
  bpmnSubscription: Subscription;
  rightClickEvent:any;
  rightClickSubscription: Subscription;

  constructor(private http: HttpClient, private data: DataService, private bpmn:BpmnJsService, private rightClick:ModelerRightClikEventService) { }
  
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
       // ?????????????????????????
      }
    });
  }
  ngAfterViewInit():void{
    this.bpmnJS = new BpmnJS({
      container: "#diagram-component",
      additionalModules: [
        minimapModule
      ],
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
    this.bpmnJS.on('element.contextmenu', 1500, (event) => {
      this.onRightClick(event);
      console.log("diagram send right click event");
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();  
    });
  }
  

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
      console.log("changes.url.currentValue"+changes.url.currentValue);
      this.sendBpmn();
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
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
    this.subscription.unsubscribe();
    this.bpmnSubscription.unsubscribe();
  }
  
  saveFile(){
    console.log("sendFile()");
    this.bpmnJS.saveXML({ format: true }, (err, xml) =>{
      // here xml is the bpmn format 
      console.log("xml===", xml);
      this.data.changeMessage(xml);
    });
  }


  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {
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
  sendBpmn() {
    this.bpmn.changeMessage(this.bpmnJS);
    console.log(this.bpmnJS);
  }
  onRightClick(event:any){
    this.rightClick.changeMessage(event);
  }
}