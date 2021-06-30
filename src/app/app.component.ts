import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './workflow/modeler/diagram/services/data.service';
import { DiagramComponent } from './workflow/modeler/diagram/diagram.component';
import { WorkflowService } from './workflow/services/workflow.service';
import { Workflow } from './models/workflow';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { Actions } from './models/actions.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
 constructor() { }
 ngOnInit() {}
}
