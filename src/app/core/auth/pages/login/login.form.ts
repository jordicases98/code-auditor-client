import { FormControl } from "@angular/forms";
import { UserTypeDto } from "../../../../../../target/generated-sources";

export interface LoginForm {
  token: FormControl<string>;
}

export interface SignUpForm {
  email: FormControl<string>;
  fullName: FormControl<string>;
  userType: FormControl<UserTypeDto>;
}