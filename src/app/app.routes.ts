import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { TaskComponent } from './features/task/task.component';
import { UserComponent } from './features/user/user.component';
import { adminstratorRoleGuard, authGuard, professorRoleGuard } from './core/auth/auth.guard';
import {
  fetchAllUsersResolver,
  taskResolver,
  tasksResolver,
  userResolver,
  usersResolver,
} from './shared/services/resolvers.service';
import { TaskDetail } from './features/task-detail/task-detail.component';
import { TaskEntry } from './features/task-entry/task-entry.component';
import { UserEntry } from './features/user-entry/user-entry';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authGuard, adminstratorRoleGuard],
    resolve: {
      allUsers: fetchAllUsersResolver,
    },
  },
  {
    path: 'user/new',
    component: UserEntry,
    canActivate: [authGuard, adminstratorRoleGuard],
  },
  {
    path: 'user/:email',
    component: UserEntry,
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
    canActivate: [authGuard],
    resolve: {
      task: taskResolver,
      studentUsers: usersResolver,
    },
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
