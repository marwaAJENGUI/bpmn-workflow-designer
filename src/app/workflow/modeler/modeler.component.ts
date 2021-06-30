import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './diagram/services/data.service';
import { DiagramComponent } from './diagram/diagram.component';
import { WorkflowService } from './../services/workflow.service';
import { Workflow } from './../../models/workflow';
import { ConfirmationDialogComponent } from './../../confirmation-dialog/confirmation-dialog.component';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { Actions } from './../../models/actions.enum';

@Component({
  selector: 'modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.css']
})
export class ModelerComponent implements OnInit, OnDestroy {

  // diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  // diagramUrl='https://cdn.statically.io/gh/bpmn-io/bpmn-js-integration/7d2585352af12ea80ad790bca5b5d4aa78a08065/test/spec/base/diagrams/test-labels-collaboration.bpmn'; 
  public diagramUrl: any = null;
  public importError?: Error;
  @ViewChild(DiagramComponent) private diagramComponent:DiagramComponent;
  private fileData:any;
  private subscription: Subscription;
  private dialogRef: MatDialogRef<ConfirmationDialogComponent>;
 
  constructor(private data: DataService, public dialog: MatDialog) { }
  ngOnInit() {
   this.subscription = this.data.currentMessage.subscribe(message => this.fileData = message);
 }
 ngOnDestroy() {
   this.subscription.unsubscribe();
 }
 private start(){
 
 }
 public saveXmlFile(isDraft:boolean, event : any, start: boolean){
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
 
  public handleImported(event) {
 
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
   private openConfirmationDialog(event : any) {
     let clientX : string =event.clientX+'px';
     let clientY : string =event.clientY+'px';
     console.info(clientX+"          "+clientY);
     this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       disableClose: false,
       position:  {top: clientX, left:clientY},
     });
     this.dialogRef.componentInstance.titleMessage = "Error";
     this.dialogRef.componentInstance.confirmMessage = "Process is missing end event!";
     this.dialogRef.componentInstance.confirmButton = "Got it";
     this.dialogRef.afterClosed().subscribe(result => {
       if(result) {
         // do confirmation actions
       }
       this.dialogRef = null;
     });
   }
 
}