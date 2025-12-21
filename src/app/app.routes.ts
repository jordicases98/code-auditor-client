import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { TaskComponent } from './features/task/task.component';
import { ReportComponent } from './features/report/report.component';
import { UserComponent } from './features/user/user.component';
import { adminstratorRoleGuard, authGuard, professorRoleGuard, studentRoleGuard } from './core/auth/auth.guard';
import { deliverableResolver, reportResolver, taskResolver, tasksResolver, userResolver, usersResolver } from './shared/services/resolvers.service';
import { TaskDetail } from './features/task-detail/task-detail.component';
import { DeliverableDetail } from './features/deliverable-detail/deliverable-detail.component';
import { TaskEntry } from './features/task-entry/task-entry.component';
export const routes: Routes = [
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
      studentUsers: usersResolver,
    },
  },
  {
    path: 'task/new',
    component: TaskEntry,
    canActivate: [authGuard, professorRoleGuard],
    resolve: {
      studentUsers: usersResolver,
    },
  },
  {
    path: 'task/:id',
    component: TaskEntry,
    canActivate: [authGuard, professorRoleGuard],
    resolve: {
      task: taskResolver,
      studentUsers: usersResolver,
    },
  },
  {
    path: 'report/view/:userId/:taskId',
    component: ReportComponent,
    canActivate: [authGuard],
    resolve: {
      report: reportResolver,
    },
  },
  {
    path: 'report/:id',
    component: ReportComponent,
    canActivate: [authGuard],
    resolve: {
      report: reportResolver,
    },
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
