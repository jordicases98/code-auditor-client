import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { DeliverableComponent } from './features/deliverable/deliverable.component';
import { TaskComponent } from './features/task/task.component';
import { ReportComponent } from './features/report/report.component';
import { UserComponent } from './features/user/user.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { adminstratorRoleGuard, authGuard, professorRoleGuard, studentRoleGuard } from './core/auth/auth.guard';
import { deliverableResolver, taskResolver, tasksResolver, userResolver } from './shared/services/resolvers.service';
import { TaskDetail } from './features/task-detail/task-detail.component';
import { DeliverableDetail } from './features/deliverable-detail/deliverable-detail.component';
import { TaskEntry } from './features/task-entry/task-entry.component';
export const routes: Routes = [
  // {
  //   path: '',
  //   component: DashboardComponent,
  //   canActivate: [authGuard],
  // },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authGuard, adminstratorRoleGuard],
  },
  {
    path: 'user/:id',
    component: UserComponent,
    canActivate: [authGuard, adminstratorRoleGuard],
    resolve: {
      user: userResolver,
    },
  },
  {
    path: 'task',
    component: TaskComponent,
    canActivate: [authGuard],
    resolve: {
      tasks: tasksResolver,
    },
  },  
  {
    path: 'task/view/:id',
    component: TaskDetail,
    canActivate: [authGuard],
    resolve: {
      task: taskResolver,
    },
  },
  {
    path: 'task/new',
    component: TaskEntry,
    canActivate: [authGuard, professorRoleGuard],
  },
  {
    path: 'task/:id',
    component: TaskEntry,
    canActivate: [authGuard, professorRoleGuard],
    resolve: {
      task: taskResolver
    },
  },
  {
    path: 'deliverable',
    component: DeliverableComponent,
    canActivate: [authGuard, professorRoleGuard],
     resolve: {
      deliverable: taskResolver,
    },
  },
  // {
  //   path: 'deliverable/new',
  //   component: DeliverableEntry,
  //   canActivate: [authGuard, studentRoleGuard]
  // },
  // {
  //   path: 'deliverable/:id',
  //   component: DeliverableEntry,
  //   canActivate: [authGuard],
  //   resolve: {
  //     deliverable: deliverableResolver,
  //   },
  // },
  // {
  //   path: 'report',
  //   component: ReportComponent,
  //   canActivate: [authGuard],
  // },
  {
    path: 'report/:id',
    component: ReportComponent,
    canActivate: [authGuard],
    resolve: {
      report: deliverableResolver,
    },
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
