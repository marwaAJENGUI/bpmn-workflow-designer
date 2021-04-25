import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { FileUploadComponent } from './file-upload/file-upload.component'
import { FormsModule } from '@angular/forms';
import { FileSaveAsComponent } from './file-save-as/file-save-as.component';
import { DiagramModule } from './diagram/diagram.module';
import { from } from 'rxjs';
@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    FileSaveAsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    DiagramModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
