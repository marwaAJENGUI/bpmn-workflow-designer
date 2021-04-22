import { TestBed } from '@angular/core/testing';

import { ModelerRightClikEventService } from './modeler-right-clik-event.service';

describe('ModelerRightClikEventService', () => {
  let service: ModelerRightClikEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelerRightClikEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
