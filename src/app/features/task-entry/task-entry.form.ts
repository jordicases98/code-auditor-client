import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface TaskEntryForm  {
  taskId: FormControl<number>;
  studentIds: FormControl<number[]>;
  title: FormControl<string>;
  description: FormControl<string>;
  dueDate: FormControl<string>;
  solutionTestCases: FormControl<string>;
};
