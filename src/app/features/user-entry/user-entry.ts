import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  GenericUserDto,
  UserDto,
  UserRequestDto,
  UserService,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { ToastService } from '../../shared/services/toast.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserEntryForm } from './user-entry.form';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { distinctUntilChanged, finalize, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-entry',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatOption,
    MatCardActions,
    RouterLink,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
  ],
  template: `<mat-card class="mat-card-form">
    <mat-card-title>User Details</mat-card-title>
    <mat-card-content>
      <form [formGroup]="userForm">
        <mat-form-field appearance="outline">
          <input matInput placeholder="email" formControlName="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <textarea matInput placeholder="Full Name" formControlName="fullName"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>User Type</mat-label>
          <mat-select formControlName="userType">
            <mat-option value="student">Student</mat-option>
            <mat-option value="professor">Professor</mat-option>
            <mat-option value="administrator">Administrator</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
      <mat-card-actions class="actions-buttons">
        <button mat-raised-button color="primary" [routerLink]="['/user']">Go back</button>
        <span class="spacer"></span>
        <button
          mat-raised-button
          color="primary"
          (click)="submitUserForm()"
          [disabled]="!userForm.valid"
        >
          Submit
        </button>
      </mat-card-actions>
    </mat-card-content>
  </mat-card>`,
  styleUrl: './user-entry.scss',
  standalone: true,
})
export class UserEntry {
  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  protected userForm = new FormGroup<UserEntryForm>({
    userId: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    userType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  userData!: UserDto;

  constructor(private route: ActivatedRoute) {
    this.userData = this.route.snapshot.data['user'] as UserDto;
    if (this.userData) {
      this.userForm.setValue({
        userId: this.userData.id ?? 0,
        email: this.userData.email ?? '',
        fullName: this.userData.fullName ?? '',
        userType: this.userData.userType ?? '',
      });
    }
    this.authService.userInfo$
      .pipe(
        take(1),
        tap((userInfo) => {
          if (userInfo?.id === this.userData.id) this.userForm.disable();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.authService.createUser$.pipe(take(1), distinctUntilChanged())
    .subscribe((userCreated: boolean) => {
      if (userCreated) {
        const userFormRaw = this.userForm.getRawValue();
        const userRequest = {
          fullName: userFormRaw.fullName,
          email: userFormRaw.email,
          userType: userFormRaw.userType,
        } as UserRequestDto;
        this.userService
          .createUser(userRequest)
          .pipe()
          .subscribe({
            next: (user) => {
              this.toastService.showToast('success', 'User created', false);
              this.router.navigate(['/user']);
            },
            error: () => {
              this.toastService.showToast('error', 'Error Creating User', false);
            },
          });
      }
    });
  }

  submitUserForm() {
    const userFormRaw = this.userForm.getRawValue();
    const userRequest = {
      id: userFormRaw.userId,
      email: userFormRaw.email,
      userType: userFormRaw.userType,
    } as UserRequestDto;

    if (!userFormRaw.userId || userFormRaw.userId === 0) {
      this.authService.generateEmailUrl(userRequest.email, true);
    } else {
      if (userRequest.userType === UserTypeDto.Administrator) {
        this.userService
          .updateAdminUser(+userFormRaw.userId, userRequest)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.toastService.showToast('success', 'Admin User updated', false);
              this.router.navigate(['/user']);
            },
            error: () => {
              this.toastService.showToast('error', 'Could not update user', false);
            },
          });
      } else if (userRequest.userType === UserTypeDto.Professor) {
        this.userService
          .updateProfessorUser(+userFormRaw.userId, userRequest)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.toastService.showToast('success', 'Professor User updated', false);
              this.router.navigate(['/user']);
            },
            error: () => {
              this.toastService.showToast('error', 'Could not update user', false);
            },
          });
      } else if (userRequest.userType === UserTypeDto.Student) {
        this.userService
          .updateStudentUser(+userFormRaw.userId, userRequest)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.toastService.showToast('success', 'Student User updated', false);
              this.router.navigate(['/user']);
            },
            error: () => {
              this.toastService.showToast('error', 'Could not update user', false);
            },
          });
      }
    }
  }
}
