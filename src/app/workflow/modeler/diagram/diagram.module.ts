import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from './diagram.component';
import { PropertiesPanelModule } from './properties-panel/properties-panel.module';
import { BpmnJsService } from './services/bpmn-js.service';
import { ModelerRightClikEventService } from './services/modeler-right-clik-event.service';


@NgModule({
  declarations: [
    DiagramComponent,
  ],
  imports: [
    CommonModule,
    PropertiesPanelModule,
  ],
  exports:[
    DiagramComponent,
    PropertiesPanelModule
  ],
  providers: [
    BpmnJsService,
    ModelerRightClikEventService,
  ],
})
export class DiagramModule { }
