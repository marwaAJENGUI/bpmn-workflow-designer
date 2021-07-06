import { AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import BpmnViewer from 'bpmn-js/lib/viewer.js';
import { from,Observable, Subscription } from 'rxjs';
import { DataService } from './../../services/data.service';
import minimapModule  from 'diagram-js-minimap';
import EmbeddedComments from 'bpmn-js-embedded-comments';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit,AfterViewInit,AfterViewChecked {
  private bpmnViewer:BpmnViewer;
  private xml:string;
  private subscription: Subscription;

  constructor(    private data: DataService ) { }
  
  ngAfterViewInit():void{
    this.bpmnViewer=new BpmnViewer({ 
      container: 'viewer', 
      additionalModules: [
        minimapModule,
        EmbeddedComments
      ]
    });
    this.importDiagram(this.xml);    
  }
  ngAfterViewChecked(){
    this.bpmnViewer.on('canvas.click', function() {
      this.bpmnViewer.get('comments').collapseAll();
      console.log("momments->collapseAll")
    });
  }
  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(message => {
      if (message!='default message') {
        this.xml = message;
      }
    });
  }

  
  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    return from(this.bpmnViewer.importXML(xml) as Promise<{warnings: Array<any>}>);
  }

}
