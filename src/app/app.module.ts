import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { FileUploadComponent } from './file-upload/file-upload.component'
import { FormsModule } from '@angular/forms';
import { FileSaveAsComponent } from './file-save-as/file-save-as.component';
import { from } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { WorkflowModule } from './workflow/workflow.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    FileSaveAsComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    WorkflowModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    })
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class AppModule { }
