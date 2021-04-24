import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';
import { DiagramComponent } from './diagram/diagram.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'bpmn-io';
 // diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
 diagramUrl='https://cdn.statically.io/gh/bpmn-io/bpmn-js-integration/7d2585352af12ea80ad790bca5b5d4aa78a08065/test/spec/base/diagrams/test-labels-collaboration.bpmn'; 
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
