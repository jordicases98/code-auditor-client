import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEntry } from './user-entry';

describe('UserEntry', () => {
  let component: UserEntry;
  let fixture: ComponentFixture<UserEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
