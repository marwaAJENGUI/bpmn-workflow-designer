import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTaskPropertiesComponent } from './user-task-properties/user-task-properties.component';
import { ExclusiveGatewayPanelComponent } from './exclusive-gateway-panel/exclusive-gateway-panel.component';


@NgModule({
  declarations: [
    UserTaskPropertiesComponent,
    ExclusiveGatewayPanelComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    UserTaskPropertiesComponent,
    ExclusiveGatewayPanelComponent,
  ]
})
export class PropertiesPanelModule { }
