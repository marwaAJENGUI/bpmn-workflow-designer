import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BpmnJsService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor() {  
  }

  changeMessage(message: any) {
    console.info("BpmnJsService.changeMessage()= "+message);
    this.messageSource.next(message);
  }

}
