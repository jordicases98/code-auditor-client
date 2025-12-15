import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, first, map, Observable, take } from 'rxjs';
import { GenericUserDto, UserTypeDto } from '../../../../target/generated-sources';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private userInformationSubject = new BehaviorSubject<GenericUserDto | null>(null);

  private createUserSubject = new BehaviorSubject<boolean>(false);
  createUser$ = this.createUserSubject.asObservable();

  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();

  userInfo$: Observable<GenericUserDto | null> = this.userInformationSubject.asObservable();

  generateEmailUrl(email: string) {
    const body = new HttpParams().set('username', email);
    this.httpClient
      .post('/auth/ott/generate', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.createUserSubject.next(true);
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
      .pipe(first())
      .subscribe({
        next: () => {
          this.isUserLoggedIn.next(true);
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
    this.isUserLoggedIn.next(false);
    this.userInformationSubject.next(null);
    sessionStorage.removeItem('user');
    this.httpClient.post('/api/logout', {}, { withCredentials: true });
  }

  isLoggedIn() {
    return !!this.isUserLoggedIn.getValue();
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
