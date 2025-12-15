import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserTypeDto } from '../../../../target/generated-sources';
import { AsyncPipe } from '@angular/common';

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
        <td mat-cell *matCellDef="let element">{{ element.description }}</td>
      </ng-container>

      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef>Due Date</th>
        <td mat-cell *matCellDef="let element">{{ element.dueDate }}</td>
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
          }
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    @if(isProfessor$| async) {
    <button mat-icon-button (click)="createTask()">
      <mat-icon>create</mat-icon>
    </button>
    }
  `,
  styleUrl: './task-component.scss',
  imports: [MatTableModule, MatIconModule, AsyncPipe],
})
export class TaskComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected isProfessor$ = this.authService.hasAnyRole([UserTypeDto.Professor]);

  displayedColumns: string[] = ['title', 'description', 'date', 'actions'];
  dataSource = [
    { id: 1, title: 'Factorial', description: 'Perform the factorial', dueDate: '10-10-2025'},
    { id: 2, title: 'Dijkastra', description: 'Dijkastra shortest path', dueDate: '12-12-2025'},
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.data[0])
    //this.dataSource = this.route.snapshot.data[0]?.tasks;
  }

  createTask() {
    this.router.navigate(['/task/new'])
  }

  viewTask(taskId: number) {
    console.log(taskId);
  }

  deleteTask(taskId: number) {
    console.log(taskId);
  }

  editTask(taskId: number) {
    console.log(taskId);
  }
}
