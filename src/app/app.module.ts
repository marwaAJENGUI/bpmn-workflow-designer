import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import {HttpClientModule} from '@angular/common/http';
import { FileUploadComponent } from './file-upload/file-upload.component'
import { FormsModule } from '@angular/forms';
import { FileSaveAsComponent } from './file-save-as/file-save-as.component';
import { UserTaskPropertiesComponent } from './user-task-properties/user-task-properties.component';
import { DataService } from './services/data.service';
import { BpmnJsService } from './services/bpmn-js.service';
import { ModelerRightClikEventService } from './services/modeler-right-clik-event.service';
@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    FileUploadComponent,
    FileSaveAsComponent,
    UserTaskPropertiesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    DataService,
    BpmnJsService,
    ModelerRightClikEventService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
