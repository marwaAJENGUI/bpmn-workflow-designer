import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import BpmnViewer from 'bpmn-js/lib/viewer.js';
import { from,Observable, Subscription } from 'rxjs';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit,AfterViewInit {
  private bpmnViewer:BpmnViewer;
  private xml:string;
  private subscription: Subscription;

  constructor(    private data: DataService ) { }
  ngAfterViewInit():void{
    this.bpmnViewer=new BpmnViewer({ container: 'viewer' });
    this.importDiagram(this.xml);
    this.bpmnViewer.get('viewer').zoom('fit-viewport');
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
