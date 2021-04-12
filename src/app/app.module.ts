import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import {HttpClientModule} from '@angular/common/http';
import { FileUploadComponent } from './file-upload/file-upload.component'
import { FormsModule } from '@angular/forms';
import { FileSaveAsComponent } from './file-save-as/file-save-as.component';
import { DataService } from './data.service';
@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    FileUploadComponent,
    FileSaveAsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
