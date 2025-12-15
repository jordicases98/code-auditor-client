import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskDto, TaskService, UserTypeDto } from '../../../../target/generated-sources';
import { take } from 'rxjs';
import { DeliverableForm, TaskForm } from './task.form';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-task-detail-component',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    Toast,
    MatInputModule,
    MatDatepickerModule,
  ],
  template: ` <mat-card>
      <mat-card-title>Task Details</mat-card-title>
      <mat-card-content>
        <form [formGroup]="taskForm">
          <mat-form-field>
            <input matInput placeholder="Task Id" formControlName="taskId" [disabled]="true" />
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="User Id" formControlName="userId" [disabled]="true" />
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="Title" formControlName="title" />
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="Description" formControlName="description" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Choose a date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate" />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </form>
        <form [formGroup]="taskForm">
          <mat-form-field>
            <input matInput type="file" placeholder="File" formControlName="title" />
          </mat-form-field>
        </form>
        <button matButton="filled" (click)="submitTaskForm()" [disabled]="!taskForm.valid">
          Submit
        </button>
      </mat-card-content>
    </mat-card>
    <p-toast position="center"></p-toast>`,
  styleUrl: './task-detail.component.scss',
  standalone: true,
})
export class TaskDetail {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private authService = inject(AuthService);

  protected taskForm = new FormGroup<TaskForm>({
    taskId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    userId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dueDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    solutionTestCases: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected deliverableForm = new FormGroup<DeliverableForm>({
    fileContentSolution: new FormControl('' as unknown as File, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  isProfessor$ = this.authService.hasAnyRole([UserTypeDto.Professor]);
  
  constructor(private messageService: MessageService, private route: ActivatedRoute) {}

  ngOnInit() {
    const task: TaskDto = this.route.snapshot.data[0]?.task;
    if (task && this.route?.parent?.snapshot.url[2].path !== 'new') {
      this.taskForm.setValue({
        taskId: '',
        userId: '',
        title: '',
        description: '',
        dueDate: '',
      });
    }
  }

  submitTaskForm() {
    const taskFormRaw = this.taskForm.getRawValue();
    const taskDto = {} as TaskDto;
    if (!taskFormRaw.userId) {
      this.taskService
        .createTask(taskDto)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.showToastSuccessUserCreation();
            this.router.navigate(['/task']);
          },
          error: () => {
            alert('Could not create task');
          },
        });
    } else {
      this.taskService
        .updateTask(+taskFormRaw.userId, taskDto)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.showToastSuccessUserCreation();
            this.router.navigate(['/task']);
          },
          error: () => {
            alert('Could not update task');
          },
        });
    }
  }

  showToastSuccessUserCreation() {
    this.messageService.add({
      severity: 'success',
      summary: 'Task created',
      sticky: true,
    });
  }
}
