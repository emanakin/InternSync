import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationTrackingComponent } from './application-tracking.component';

describe('ApplicationTrackingComponent', () => {
  let component: ApplicationTrackingComponent;
  let fixture: ComponentFixture<ApplicationTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationTrackingComponent]
    });
    fixture = TestBed.createComponent(ApplicationTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
