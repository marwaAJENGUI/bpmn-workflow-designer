import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveGatewayPanelComponent } from './exclusive-gateway-panel.component';

describe('ExclusiveGatewayPanelComponent', () => {
  let component: ExclusiveGatewayPanelComponent;
  let fixture: ComponentFixture<ExclusiveGatewayPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExclusiveGatewayPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusiveGatewayPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
