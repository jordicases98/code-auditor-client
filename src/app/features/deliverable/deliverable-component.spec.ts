import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverableComponent } from './deliverable-component';

describe('DeliverableComponent', () => {
  let component: DeliverableComponent;
  let fixture: ComponentFixture<DeliverableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
