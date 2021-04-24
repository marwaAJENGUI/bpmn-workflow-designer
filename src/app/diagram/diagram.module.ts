import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from './diagram.component';



@NgModule({
  declarations: [
    DiagramComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    DiagramComponent
  ]
})
export class DiagramModule { }
