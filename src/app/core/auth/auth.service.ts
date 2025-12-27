import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  first,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import {
  AuthenticationService,
  GenericUserDto,
  TokenEmailRequestDto,
  TokenEmailResponseDto,
  UserDto,
  UserRequestDto,
  UserService,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);
  private authenticationService = inject(AuthenticationService);
  private toastService = inject(ToastService);
  readonly #destroyRef = inject(DestroyRef);

  private userInformationSubject = new BehaviorSubject<GenericUserDto | null>(null);

  private createUserSubject = new BehaviorSubject<UserRequestDto | null>(null);
  createUser$ = this.createUserSubject.asObservable();

  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();

  userInfo$: Observable<GenericUserDto | null> = this.userInformationSubject.asObservable();

  generateEmailUrl(email: string, createUser: UserRequestDto | null) {
    const body = new HttpParams().set('username', email);
    this.httpClient
      .post('/auth/ott/generate', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.createUserSubject.next(createUser);
          this.toastService.showToast('success', 'Email Sent', false);
        },
        error: () => {
          this.toastService.showToast('error', 'Error Signing Up', false);
        },
      });
  }

  createUser() {
    return this.createUser$.pipe(
      filter((userRequest): userRequest is UserRequestDto => userRequest !== null),
      switchMap((userRequest) => this.userService.createUser(userRequest)),
      takeUntilDestroyed(this.#destroyRef)
    );
  }

  login(token: string) {
    const body = new HttpParams().set('token', token);
    this.httpClient
      .post('/auth/login/ott', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        switchMap(() => {
          const request: TokenEmailRequestDto = {
            token: token,
          };
          return this.authenticationService.getEmailFromToken(request);
        }),
        switchMap((tokenEmailResponse: TokenEmailResponseDto) =>
          this.userService.getGenericUser(tokenEmailResponse.email ?? '')
        )
      )
      .subscribe({
        next: (user: UserDto) => {
          this.isUserLoggedIn.next(true);
          this.setUserInformationSubject(user);
          this.router.navigate(['/task']);
        },
        error: () => {
          this.toastService.showToast('error', 'Error Login In', false);
        },
      });
  }

  setUserInformationSubject(userInfo: GenericUserDto | null) {
    this.userInformationSubject.next(userInfo);
    sessionStorage.setItem('user', JSON.stringify(userInfo));
  }

  logout() {
    this.httpClient
      .post('/auth/logout', {}, { withCredentials: true })
      .pipe(first())
      .subscribe({
        next: () => {
          this.isUserLoggedIn.next(false);
          this.userInformationSubject.next(null);
          sessionStorage.removeItem('user');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.toastService.showToast('error', 'Error Login Out', false);
        },
      });
  }

  isLoggedIn() {
    return !!this.isUserLoggedIn.getValue() && !!this.userInformationSubject.getValue();
  }

  hasAnyRole(role: UserTypeDto[]): Observable<boolean> {
    return this.userInfo$.pipe(
      filter((userInfo) => !!userInfo),
      map((userInfo) => {
        return role.includes(userInfo.userType);
      })
    );
  }
}
