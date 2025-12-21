import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { TaskDto, TaskService, UserTypeDto } from '../../../../target/generated-sources';
import { AsyncPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { TruncatePipe } from '../../core/pipe/truncate.pipe';
import { take } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
const datePipe = new DatePipe('es-ES');

interface TaskView {
  id?: number;
  title?: string;
  description?: string;
  dueDate?: string;
  professor?: string;
}

@Component({
  selector: 'app-task-component',
  standalone: true,
  template: `
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Id</th>
        <td mat-cell *matCellDef="let element">{{ element.id }}</td>
      </ng-container>

      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Title</th>
        <td mat-cell *matCellDef="let element">{{ element.title }}</td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let element">{{ element.description | truncate : 500 }}</td>
      </ng-container>

      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef>Due Date</th>
        <td mat-cell *matCellDef="let element">{{ element.dueDate }}</td>
      </ng-container>

      <ng-container matColumnDef="professor">
        <th mat-header-cell *matHeaderCellDef>Professor</th>
        <td mat-cell *matCellDef="let element">{{ element.professor }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button (click)="viewTask(element.id)">
            <mat-icon>assignment</mat-icon>
          </button>
          @if(isProfessor$| async) {
          <button mat-icon-button (click)="editTask(element.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteTask(element.id)">
            <mat-icon>delete</mat-icon>
          </button>
          } @if((isStudent$ | async) && element.hasDeliverable) {
          <button mat-icon-button (click)="viewReport(element.id)">
            <mat-icon>check_circle</mat-icon>
          </button>
          }
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    @if(isProfessor$| async) {
    <button mat-icon-button (click)="createTask()" class="add-button">
      <mat-icon>add</mat-icon>
    </button>
    }
  `,
  styleUrl: './task.component.scss',
  imports: [MatTableModule, MatIconModule, AsyncPipe, TruncatePipe],
})
export class TaskComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);

  protected isProfessor$ = this.authService.hasAnyRole([UserTypeDto.Professor]);
  protected isStudent$ = this.authService.hasAnyRole([UserTypeDto.Student]);

  displayedColumns: string[] = ['title', 'description', 'date', 'professor', 'actions'];
  dataSource: TaskView[] = [];

  constructor(private route: ActivatedRoute) {
    const taskData = this.route.snapshot.data['tasks'] as TaskDto[];
    const taskMapped = taskData.map((task: TaskDto) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: datePipe.transform(task.dueDate, 'dd-MM-yyyy'),
      professor: task.professorUser?.fullName,
      hasDeliverable: task.deliverables!.length > 0,
    })) as TaskView[];
    this.dataSource = taskMapped;
  }

  ngOnInit(): void {}

  createTask() {
    this.router.navigate(['/task/new']);
  }

  viewTask(taskId: number) {
    this.router.navigate([`/task/view/${taskId}`]);
  }

  viewReport(taskId: number) {
    this.router.navigate([`/task/view/${taskId}`]);
  }

  deleteTask(taskId: number) {
    this.taskService
      .deleteTask(taskId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toastService.showToast('success', 'Task deleted successfully', false);
        },
        error: () => {
          this.toastService.showToast('error', 'Error Deleting Task', false);
        },
      });
  }

  editTask(taskId: number) {
    this.router.navigate([`/task/${taskId}`]);
  }
}
