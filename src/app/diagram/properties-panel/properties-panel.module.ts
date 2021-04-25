import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTaskPropertiesComponent } from './user-task-properties/user-task-properties.component';


@NgModule({
  declarations: [
    UserTaskPropertiesComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    UserTaskPropertiesComponent
  ]
})
export class PropertiesPanelModule { }
