import { TestBed } from '@angular/core/testing';

import { BpmnJsService } from './bpmn-js.service';

describe('BpmnJSService', () => {
  let service: BpmnJsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmnJsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
