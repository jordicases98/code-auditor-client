import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginForm, SignUpForm } from './login.form';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import {
  UserDto,
  UserRequestDto,
  UserService,
  UserTypeDto,
} from '../../../../../../target/generated-sources';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  template: `
    <a routerLink="'/login'">
      <img src="assets/code-review.png" class="code-auditor-logo" />
    </a>
    <mat-button-toggle-group name="pageType" value="SignUp">
      <mat-button-toggle value="SignUp" (change)="onToggleChange($event.value)"
        >Sign Up</mat-button-toggle
      >
      <mat-button-toggle value="Login" (change)="onToggleChange($event.value)"
        >Login</mat-button-toggle
      >
      <mat-button-toggle value="RegenerateToken" (change)="onToggleChange($event.value)"
        >Regenerate Token</mat-button-toggle
      >
    </mat-button-toggle-group>
    <div [hidden]="toggleValue !== 'SignUp'">
      <mat-card>
        <mat-card-title>Sign Up</mat-card-title>
        <mat-card-content>
          <form [formGroup]="signUpForm">
            <mat-form-field appearance="outline">
              <input matInput type="email" placeholder="Email" formControlName="email" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <input matInput placeholder="Full Name" formControlName="fullName" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>User Type</mat-label>
              <mat-select formControlName="userType">
                <mat-option value="student">Student</mat-option>
                <mat-option value="professor">Professor</mat-option>
                <mat-option value="administrator">Administrator</mat-option>
              </mat-select>
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              (click)="signUp(true)"
              [disabled]="!signUpForm.valid"
            >
              Sign Up
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    <div [hidden]="toggleValue !== 'Login'">
      <mat-card>
        <mat-card-title>Login</mat-card-title>
        <mat-card-content>
          <form [formGroup]="loginForm">
            <mat-form-field appearance="outline">
              <input matInput placeholder="Token" formControlName="token" />
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              (click)="login()"
              [disabled]="!loginForm.valid"
            >
              Login
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    <div [hidden]="toggleValue !== 'RegenerateToken'">
      <mat-card>
        <mat-card-title>Regenerate token</mat-card-title>
        <mat-card-content>
          <form [formGroup]="regenerateForm">
            <mat-form-field appearance="outline">
              <input matInput placeholder="Email" formControlName="email" />
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              (click)="signUp(false)"
              [disabled]="!regenerateForm.valid"
            >
              Regenerate
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './login.component.scss',
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
})
export class LoginComponent {
  protected signUpForm = new FormGroup<SignUpForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    userType: new FormControl('' as UserTypeDto, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected loginForm = new FormGroup<LoginForm>({
    token: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected regenerateForm = new FormGroup<SignUpForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  toggleValue = 'SignUp';

  ngOnInit() {
    this.authService.createUser$.subscribe((userCreated: boolean) => {
      const signUpRaw = this.signUpForm.getRawValue();
      if (userCreated) {
        const userRequest = {
          email: signUpRaw.email,
          fullName: signUpRaw.fullName,
          userType: signUpRaw.userType,
        } as UserRequestDto;
        this.userService
          .createUser(userRequest)
          .pipe()
          .subscribe({
            next: (user) => {
              this.authService.setUserInformationSubject(user ?? null);
              this.toastService.showToast(
                'success',
                'User created and email sent successfully',
                false
              );
            },
            error: () => {
              this.toastService.showToast('error', 'Error Creating User', false);
            },
          });
      }
    });
  }

  signUp(createuser: boolean) {
    const signUpRaw = this.signUpForm.getRawValue();
    this.authService.generateEmailUrl(
      createuser ? signUpRaw.email : this.regenerateForm.controls.email!.value,
      createuser
    );
  }

  login() {
    const loginRaw = this.loginForm.getRawValue();
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/task']);
    } else {
      this.authService.login(loginRaw.token);
    }
  }

  onToggleChange(value: string) {
    this.toggleValue = value;
  }
}
