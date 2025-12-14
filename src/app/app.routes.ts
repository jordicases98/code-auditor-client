import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login-component';
import { DeliverableComponent } from './features/deliverable/deliverable-component';
import { TaskComponent } from './features/task/task-component';
import { ReportComponent } from './features/report/report-component';
import { UserComponent } from './features/user/user-component';
import { DashboardComponent } from './features/dashboard/dashboard-component';
import { authGuard } from './core/auth/auth.guard';
export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authGuard]
  },
  {
    path: 'user/:id',
    component: UserComponent,
  },
  {
    path: 'task',
    component: TaskComponent,
  },
  {
    path: 'task/:id',
    component: TaskComponent,
  },
  {
    path: 'deliverable',
    component: DeliverableComponent,
  },
  {
    path: 'deliverable/:id',
    component: DeliverableComponent,
  },
  {
    path: 'report',
    component: ReportComponent,
  },
  {
    path: 'report/:id',
    component: ReportComponent,
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
