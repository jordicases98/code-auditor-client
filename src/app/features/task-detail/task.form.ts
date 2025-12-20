import { FormControl } from '@angular/forms';

export interface TaskDetailForm {
  title: FormControl<string>;
  description: FormControl<string>;
  dueDate: FormControl<string>;
}

export interface DeliverableForm {
  fileContentSolution: FormControl<File | null>;
}