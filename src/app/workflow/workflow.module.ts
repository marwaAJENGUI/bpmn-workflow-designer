import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowComponent } from './workflow.component';
import { ModelerModule } from './modeler/modeler.module';
import { ViewerModule } from './viewer/viewer.module';
import { RouterModule } from '@angular/router';
import { DataService } from './services/data.service';



@NgModule({
  declarations: [
    WorkflowComponent,
  ],
  imports: [
    CommonModule,
    ModelerModule,
    ViewerModule,
    RouterModule
  ],
  exports:[
    WorkflowComponent,
    ModelerModule,
    ViewerModule
  ],
  providers: [
    DataService
  ]
})
export class WorkflowModule { }
