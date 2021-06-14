import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelerComponent } from './modeler.component';
import { DiagramModule } from './diagram/diagram.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ModelerComponent,
  ],
  imports: [
    CommonModule,
    DiagramModule,
    RouterModule
  ],
  exports:[
    ModelerComponent,
    DiagramModule,
  ]
})
export class ModelerModule { }
