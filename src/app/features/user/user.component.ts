import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UserDto,
  UserService,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { ToastService } from '../../shared/services/toast.service';
import { take } from 'rxjs';

interface UserView {
  id?: number;
  email?: string;
  fullName?: string;
  userType?: string;
}

@Component({
  selector: 'app-user-component',
  standalone: true,
  template: `
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Id</th>
        <td mat-cell *matCellDef="let element">{{ element.id }}</td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let element">{{ element.email }}</td>
      </ng-container>

      <ng-container matColumnDef="fullName">
        <th mat-header-cell *matHeaderCellDef>Full Name</th>
        <td mat-cell *matCellDef="let element">{{ element.fullName }}</td>
      </ng-container>

      <ng-container matColumnDef="userType">
        <th mat-header-cell *matHeaderCellDef>User Type</th>
        <td mat-cell *matCellDef="let element">{{ element.userType }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button (click)="editUser(element.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteUser(element.id, element.userType)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <button mat-icon-button (click)="createUser()" class="add-button">
      <mat-icon>add</mat-icon>
    </button>
  `,
  styleUrl: './user.component.scss',
  imports: [MatTableModule, MatIconModule],
})
export class UserComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  displayedColumns: string[] = ['id', 'email', 'fullName', 'userType', 'actions'];
  dataSource: UserView[] = [];

  constructor(private route: ActivatedRoute) {
    const userData = this.route.snapshot.data['allUsers'] as UserDto[];
    const userMapped = userData.map((user: UserDto) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
    })) as UserView[];
    this.dataSource = userMapped;
  }

  createUser() {
    this.router.navigate(['/user/new']);
  }

  editUser(userId: number) {
    const email = this.dataSource.find(u => u.id === userId)?.email
    this.router.navigate([`/user/${email}`]);
  }

  deleteUser(userId: number, userType: string) {
    if (userType === UserTypeDto.Administrator) {
      this.userService
        .deleteAdminUser(userId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toastService.showToast('success', 'User deleted successfully', false);
          },
          error: () => {
            this.toastService.showToast('error', 'Error Deleting User', false);
          },
        });
    } else if (userType === UserTypeDto.Professor) {
      this.userService
        .deleteProfessorUser(userId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toastService.showToast('success', 'User deleted successfully', false);
          },
          error: () => {
            this.toastService.showToast('error', 'Error Deleting User', false);
          },
        });
    } else if (userType === UserTypeDto.Student) {
      this.userService
        .deleteStudentUser(userId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toastService.showToast('success', 'User deleted successfully', false);
          },
          error: () => {
            this.toastService.showToast('error', 'Error Deleting User', false);
          },
        });
    }
  }
}
