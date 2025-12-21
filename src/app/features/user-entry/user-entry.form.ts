import { FormControl} from '@angular/forms';

export interface UserEntryForm  {
  userId?: FormControl<number>;
  email: FormControl<string>;
  fullName: FormControl<string>;
  userType: FormControl<string>;
};
