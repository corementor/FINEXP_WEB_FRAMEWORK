import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

/**
 * Business Logic Validation Service
 * Handles complex validation rules that span multiple fields or require state
 */
@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  /**
   * Validates entire employee form
   * Checks business rules beyond individual field validators
   */
  validateEmployeeForm(formData: any): Observable<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    // Client-side uniqueness checks removed — backend enforces these constraints
    return of({ valid: errors.length === 0, errors });
  }

  /**
   * Validates login form with business rules
   */
  validateLoginForm(email: string, password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');

    // Rule: Account lockout after failed attempts (mock)
    if (this.isAccountLocked(email)) {
      errors.push('Account is temporarily locked. Try again later.');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validates workflow state transition
   * Ensures only valid state transitions occur
   */
  validateStateTransition(
    currentState: string,
    newState: string,
  ): { valid: boolean; reason?: string } {
    const validTransitions: { [key: string]: string[] } = {
      CREATED: ['ACTIVE', 'INACTIVE'],
      ACTIVE: ['INACTIVE'],
      INACTIVE: ['ACTIVE'],
    };

    const allowedStates = validTransitions[currentState];
    if (!allowedStates || !allowedStates.includes(newState)) {
      return {
        valid: false,
        reason: `Cannot transition from ${currentState} to ${newState}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validates salary change (business rule)
   * Mock: Salary cannot increase by more than 20% in single update
   */
  validateSalaryChange(
    currentSalary: number,
    newSalary: number,
  ): { valid: boolean; reason?: string } {
    const maxIncrease = currentSalary * 1.2;

    if (newSalary > maxIncrease) {
      return {
        valid: false,
        reason: `Salary increase cannot exceed 20% (max: ${maxIncrease.toFixed(2)})`,
      };
    }

    return { valid: true };
  }

  /**
   * Get validation error messages for form controls
   */
  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return `${fieldName} is required`;
    if (errors['minLength'])
      return `${fieldName} must be at least ${errors['minLength'].requiredLength} characters`;
    if (errors['maxLength'])
      return `${fieldName} cannot exceed ${errors['maxLength'].requiredLength} characters`;
    if (errors['invalidEmail']) return 'Please enter a valid email address';
    if (errors['invalidEmployeeNumber']) return 'Employee number must be in format EMP-XXXX';
    if (errors['invalidNationalId']) return 'Please enter a valid national ID';
    if (errors['invalidPhone']) return 'Please enter a valid phone number';
    if (errors['passwordMismatch']) return 'Passwords do not match';
    if (errors['emailTaken']) return 'Email address is already in use';
    if (errors['empNumberTaken']) return 'Employee number is already in use';
    if (errors['minAge']) return `Must be at least ${errors['minAge'].requiredAge} years old`;
    if (errors['pastDate']) return 'Date cannot be in the past';
    if (errors['pattern']) return `${fieldName} format is invalid`;
    if (errors['noUppercase']) return 'Password must contain at least one uppercase letter';
    if (errors['noLowercase']) return 'Password must contain at least one lowercase letter';
    if (errors['noNumber']) return 'Password must contain at least one number';
    if (errors['noSpecialChar'])
      return 'Password must contain at least one special character (@$!%*?&)';

    return 'Invalid input';
  }

  /**
   * Mock: Check if employee number is unique
   */
  private isEmployeeNumberUnique(empNumber: string): boolean {
    const existingEmps = ['EMP-001', 'EMP-002', 'EMP-150'];
    return !existingEmps.includes(empNumber);
  }

  /**
   * Mock: Check if email is unique
   */
  private isEmailUnique(email: string): boolean {
    const existingEmails = ['admin@finxp.com', 'user@finxp.com'];
    return !existingEmails.includes(email);
  }

  /**
   * Mock: Check if national ID is unique
   */
  private isNationalIdUnique(nationalId: string): boolean {
    const existingIds = ['12345-6789-123', '98765-4321-987'];
    return !existingIds.includes(nationalId);
  }

  /**
   * Mock: Check if account is locked due to failed login attempts
   */
  private isAccountLocked(email: string): boolean {
    // In production: Check Redis cache or database for failed attempt count
    return false; // Mock: never locked for demo purposes
  }
}
