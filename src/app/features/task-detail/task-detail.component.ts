import { Component, inject } from '@angular/core';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DeliverableDto,
  DeliverableResponseDto,
  DeliverableService,
  TaskDto,
  TaskService,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { take } from 'rxjs';
import { DeliverableForm, TaskDetailForm } from './task.form';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from '../../core/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-task-detail-component',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    Toast,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    AsyncPipe,
    RouterLink,
    MatCardActions,
    MatIcon,
  ],
  template: ` <mat-card>
      <mat-card-title>Task Details</mat-card-title>
      <mat-card-content>
        <form [formGroup]="taskForm">
          <mat-form-field appearance="outline">
            <input matInput placeholder="Title" formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <textarea matInput placeholder="Description" formControlName="description"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <input matInput [matDatepicker]="picker" formControlName="dueDate" />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </form>
        @if(isStudent$ | async) {
        <form [formGroup]="deliverableForm">
          <mat-form-field appearance="outline" class="file-field" appearance="outline">
            <mat-label>Upload deliverable</mat-label>
            <input matInput [value]="fileName" placeholder="Choose a file" readonly />
            <button mat-icon-button matSuffix type="button" (click)="fileInput.click()">
              <mat-icon>attach_file</mat-icon>
            </button>
            <input #fileInput type="file" hidden (change)="onFileSelected($event)" />
          </mat-form-field>
        </form>
        <mat-card-actions align="end">
          <button matButton="filled" [routerLink]="['/task']">Go back</button>
          <div fxFlex></div>
          <button
            matButton="filled"
            (click)="submitDeliverableForm()"
            [disabled]="!deliverableForm.valid"
          >
            Submit
          </button>
        </mat-card-actions>
        }
      </mat-card-content>
    </mat-card>
    <p-toast position="center"></p-toast>`,
  styleUrl: './task-detail.component.scss',
  standalone: true,
})
export class TaskDetail {
  private deliverableService = inject(DeliverableService);
  private authService = inject(AuthService);

  protected taskForm = new FormGroup<TaskDetailForm>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dueDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected deliverableForm = new FormGroup<DeliverableForm>({
    fileContentSolution: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  isStudent$ = this.authService.hasAnyRole([UserTypeDto.Student]);

  taskData!: TaskDto;

  deliverableId = 0;

  fileName = '';

  constructor(private messageService: MessageService, private route: ActivatedRoute) {
    this.taskData = this.route.snapshot.data['task'] as TaskDto;
    this.taskForm.setValue({
      title: this.taskData.title ?? '',
      description: this.taskData.description ?? '',
      dueDate: this.taskData.dueDate ?? '',
    });
    this.taskForm.disable();
    this.deliverableId = this.route.snapshot.data['deliverable'];
  }

  ngOnInit() {
  }

  submitDeliverableForm() {
    const deliverableFormRaw = this.deliverableForm.getRawValue();
    if (this.taskData.id) {
      // const formData = new FormData();
      // formData.append('fileContentSolution', deliverableFormRaw.fileContentSolution ?? null);
      // formData.append('taskId', this.taskData.id);
      if (!this.deliverableId) {
        this.deliverableService
          .commitDeliverable(deliverableFormRaw.fileContentSolution as Blob, this.taskData.id ?? 0)
          .pipe(take(1))
          .subscribe({
            next: (response) => {
              this.displayDeliverableResults(response);
            },
            error: () => {
              alert('Could not process deliverable');
            },
          });
      } else {
        this.deliverableService
          .updateDeliverable(
            this.deliverableId,
            deliverableFormRaw.fileContentSolution as Blob,
            this.taskData.id
          )
          .pipe(take(1))
          .subscribe({
            next: (response) => {
              this.displayDeliverableResults(response);
            },
            error: () => {
              alert('Could not process deliverable');
            },
          });
      }
    }
  }

  showToastSuccessUserCreation() {
    this.messageService.add({
      severity: 'success',
      summary: 'Task created',
      sticky: true,
    });
  }

  onFileSelected(event: any) {
    const inputEvent = event.target;
    if (!inputEvent.files || inputEvent.files.length === 0) {
      return;
    }
    const file = inputEvent.files[0];
    this.fileName = file.name;
    this.deliverableForm.patchValue({ fileContentSolution: file });
    this.deliverableForm.updateValueAndValidity();
  }

  displayDeliverableResults(deliverableResults: DeliverableResponseDto) {}
}
