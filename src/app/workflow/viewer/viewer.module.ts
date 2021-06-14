import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './viewer/viewer.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ViewerComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    ViewerComponent
  ]
})
export class ViewerModule { }
