import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const csvStringValidator: ValidatorFn =
  (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value;
    if (!value || !value.trim()) {
      return null;
    }
    const parts = value.split(',').map(p => p.trim());
    if (parts.some(p => p === '')) {
      return { csvEmptyValue: true };
    }
    if (parts.length % 2 !== 0) {
      return { csvMalformatted: true };
    }
    return null;
  };