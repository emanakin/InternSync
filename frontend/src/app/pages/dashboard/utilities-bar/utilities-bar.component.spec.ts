import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitiesBarComponent } from './utilities-bar.component';

describe('UtilitiesBarComponent', () => {
  let component: UtilitiesBarComponent;
  let fixture: ComponentFixture<UtilitiesBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UtilitiesBarComponent]
    });
    fixture = TestBed.createComponent(UtilitiesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
