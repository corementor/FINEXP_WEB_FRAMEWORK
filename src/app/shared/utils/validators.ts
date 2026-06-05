import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime } from 'rxjs/operators';

/**
 * Custom Form Validators
 * Reusable validation functions for forms across the application
 */

/**
 * Validates email format and basic structure
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  };
}

/**
 * Validates password strength
 * Requirements: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const value = control.value;
    const errors: ValidationErrors = {};

    if (value.length < 8) errors['minLength'] = true;
    if (!/[A-Z]/.test(value)) errors['noUppercase'] = true;
    if (!/[a-z]/.test(value)) errors['noLowercase'] = true;
    if (!/\d/.test(value)) errors['noNumber'] = true;
    if (!/[@$!%*?&]/.test(value)) errors['noSpecialChar'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

/**
 * Validates employee number format (EMP-XXXX)
 */
export function employeeNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const empRegex = /^EMP-\d{3,5}$/;
    return empRegex.test(control.value) ? null : { invalidEmployeeNumber: true };
  };
}

/**
 * Validates national ID format (basic)
 */
export function nationalIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Accept various formats: XXX-XXXX-XXX, XXXXXXXXXXX, etc.
    const idRegex = /^[0-9\-]{8,20}$/;
    return idRegex.test(control.value) ? null : { invalidNationalId: true };
  };
}

/**
 * Validates that two form controls match (e.g., password confirmation)
 */
export function matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    return control.value === matchingControl.value ? null : { passwordMismatch: true };
  };
}

/**
 * Async validator to check email uniqueness
 * In production, would call API; here it's mocked
 */
export function emailUniqueValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    // Mock implementation - simulate API call
    const mockExistingEmails = ['admin@finxp.com', 'user@finxp.com'];

    return of(control.value).pipe(
      debounceTime(300),
      map((email) => (mockExistingEmails.includes(email) ? { emailTaken: true } : null)),
      catchError(() => of(null)),
    );
  };
}

/**
 * Async validator to check employee number uniqueness
 */
export function employeeNumberUniqueValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    // Mock implementation
    const mockExistingEmps = ['EMP-001', 'EMP-002', 'EMP-150'];

    return of(control.value).pipe(
      debounceTime(300),
      map((empNum) => (mockExistingEmps.includes(empNum) ? { empNumberTaken: true } : null)),
      catchError(() => of(null)),
    );
  };
}

/**
 * Validates that a value is not empty or whitespace-only
 */
export function requiredTrimmedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !control.value.toString().trim()) {
      return { requiredTrimmed: true };
    }
    return null;
  };
}

/**
 * Validates phone number format
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Basic international phone format
    const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  };
}

/**
 * Validates minimum age (used for employee date of birth)
 */
export function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
  };
}

/**
 * Validates date is not in the past
 */
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? null : { pastDate: true };
  };
}

/**
 * Validates that control value is within a set of allowed values
 */
export function allowedValuesValidator(allowedValues: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    return allowedValues.includes(control.value) ? null : { notAllowed: true };
  };
}
