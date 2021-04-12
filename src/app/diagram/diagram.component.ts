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
  EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

//import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import BpmnJS from 'bpmn-js/lib/Modeler.js';
import * as minimapModule  from 'diagram-js-minimap';

import { from, Observable, Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {
  private bpmnJS: BpmnJS;

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  @Input() private url: string;
  @Input() content: any;
  fileData:any;
  subscription: Subscription;
  
  constructor(private http: HttpClient, private data: DataService) {

    this.bpmnJS = new BpmnJS({
      additionalModules: [
        minimapModule
      ]
    });
    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }
  
  ngOnInit(): void { 
    this.bpmnJS.createDiagram();
    this.subscription = this.data.currentMessage.subscribe(message => this.fileData = message);
  }
  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }



  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
      console.log("changes.url.currentValue"+changes.url.currentValue);
    }
    /*************************
     *  fasa5 content w ma teb3ou 
     *************************************/
    if (changes.content) {
      console.log("changes.content.currentValue"+changes.content.currentValue);
      this.importDiagram(this.content);
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
      }); */
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
    this.subscription.unsubscribe();
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

  

}