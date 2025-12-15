import { FormControl } from '@angular/forms';


export interface ReportForm {
  username?: FormControl<string>;
  taskTitle?: FormControl<string>;
  reportTitle?: FormControl<string>;
  deliveryDate: FormControl<string>;
  state: FormControl<string>;
  sonarUrl: FormControl<string>;
  acceptedTests: FormControl<string>;
  rejectedTests: FormControl<string>;
}