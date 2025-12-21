import { Component, inject } from '@angular/core';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  StudentUserDto,
  TaskDto,
  TaskRequestDto,
  TaskService,
  TestCaseDto,
  UserDto,
  UserService,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { take, tap } from 'rxjs';
import { TaskEntryForm } from './task-entry.form';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from '../../core/auth/auth.service';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { csvStringValidator } from '../../core/csv-string.validator';

@Component({
  selector: 'app-task-entry-component',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    Toast,
    MatInputModule,
    MatDatepickerModule,
    MatOption,
    RouterLink,
    MatSelectModule,
    MatButtonModule,
    MatCardActions
  ],
  template: ` <mat-card>
      <mat-card-title>Task Entry</mat-card-title>
      <mat-card-content>
        <form [formGroup]="taskForm">
          <!-- <mat-form-field>
            <input matInput placeholder="Task Id" formControlName="taskId" />
          </mat-form-field> -->
          <mat-form-field appearance="outline">
            <input matInput placeholder="Title" formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <textarea matInput placeholder="Description" formControlName="description"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Choose a date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate" [min]="minDate" />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Student Assigned</mat-label>
            <mat-select formControlName="studentUserIds" required multiple>
              @for (student of students; track student) {
              <mat-option [value]="student.id">{{ student.fullName }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-hint>TestInput1,TestOutput1,TestInput2,TestOutput2</mat-hint>
            <textarea
              matInput
              placeholder="Solution Test Cases"
              formControlName="solutionTestCases"
            ></textarea>
            @if(taskForm.controls.solutionTestCases.hasError('csvEmptyValue') ||
            taskForm.controls.solutionTestCases.hasError('csvMalformatted') ) {
            <mat-error> CSV is malformatted. Must follow csv input output pairs </mat-error>
            }
          </mat-form-field>
        </form>
        <mat-card-actions class="actions-buttons">
          <button mat-raised-button color="primary" [routerLink]="['/task']">Go back</button>
           <span class="spacer"></span>
          <button mat-raised-button color="primary" (click)="submitTaskForm()" [disabled]="!taskForm.valid">
            Submit
          </button>
        </mat-card-actions>
      </mat-card-content>
    </mat-card>
    <p-toast position="center"></p-toast>`,
  styleUrl: './task-entry.component.scss',
  standalone: true,
})
export class TaskEntry {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  protected taskForm = new FormGroup<TaskEntryForm>({
    taskId: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dueDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    studentUserIds: new FormControl<number[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    solutionTestCases: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, csvStringValidator],
    }),
  });
  minDate = new Date();

  students!: UserDto[];

  isProfessor$ = this.authService.hasAnyRole([UserTypeDto.Professor]);

  constructor(private messageService: MessageService, private route: ActivatedRoute) {
    this.students = this.route.snapshot.data['studentUsers'] as StudentUserDto[];

    const task: TaskDto = this.route.snapshot.data['task'];
    const lastPartUrl = this.router.url.split('?')[0].split('/').pop() ?? '0';
    if (task && +lastPartUrl === task.id) {
      let csvString = this.csvToStringTestCases(task);
      this.taskForm.setValue({
        taskId: task.id ?? 0,
        studentUserIds: (task.studentUsers?.flatMap((students) => students.id) as number[]) ?? [],
        title: task.title ?? '',
        description: task.description ?? '',
        dueDate: task.dueDate ?? '',
        solutionTestCases: csvString,
      });
    }
  }

  submitTaskForm() {
    const taskFormRaw = this.taskForm.getRawValue();
    const formattedTestCases: TestCaseDto[] = this.stringtoCsvTestCases(
      taskFormRaw.solutionTestCases
    );
    const taskDto = {
      title: taskFormRaw.title,
      description: taskFormRaw.description,
      dueDate: new Date(taskFormRaw.dueDate).toLocaleDateString('en-CA'),
      studentUserIds: taskFormRaw.studentUserIds,
      solutionTestCases: formattedTestCases,
    } as TaskRequestDto;
    if (!taskFormRaw.taskId) {
      this.taskService
        .createTask(taskDto)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.showToastSuccessTaskCreation();
            this.router.navigate(['/task']);
          },
          error: () => {
            alert('Could not create task');
          },
        });
    } else {
      this.taskService
        .updateTask(+taskFormRaw.taskId, taskDto)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.showToastSuccessTaskCreation();
            this.router.navigate(['/task']);
          },
          error: () => {
            alert('Could not update task');
          },
        });
    }
  }
  private csvToStringTestCases(task: TaskDto) {
    let csvString = '';
    task.solutionTestCases?.forEach((element) => {
      if (csvString?.length !== 0) {
        csvString = csvString + ',';
      }
      csvString = csvString.concat(element.testCaseInput + ',' + element.testCaseOutput);
    });
    return csvString;
  }

  private stringtoCsvTestCases(solutionTestCases: string) {
    const trimmedSplitTestCases = solutionTestCases
      .trim()
      .split(',')
      .map((p) => p.trim());
    const formattedTestCases: TestCaseDto[] = [];
    for (let i = 0; i < trimmedSplitTestCases.length; i += 2) {
      formattedTestCases.push({
        testCaseInput: trimmedSplitTestCases[i],
        testCaseOutput: trimmedSplitTestCases[i + 1],
      });
    }
    return formattedTestCases;
  }

  showToastSuccessTaskCreation() {
    this.messageService.add({
      severity: 'success',
      summary: 'Task created',
      sticky: true,
    });
  }
}
