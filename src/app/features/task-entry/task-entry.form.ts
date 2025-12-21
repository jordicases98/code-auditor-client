import { FormControl} from '@angular/forms';

export interface TaskEntryForm  {
  taskId?: FormControl<number>;
  studentUserIds: FormControl<number[]>;
  title: FormControl<string>;
  description: FormControl<string>;
  dueDate: FormControl<string>;
  solutionTestCases: FormControl<string>;
};
