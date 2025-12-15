import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
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
  UserRequestDto,
  UserService,
  UserTypeDto,
} from '../../../../../../target/generated-sources';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-button-toggle-group name="pageType" aria-label="Font Style" value="SignUp">
      <mat-button-toggle value="Login" (change)="onToggleChange($event.value)"
        >Login</mat-button-toggle
      >
      <mat-button-toggle value="SignUp" (change)="onToggleChange($event.value)"
        >Sign Up</mat-button-toggle
      >
    </mat-button-toggle-group>
    <div [hidden]="!showSignUp">
      <mat-card>
        <mat-card-title>Sign Up</mat-card-title>
        <mat-card-content>
          <form [formGroup]="signUpForm">
            <mat-form-field>
              <input matInput type="email" placeholder="Email" formControlName="email" />
            </mat-form-field>
            <mat-form-field>
              <input matInput placeholder="Full Name" formControlName="fullName" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>User Type</mat-label>
              <mat-select formControlName="userType">
                <mat-option value="student">Student</mat-option>
                <mat-option value="professor">Professor</mat-option>
                <mat-option value="adminstrator">Administrator</mat-option>
              </mat-select>
            </mat-form-field>
            <button matButton="filled" (click)="signUp()" [disabled]="!signUpForm.valid">
              Sign Up
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    <div [hidden]="showSignUp">
      <mat-card>
        <mat-card-title>Login</mat-card-title>
        <mat-card-content>
          <form [formGroup]="loginForm">
            <mat-form-field>
              <input matInput placeholder="Token" formControlName="token" />
            </mat-form-field>

            <button matButton="filled" (click)="login()" [disabled]="!loginForm.valid">
              Login
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    <p-toast position="center"></p-toast>
  `,
  styleUrl: './login-component.scss',
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    Toast,
  ],
  providers: [],
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

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  showSignUp = true;

  constructor(private messageService: MessageService) {}

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
          .pipe(takeUntilDestroyed())
          .subscribe({
            next: (user) => {
              this.authService.setUserInformationSubject(user ?? null);
              this.showToastSuccessUserCreation();
            },
            error: () => {
              alert('Error Creating User');
            },
          });
      }
    });
  }

  signUp() {
    const signUpRaw = this.signUpForm.getRawValue();
    this.authService.generateEmailUrl(signUpRaw.email);
  }

  login() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/task']);
    } else {
      const loginRaw = this.loginForm.getRawValue();
      this.authService.login(loginRaw.token);
    }
  }

  onToggleChange(value: string) {
    this.showSignUp = value === 'SignUp';
  }

  showToastSuccessUserCreation() {
    this.messageService.add({
      severity: 'success',
      summary: 'User created and email sent successfully',
      sticky: true,
    });
  }
}
