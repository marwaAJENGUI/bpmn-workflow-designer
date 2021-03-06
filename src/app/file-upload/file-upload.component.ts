import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../workflow/services/data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit,OnDestroy {

  private fileToUpload: File = null;
  private file:File=null;
  private fileData:any;
  private subscription: Subscription;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(message => {
      if (message!='default message') {
        this.fileData = message;
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  public handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log("fileToUpload= "+this.fileToUpload);
    console.log("fileToUpload.name= "+this.fileToUpload.name);
    console.log("fileToUpload.type= "+this.fileToUpload.type);
    console.log("fileToUpload.size= "+this.fileToUpload.size);
}
public uploadDocument() {
  let fileReader = new FileReader();
  fileReader.onload = (e) => {
    console.log(fileReader.result);
    this.data.changeMessage(fileReader.result);
  }
  fileReader.readAsText(this.fileToUpload);
}

}
