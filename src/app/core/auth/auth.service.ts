import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  EMPTY,
  filter,
  first,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  AuthenticationService,
  GenericUserDto,
  TokenEmailRequestDto,
  TokenEmailResponseDto,
  UserDto,
  UserService,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);
  private authenticationService = inject(AuthenticationService);

  private userInformationSubject = new BehaviorSubject<GenericUserDto | null>(null);

  private createUserSubject = new BehaviorSubject<boolean>(false);
  createUser$ = this.createUserSubject.asObservable();

  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();

  userInfo$: Observable<GenericUserDto | null> = this.userInformationSubject.asObservable();

  generateEmailUrl(email: string, createUser: boolean) {
    const body = new HttpParams().set('username', email);
    this.httpClient
      .post('/auth/ott/generate', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(take(1))
      .subscribe({
        next: () => {
          if (createUser) {
            this.createUserSubject.next(true);
          }
        },
        error: () => {
          this.createUserSubject.next(false);
          alert('Error Signing Up');
        },
      });
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
          alert('Error Login In');
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
          alert('Error Login Out');
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
