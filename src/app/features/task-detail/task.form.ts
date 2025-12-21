import { FormControl } from '@angular/forms';

// export interface TaskDetailForm {
//   title: FormControl<string>;
//   description: FormControl<string>;
//   dueDate: FormControl<string>;
//   solutionTestCases: FormControl<string>;
// }

export interface DeliverableForm {
  fileContentSolution: FormControl<File | null>;
}

export interface DeliverableResponseForm {
  status: FormControl<string>;
  sonarProjectUrl: FormControl<string>;
}