import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  template: `
    <h1>Dashboard</h1>
    <mat-grid-list cols="2" rowHeight="2:1">
      <mat-grid-tile>1</mat-grid-tile>
      <mat-grid-tile>2</mat-grid-tile>
      <mat-grid-tile>3</mat-grid-tile>
      <mat-grid-tile>4</mat-grid-tile>
    </mat-grid-list>
  `,
  styleUrl: './dashboard.component.scss',
  imports: [MatGridListModule],
})
export class DashboardComponent {}
