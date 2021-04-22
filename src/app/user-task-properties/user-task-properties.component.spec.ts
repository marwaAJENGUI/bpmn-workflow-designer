import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaskPropertiesComponent } from './user-task-properties.component';

describe('UserTaskPropertiesComponent', () => {
  let component: UserTaskPropertiesComponent;
  let fixture: ComponentFixture<UserTaskPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTaskPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTaskPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
