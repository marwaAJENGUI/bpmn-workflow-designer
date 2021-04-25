import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../diagram/services/data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit,OnDestroy {

  fileToUpload: File = null;
  file:File=null;
  fileData:any;
  subscription: Subscription;

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
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log("fileToUpload= "+this.fileToUpload);
    console.log("fileToUpload.name= "+this.fileToUpload.name);
    console.log("fileToUpload.type= "+this.fileToUpload.type);
    console.log("fileToUpload.size= "+this.fileToUpload.size);
}
uploadDocument() {
  let fileReader = new FileReader();
  fileReader.onload = (e) => {
    console.log(fileReader.result);
    this.data.changeMessage(fileReader.result);
  }
  fileReader.readAsText(this.fileToUpload);
}

}
