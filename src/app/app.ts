import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from './features/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-header-component></app-header-component>
    <p-toast></p-toast>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.scss',
  imports: [RouterOutlet, ToastModule, HeaderComponent],
})
export class App {}
