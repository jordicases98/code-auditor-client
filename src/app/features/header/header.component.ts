import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardTitle } from "@angular/material/card";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header-component',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, AsyncPipe, MatMenuModule, RouterLink],
  template: `<mat-toolbar class="header">
    <span class="title" routerLink="/task">Code auditor</span>
    <span class="spacer"></span>
    @if (isUserLoggedIn$ | async) { @if ((userInfo$ | async)) {
    <button mat-icon-button [matMenuTriggerFor]="profileMenu">
      <mat-icon>person</mat-icon>
    </button>
    <mat-menu #profileMenu="matMenu">
      @let user = userInfo$ | async;
      <div class="profile">
        <strong>User information</strong>
        <p>{{ user?.fullName }}</p>
        <p>{{ user?.email }}</p>
        <p>{{ user?.userType }}</p>
      </div>
    </mat-menu>
    }
    <button mat-icon-button (click)="logout()">
      <mat-icon>logout</mat-icon>
    </button>
    }
  </mat-toolbar>`,
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  isUserLoggedIn$ = this.authService.isUserLoggedIn$;
  userInfo$ = this.authService.userInfo$;

  openUserProfile = false;

  logout() {
    this.authService.logout();
  }
}
