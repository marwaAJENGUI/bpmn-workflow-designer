import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './data.service';
import { DiagramComponent } from './diagram/diagram.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'bpmn-io';
 // diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
 diagramUrl='https://cdn.statically.io/gh/bpmn-miwg/bpmn-miwg-test-suite/5463406cee7ad7f5abd63f89b8c93ef30920e619/MID%20bpanda%202019.05.0.8393/B.2.0-export.bpmn'; 
 importError?: Error;
 @ViewChild(DiagramComponent) diagramComponent:DiagramComponent;
 fileData:any;
 subscription: Subscription;

 constructor(private data: DataService) { }
 ngOnInit() {
  this.subscription = this.data.currentMessage.subscribe(message => this.fileData = message);
}
ngOnDestroy() {
  this.subscription.unsubscribe();
}

 saveXmlFile(){
   console.log("app->saveXmlFile()");
   this.diagramComponent.saveFile();
 }

 handleImported(event) {

    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

}
