import { Component, inject } from '@angular/core';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import {
  DeliverableResponseDto,
  DeliverableService,
  StudentUserDto,
  TaskDto,
  UserDto,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { BehaviorSubject, finalize, map, take, throttleTime } from 'rxjs';
import { DeliverableForm, DeliverableResponseForm } from './task.form';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from '../../core/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { TaskEntryForm } from '../task-entry/task-entry.form';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-task-detail-component',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    AsyncPipe,
    RouterLink,
    MatCardActions,
    MatIcon,
    MatError,
    MatProgressSpinnerModule,
    MatOption,
    MatSelectModule,
  ],
  template: ` <mat-card class="mat-card-form">
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
            <mat-hint>TestInput1,TestOutput1,TestInput2,TestOutput2</mat-hint>
            <textarea
              matInput
              placeholder="Solution Test Cases"
              formControlName="solutionTestCases"
            ></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <input matInput [matDatepicker]="picker" formControlName="dueDate" />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          @if(!(isStudent$ | async)) {
          <mat-form-field appearance="outline">
            <mat-label>Student Assigned</mat-label>
            <mat-select formControlName="studentUserIds" required>
              @for (student of students; track student) {
              <mat-option [value]="student.id">{{ student.fullName }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          }
        </form>
        @if(isStudent$ | async) {
        <form [formGroup]="deliverableForm">
          <mat-form-field appearance="outline" class="file-field" appearance="outline">
            <mat-label>Upload deliverable</mat-label>
            <mat-hint
              >Allowed Extensions: C#, GO, JAVA, JS, PHP, PY, RB, RS, TS, plain text</mat-hint
            >
            <input
              matInput
              formControlName="fileContentSolution"
              [value]="fileName"
              placeholder="Choose a file"
              readonly
            />
            <button mat-icon-button matSuffix type="button" (click)="fileInput.click()">
              <mat-icon>attach_file</mat-icon>
            </button>
            <input
              #fileInput
              type="file"
              hidden
              (change)="onFileSelected($event)"
              [accept]="acceptedFormats"
            />
            @if(deliverableForm.controls.fileContentSolution.hasError('backendError')) {
            <mat-error class="error-message">
              {{ deliverableForm.controls.fileContentSolution.getError('backendError') }}
            </mat-error>
            }
          </mat-form-field>
        </form>
        <mat-card-actions class="actions-buttons">
          <button mat-raised-button color="primary" [routerLink]="['/task']">Go back</button>
          <span class="spacer"></span>
          <button
            mat-raised-button
            color="primary"
            (click)="submitDeliverableForm()"
            [disabled]="!deliverableForm.valid"
          >
            Submit
          </button>
        </mat-card-actions>
        }@if(showLoadingSpinner === true) {
        <mat-spinner class="spinner-loading"></mat-spinner>
        }
      </mat-card-content>
    </mat-card>
    @if(showDeliverable$ | async) {
    <button mat-raised-button color="primary" (click)="toggleReport()" class="toggle-report">
      Toggle Report
    </button>
    @if(openReportCard) {
    <mat-card>
      <mat-card-content>
        <form [formGroup]="deliverableResponseForm">
          <mat-form-field appearance="outline">
            <input matInput placeholder="Status" formControlName="status" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <input matInput placeholder="Sonar Url" formControlName="sonarProjectUrl" />
            <mat-hint><a [href]="externalUrl" target="_blank"> Sonar Project URL </a> </mat-hint>
          </mat-form-field>
        </form>
      </mat-card-content>
    </mat-card>
    } }`,
  styleUrl: './task-detail.component.scss',
  standalone: true,
})
export class TaskDetail {
  private deliverableService = inject(DeliverableService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  protected taskForm = new FormGroup<TaskEntryForm>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dueDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    studentUserIds: new FormControl<number[]>([], {
      nonNullable: true,
      validators: [],
    }),
    solutionTestCases: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected deliverableForm = new FormGroup<DeliverableForm>({
    fileContentSolution: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected deliverableResponseForm = new FormGroup<DeliverableResponseForm>({
    status: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    sonarProjectUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  isStudent$ = this.authService.hasAnyRole([UserTypeDto.Student]);
  showDeliverableSubject = new BehaviorSubject(false);
  showDeliverable$ = this.showDeliverableSubject.asObservable();

  taskData!: TaskDto;

  students!: UserDto[];

  acceptedFormats = '.cs,.go,.java,.js,.php,.py,.rb,.rs,.ts';

  fileName = '';

  showLoadingSpinner = false;

  openReportCard = false;

  externalUrl = '';

  userId$ = this.authService.userInfo$.pipe(
    map((u) => u?.id),
    take(1)
  );
  userId: number | undefined;

  constructor(private route: ActivatedRoute) {
    this.taskData = this.route.snapshot.data['task'] as TaskDto;
    this.students = this.route.snapshot.data['studentUsers'] as StudentUserDto[];
    this.userId$.subscribe((id) => (this.userId = id));
  }

  ngOnInit() {
    this.taskForm.setValue({
      title: this.taskData.title ?? '',
      description: this.taskData.description ?? '',
      dueDate: this.taskData.dueDate ?? '',
      solutionTestCases:
        this.taskData.solutionTestCases
          ?.map((tc) => [tc.testCaseInput, tc.testCaseOutput])
          .join(',') ?? '',
      studentUserIds: this.taskData.studentUsers!.flatMap((u) => (u.id ? [u.id] : [])),
    });
    this.taskForm.disable();
    if (this.isAfterToday(this.taskForm.controls.dueDate.value)) {
      this.deliverableForm.disable();
      this.toastService.showToast('error', 'Due Date is overdue', true);
    }
    if (this.userId && +this.userId === this.taskData.professorUser?.id) {
      this.taskForm.controls.studentUserIds.enable();
    } else if (this.taskData.id && this.userId) {
      this.getDeliverableByTaskAndUserCall(+this.taskData.id, +this.userId);
    }
    this.taskForm.controls.studentUserIds.valueChanges
      .pipe(throttleTime(300))
      .subscribe((studentId: any) => {
        if (studentId && this.taskData.id) {
          this.getDeliverableByTaskAndUserCall(+this.taskData.id, studentId);
        }
      });
  }

  private getDeliverableByTaskAndUserCall(taskId: number, userId: number) {
    this.deliverableService
      .getDeliverableByTaskAndUser(taskId, userId)
      .pipe(take(1))
      .subscribe({
        next: (report: DeliverableResponseDto) => {
          this.displayDeliverableResults(report);
        },
        error: () => {
          this.toastService.showToast('error', 'Report could not be found', false);
        },
      });
  }

  submitDeliverableForm() {
    const deliverableFormRaw = this.deliverableForm.getRawValue();
    if (this.taskData.id && !this.showLoadingSpinner) {
      this.showLoadingSpinner = true;
      this.deliverableService
        .commitDeliverable(deliverableFormRaw.fileContentSolution as Blob, this.taskData.id ?? 0)
        .pipe(
          take(1),
          finalize(() => (this.showLoadingSpinner = false))
        )
        .subscribe({
          next: (response) => {
            this.toastService.showToast('success', 'Deliverable created', false);
            this.displayDeliverableResults(response);
          },
          error: (errorResponse) => {
            this.toastService.showToast('error', 'Could not process deliverable', false);
            this.deliverableForm.controls.fileContentSolution.setErrors({
              backendError: errorResponse?.error?.detail,
            });
          },
        });
    }
  }

  onFileSelected(event: any) {
    const inputEvent = event.target;
    if (!inputEvent.files || inputEvent.files.length === 0) {
      return;
    }
    const file = inputEvent.files[0];

    const allowedExtensions = ['cs', 'go', 'java', 'js', 'php', 'py', 'rb', 'rs', 'ts'];
    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop();
    if (!allowedExtensions.includes(extension)) {
      alert('Invalid file type');
      inputEvent.value = '';
      return;
    }
    this.fileName = file.name;
    this.deliverableForm.patchValue({ fileContentSolution: file });
    this.deliverableForm.updateValueAndValidity();
  }

  private fillReportFrom(status: string, sonarProjectUrl: string) {
    this.deliverableResponseForm.setValue({
      status: status,
      sonarProjectUrl: sonarProjectUrl,
    });
    this.externalUrl = sonarProjectUrl;
    this.deliverableResponseForm.disable();
  }

  displayDeliverableResults(deliverableResults: DeliverableResponseDto) {
    this.fillReportFrom(deliverableResults.status ?? '', deliverableResults.sonarProjectUrl ?? '');
    this.showDeliverableSubject.next(true);
  }

  toggleReport() {
    this.openReportCard = !this.openReportCard;
  }

  isAfterToday(dateStr: string): boolean {
    const todayStr = new Date().toISOString().slice(0, 10);
    return todayStr > dateStr;
  }
}
