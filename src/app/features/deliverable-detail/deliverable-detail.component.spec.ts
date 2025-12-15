import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverableDetail } from './deliverable-detail.component';

describe('DeliverableDetail', () => {
  let component: DeliverableDetail;
  let fixture: ComponentFixture<DeliverableDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverableDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverableDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
