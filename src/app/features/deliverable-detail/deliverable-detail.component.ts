import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DeliverableDto, DeliverableService } from '../../../../target/generated-sources';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MessageService } from 'primeng/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReportForm } from './report.form';

@Component({
  selector: 'app-deliverable-detail-component',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  template: `<mat-card>
    <mat-card-title>Deliverable Details</mat-card-title>
    <mat-card-content>
      <form [formGroup]="reportForm">
        <mat-form-field>
          <input matInput placeholder="Username" formControlName="username" />
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Task Title" formControlName="taskTitle" />
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Report Title" formControlName="reportTitle" />
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Delivery Date" formControlName="deliveryDate" />
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="State" formControlName="state" />
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Sonar Url" formControlName="sonarUrl" />
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Accepted Tests" formControlName="acceptedTests" />
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Rejected Tests" formControlName="rejectedTests" />
        </mat-form-field>
      </form> </mat-card-content
  ></mat-card>`,
  standalone: true,
  styleUrl: './deliverable-detail.component.scss',
})
export class DeliverableDetail {
  private taskService = inject(DeliverableService);
  private router = inject(Router);
  private authService = inject(AuthService);

  protected reportForm = new FormGroup<ReportForm>({
    username: new FormControl('', { nonNullable: true, validators: [] }),
    taskTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    reportTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    deliveryDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    sonarUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    acceptedTests: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rejectedTests: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(private messageService: MessageService, private route: ActivatedRoute) {
    this.reportForm.disable();
  }

  ngOnInit() {
    const deliverable: DeliverableDto = this.route.snapshot.data[0]?.deliverable;
  }
}
