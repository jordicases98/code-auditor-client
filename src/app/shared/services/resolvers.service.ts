import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import {
  GenericUserDto,
  StudentUserDto,
  TaskDto,
  TaskService,
  UserService,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { AuthService } from '../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, forkJoin, iif, map, of, switchMap, take } from 'rxjs';

export const userResolver: ResolveFn<GenericUserDto> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  return authService.userInfo$.pipe(
    take(1),
    switchMap((userInfo) => {
      const userEmail = route.paramMap.get('email')!;
      if (userEmail) {
        return userService.getGenericUser(userEmail);
      } else {
        return EMPTY;
      }
    })
  );
};

export const tasksResolver: ResolveFn<TaskDto[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const taskService = inject(TaskService);
  return taskService.getTasks().pipe(take(1));
};

export const taskResolver: ResolveFn<TaskDto> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const taskService = inject(TaskService);
  const taskId = +route.paramMap.get('id')!;
  return taskService.getTask(taskId).pipe(take(1));
};

export const usersResolver: ResolveFn<StudentUserDto[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  return authService.hasAnyRole([UserTypeDto.Professor, UserTypeDto.Administrator]).pipe(
    take(1),
    switchMap((hasRole) => {
      if (hasRole) {
        return userService.getStudentUsers().pipe(take(1));
      } else return of([]);
    })
  );
};

export const fetchAllUsersResolver: ResolveFn<GenericUserDto[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  return forkJoin({
    students: userService.getStudentUsers(),
    professors: userService.getProfessorUsers(),
    admins: userService.getAdminUsers(),
  }).pipe(
    map(({ students, professors, admins }) => [
      ...students.map(
        (student) =>
          ({
            id: student?.id,
            email: student.email,
            fullName: student.fullName,
            userType: UserTypeDto.Student,
          } as GenericUserDto)
      ),
      ...professors.map(
        (professor) =>
          ({
            id: professor.id,
            email: professor.email,
            fullName: professor.fullName,
            userType: UserTypeDto.Professor,
          } as GenericUserDto)
      ),
      ...admins.map(
        (admin) =>
          ({
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            userType: UserTypeDto.Administrator,
          } as GenericUserDto)
      ),
    ])
  );
};
