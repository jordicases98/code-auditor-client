export * from './deliverable.service';
import { DeliverableService } from './deliverable.service';
export * from './task.service';
import { TaskService } from './task.service';
export * from './user.service';
import { UserService } from './user.service';
export * from './userTask.service';
import { UserTaskService } from './userTask.service';
export const APIS = [DeliverableService, TaskService, UserService, UserTaskService];
