import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEntry } from './task-entry.component';

describe('TaskDetail', () => {
  let component: TaskEntry;
  let fixture: ComponentFixture<TaskEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
