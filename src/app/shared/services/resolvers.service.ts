import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import {
  AdministratorUserDto,
  DeliverableDto,
  DeliverableResponseDto,
  DeliverableService,
  ProfessorUserDto,
  ReportDto,
  StudentUserDto,
  TaskDto,
  TaskService,
  UserService,
  UserTypeDto,
} from '../../../../target/generated-sources';
import { AuthService } from '../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, switchMap, take } from 'rxjs';

export const userResolver: ResolveFn<
  StudentUserDto | AdministratorUserDto | ProfessorUserDto | null
> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  return authService.userInfo$.pipe(
    takeUntilDestroyed(),
    switchMap((userInfo) => {
      const userId = +route.paramMap.get('id')!;
      if (userInfo?.userType === UserTypeDto.Administrator) {
        return userService.getAdminUser(userId);
      } else if (userInfo?.userType === UserTypeDto.Professor) {
        return userService.getProfessorUser(userId);
      } else if (userInfo?.userType === UserTypeDto.Student) {
        return userService.getStudentUser(userId);
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
  return taskService.getTasks().pipe(
    take(1)
  );
}

export const taskResolver: ResolveFn<TaskDto> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const taskService = inject(TaskService);
  const taskId = +route.paramMap.get('id')!;
  return taskService.getTask(taskId).pipe(
    take(1)
  );
};

export const deliverableResolver: ResolveFn<DeliverableResponseDto> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const deliverableService = inject(DeliverableService);
  const deliverableId = +route.paramMap.get('id')!;
  return deliverableService.getDeliverable(deliverableId).pipe(
    take(1)
  );
};

export const reportResolver: ResolveFn<ReportDto> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const deliverableService = inject(DeliverableService);
  const deliverableId = +route.paramMap.get('id')!;
  return deliverableService.getDeliverableReport(deliverableId).pipe(
    take(1)
  );
};
