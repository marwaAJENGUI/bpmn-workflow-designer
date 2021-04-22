import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ModelerRightClikEventService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor() {  
  }

  changeMessage(message: any) {
    console.log("ModelerRightClikEventService.changeMessage()= "+message);
    this.messageSource.next(message);
  }

}
