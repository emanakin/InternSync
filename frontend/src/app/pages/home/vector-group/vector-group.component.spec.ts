import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorGroupComponent } from './vector-group.component';

describe('VectorGroupComponent', () => {
  let component: VectorGroupComponent;
  let fixture: ComponentFixture<VectorGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VectorGroupComponent]
    });
    fixture = TestBed.createComponent(VectorGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
