import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './diagram/services/data.service';
import { DiagramComponent } from './diagram/diagram.component';
import { WorkflowService } from './diagram/services/workflow.service';
import { Workflow } from './models/workflow';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { Actions } from './models/actions.enum';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'bpmn-io';
 // diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
 // diagramUrl='https://cdn.statically.io/gh/bpmn-io/bpmn-js-integration/7d2585352af12ea80ad790bca5b5d4aa78a08065/test/spec/base/diagrams/test-labels-collaboration.bpmn'; 
 diagramUrl: any = null;
 importError?: Error;
 @ViewChild(DiagramComponent) diagramComponent:DiagramComponent;
 fileData:any;
 subscription: Subscription;
 dialogRef: MatDialogRef<ConfirmationDialogComponent>;
 popoverTitle = 'Popover title';
 popoverMessage = 'Popover description';
 confirmClicked = false;
 cancelClicked = false;

 constructor(private data: DataService, public dialog: MatDialog) { }
 ngOnInit() {
  this.subscription = this.data.currentMessage.subscribe(message => this.fileData = message);
}
ngOnDestroy() {
  this.subscription.unsubscribe();
}
start(){

}
saveXmlFile(isDraft:boolean, event : any, start: boolean){
  setTimeout(()=> {
    console.log("app->saveXmlFile()");
    if (!isDraft && !this.diagramComponent.isValid()) {
      this.openConfirmationDialog(event);
      return;
    }
    let action:string;
    if (start) {action=Actions[Actions.CREATE_AND_START_WORKFLOW];}
    else  {action=Actions[Actions.CREATE_WORKFLOW];}
    console.info("action= "+action);
    this.diagramComponent.saveFile(isDraft,action);
  },1000);  
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
  openConfirmationDialog(event : any) {
    let clientX : string =event.clientX+'px';
    let clientY : string =event.clientY+'px';
    console.info(clientX+"          "+clientY);
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      position:  {top: clientX, left:clientY},
    });
    this.dialogRef.componentInstance.confirmMessage = "Process is missing end event!"
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        // do confirmation actions
      }
      this.dialogRef = null;
    });
  }
}
