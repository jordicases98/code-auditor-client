import { FormControl } from '@angular/forms';

export interface TaskForm {
  taskId: FormControl<string>;
  userId: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  dueDate: FormControl<string>;
  solutionTestCases?: FormControl<string>
}

export interface DeliverableForm {
  fileContentSolution?: FormControl<File>;
}