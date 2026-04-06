# Best Practices to Prevent Modal Display Issues

## Overview

This guide outlines architectural patterns and coding standards to prevent similar modal display issues in future Angular development. It's based on lessons learned from the "Create Employee" button incident.

---

## 1. Component Design Patterns

### 1.1 Modal Component Architecture

#### ✓ RECOMMENDED: Single Source of Truth Pattern

```typescript
/**
 * Reusable Modal Component
 *
 * Design Principle: Component controls its own visibility through @Input
 * Parent controls WHEN modal displays via property binding
 */
@Component({
  selector: 'app-modal',
  template: `
    <!-- Single visibility gate -->
    <div *ngIf="isOpen" class="modal-container" role="dialog">
      <div class="backdrop" (click)="onBackdropClick($event)"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <h2>{{ title }}</h2>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <div class="modal-footer">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  // ✓ Single source of truth for visibility
  @Input() isOpen = false;

  // ✓ Other configuration
  @Input() title: string | null = null;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEscape = true;

  // ✓ Events for parent to respond to
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  close(): void {
    this.onClose.emit();
  }

  confirm(): void {
    this.onConfirm.emit();
  }
}
```

#### Usage Pattern

```typescript
/**
 * Parent Component - Entities/Employees Management
 *
 * Responsibilities:
 * - Manage modal visibility state
 * - Manage form state inside modal
 * - Link button clicks to modal state changes
 */
@Component({
  template: `
    <!-- Button to trigger modal -->
    <button (click)="openCreateModal()">+ Create Employee</button>

    <!-- Modal with proper binding -->
    <app-modal
      [isOpen]="showCreateModal"
      title="Create New Employee"
      (onClose)="closeCreateModal()"
    >
      <!-- Form content -->
      <form [formGroup]="createForm" (ngSubmit)="submitForm()">
        <!-- Form fields -->
      </form>
    </app-modal>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
})
export class EntitiesComponent {
  // ✓ Dedicated state for modal visibility
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // ✓ Dedicated form for modal
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // ... other fields
    });
  }

  // ✓ Clear handler for opening
  openCreateModal(): void {
    this.createForm.reset();
    this.showCreateModal = true;
  }

  // ✓ Clear handler for closing
  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createForm.reset();
  }

  // ✓ Submit handler
  submitForm(): void {
    if (this.createForm.valid) {
      // Submit logic
      this.closeCreateModal();
    }
  }
}
```

---

## 2. Template Binding Best Practices

### 2.1 Property Binding vs Structural Directives

#### ❌ DON'T: Mix responsibility

```html
<!-- WRONG: *ngIf controls both creation and visibility -->
<app-modal *ngIf="showModal">
  <!-- isOpen inside component defaults to false - never renders -->
</app-modal>
```

#### ✓ DO: Separate concerns

```html
<!-- RIGHT: Binding is the source of truth -->
<app-modal [isOpen]="showModal" [title]="'Create Employee'" (onClose)="closeModal()">
  <!-- Form content -->
</app-modal>

<!-- Optional: Use *ngIf only if needed to unmount component -->
<app-modal
  *ngIf="showModal"
  [isOpen]="showModal"
  [title]="'Create Employee'"
  (onClose)="closeModal()"
>
  <!-- Unmounted when showModal = false, remounted when true -->
</app-modal>
```

### 2.2 Naming Conventions

```typescript
// ✓ Explicit naming for UI state
showCreateEmployeeModal = false; // Clear intent
showEditEmployeeModal = false; // Clear purpose
showDeleteConfirmation = false; // Clear action

// ❌ Generic naming that's ambiguous
showModal = false; // Which modal?
displayForm = false; // Form or modal?
isOpen = false; // Open to what?
```

---

## 3. Component Communication Patterns

### 3.1 Parent-Child Communication Pattern

```typescript
/**
 * Step 1: Parent defines state
 */
@Component({
  template: `
    <button (click)="onOpenModal()">Open</button>
    <app-modal [isOpen]="isModalOpen" [data]="selectedData" (onClose)="onCloseModal()"></app-modal>
  `,
})
export class ParentComponent {
  isModalOpen = false;
  selectedData: Employee | null = null;

  onOpenModal(): void {
    this.isModalOpen = true;
  }

  onCloseModal(): void {
    this.isModalOpen = false;
  }
}

/**
 * Step 2: Child receives and uses state
 */
@Component({
  selector: 'app-modal',
  template: `
    <div *ngIf="isOpen" class="modal">
      <!-- isOpen input controls visibility -->
    </div>
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() data: Employee | null = null;
  @Output() onClose = new EventEmitter<void>();
}
```

### 3.2 Signal-Based State (Modern Angular)

```typescript
/**
 * Using Angular Signals for reactive state (Angular 17+)
 * Provides automatic change detection without manual triggers
 */
@Component({
  template: `
    <button (click)="openModal()">Open</button>
    <app-modal [isOpen]="isModalOpen()" (onClose)="closeModal()"></app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitiesComponent {
  // ✓ Signal for automatic reactivity
  isModalOpen = signal(false);

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
```

---

## 4. Change Detection Optimization

### 4.1 OnPush Strategy for Modals

```typescript
/**
 * Use OnPush for modals to improve performance
 * Modal only updates when @Input properties change
 */
@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() title: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  // ✓ Mark for check when input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] || changes['title']) {
      this.cdr.markForCheck();
    }
  }
}
```

### 4.2 Manual Change Detection When Needed

```typescript
/**
 * For complex scenarios, manually trigger change detection
 */
@Component({})
export class EntitiesComponent {
  constructor(private cdr: ChangeDetectorRef) {}

  openCreateModal(): void {
    this.showModal = true;

    // ✓ When manually updating state outside zone
    this.cdr.detectChanges();
  }
}
```

---

## 5. TypeScript Best Practices

### 5.1 Strict Template Checking

```json
{
  "compilerOptions": {
    "strict": true,
    "strictTemplates": true,
    "strictAttributeTypes": true,
    "strictSafeNavigationTypes": true,
    "strictDOMLocalRefTypes": true,
    "strictOutputEventTypes": true,
    "strictInputAccessModifiers": true,
    "strictTemplateAccessModifiers": true,
    "noImplicitAny": true
  }
}
```

### 5.2 Type-Safe Modal Operations

```typescript
/**
 * Type-safe modal state management
 */

// ✓ Use enums for modal types
enum ModalType {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  VIEW = 'view',
}

// ✓ Use interfaces for modal state
interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data: Employee | null;
}

@Component({})
export class EntitiesComponent {
  // ✓ Typed state
  modalState: ModalState = {
    isOpen: false,
    type: ModalType.CREATE,
    data: null,
  };

  // ✓ Type-safe handlers
  openModal(type: ModalType, data?: Employee): void {
    this.modalState = {
      isOpen: true,
      type,
      data: data || null,
    };
  }

  closeModal(): void {
    this.modalState = {
      ...this.modalState,
      isOpen: false,
    };
  }
}
```

---

## 6. Form Handling in Modals

### 6.1 Form State Management

```typescript
/**
 * Dedicated form for modal content
 * Keep separate from other forms on the page
 */
@Component({
  template: `
    <app-modal [isOpen]="showModal">
      <!-- ✓ Modal has its own form -->
      <form [formGroup]="modalForm" (ngSubmit)="handleSubmit()">
        <input formControlName="name" placeholder="Full Name" />
        <p *ngIf="modalForm.get('name')?.touched && modalForm.get('name')?.invalid">
          Name is required
        </p>

        <button [disabled]="!modalForm.valid">Submit</button>
      </form>
    </app-modal>
  `,
})
export class EntitiesComponent {
  showModal = false;
  modalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // ✓ Create form with proper validators
    this.modalForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // ...
    });
  }

  // ✓ Reset form when opening modal
  openModal(employee?: Employee): void {
    if (employee) {
      this.modalForm.patchValue(employee);
    } else {
      this.modalForm.reset();
    }
    this.showModal = true;
  }

  // ✓ Reset form when closing modal
  closeModal(): void {
    this.showModal = false;
    this.modalForm.reset();
  }

  handleSubmit(): void {
    if (this.modalForm.valid) {
      // Submit logic
      this.closeModal();
    }
  }
}
```

### 6.2 Form Validation Display

```typescript
/**
 * Helper method for form error display
 */
isFieldInvalid(fieldName: string): boolean {
  const field = this.modalForm.get(fieldName);
  return !!(field && field.invalid && (field.dirty || field.touched));
}

getFieldError(fieldName: string): string | null {
  const field = this.modalForm.get(fieldName);

  if (!field || !field.errors) {
    return null;
  }

  if (field.errors['required']) {
    return `${fieldName} is required`;
  }
  if (field.errors['email']) {
    return `${fieldName} must be a valid email`;
  }
  if (field.errors['minlength']) {
    return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
  }

  return 'Invalid field';
}

// Template usage
<input formControlName="email" />
<p *ngIf="isFieldInvalid('email')" class="error">
  {{ getFieldError('email') }}
</p>
```

---

## 7. Testing Best Practices

### 7.1 Unit Tests for Modal Display

```typescript
/**
 * Comprehensive tests for modal display logic
 */
describe('EntitiesComponent - Modal Display', () => {
  let component: EntitiesComponent;
  let fixture: ComponentFixture<EntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesComponent, ModalComponent, CommonModule, ReactiveFormsModule],
      providers: [EmployeeService],
    }).compileComponents();

    fixture = TestBed.createComponent(EntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Modal Opening', () => {
    it('should open create modal when openCreateModal is called', () => {
      component.openCreateModal();
      fixture.detectChanges();

      expect(component.showCreateModal).toBe(true);
    });

    it('should display modal component when showCreateModal is true', () => {
      component.showCreateModal = true;
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.directive(ModalComponent));
      expect(modal).toBeTruthy();
    });

    it('should pass isOpen input to modal component', () => {
      component.openCreateModal();
      fixture.detectChanges();

      const modalComponent = fixture.debugElement.query(
        By.directive(ModalComponent),
      ).componentInstance;

      expect(modalComponent.isOpen).toBe(true);
    });

    it('should render backdrop when modal is open', () => {
      component.openCreateModal();
      fixture.detectChanges();

      const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
      expect(backdrop).toBeTruthy();
    });

    it('should render dialog when modal is open', () => {
      component.openCreateModal();
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    });
  });

  describe('Modal Closing', () => {
    it('should close modal when closeCreateModal is called', () => {
      component.showCreateModal = true;
      component.closeCreateModal();

      expect(component.showCreateModal).toBe(false);
    });

    it('should reset form when closing modal', () => {
      component.createForm.patchValue({ name: 'Test' });
      component.closeCreateModal();

      expect(component.createForm.get('name')?.value).toBeNull();
    });

    it('should emit onClose when backdrop is clicked', () => {
      component.openCreateModal();
      fixture.detectChanges();

      spyOn(component, 'closeCreateModal');

      const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
      backdrop.click();

      expect(component.closeCreateModal).toHaveBeenCalled();
    });
  });

  describe('Form Handling', () => {
    it('should populate form when editing employee', () => {
      const employee = { id: '1', name: 'John', email: 'john@example.com' };
      component.openEditModal(employee);
      fixture.detectChanges();

      expect(component.editForm.get('name')?.value).toBe('John');
      expect(component.editForm.get('email')?.value).toBe('john@example.com');
    });

    it('should display validation errors for invalid form', fakeAsync(() => {
      component.openCreateModal();
      fixture.detectChanges();

      const nameInput = component.createForm.get('name');
      nameInput?.setValue('');
      nameInput?.markAsTouched();

      fixture.detectChanges();
      tick();

      const errorMessage = fixture.nativeElement.querySelector('.error');
      expect(errorMessage?.textContent).toContain('required');
    }));
  });
});
```

### 7.2 E2E Tests for Modal User Flow

```typescript
/**
 * End-to-end test for complete user workflow
 */
describe('Employee Creation Modal - E2E', () => {
  beforeEach(() => {
    cy.visit('/employees');
  });

  it('should open modal and create employee successfully', () => {
    // ✓ Click button
    cy.contains('button', '+ Create Employee').click();

    // ✓ Verify modal is visible
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('h2', 'Create New Employee').should('exist');

    // ✓ Fill form
    cy.get('input[placeholder="Full Name"]').type('John Doe');
    cy.get('input[placeholder="Email"]').type('john@example.com');
    cy.get('input[placeholder="Employee Number"]').type('EMP001');

    // ✓ Submit
    cy.contains('button', 'Create').click();

    // ✓ Verify modal closed
    cy.get('[role="dialog"]').should('not.exist');

    // ✓ Verify employee added
    cy.contains('John Doe').should('be.visible');
  });

  it('should close modal when clicking backdrop', () => {
    cy.contains('button', '+ Create Employee').click();
    cy.get('[role="dialog"]').should('be.visible');

    // Click backdrop
    cy.get('.modal-backdrop').click({ force: true });

    cy.get('[role="dialog"]').should('not.exist');
  });

  it('should close modal when pressing Escape', () => {
    cy.contains('button', '+ Create Employee').click();
    cy.get('[role="dialog"]').should('be.visible');

    // Press Escape
    cy.get('[role="dialog"]').type('{esc}');

    cy.get('[role="dialog"]').should('not.exist');
  });
});
```

---

## 8. Accessibility Best Practices

### 8.1 Modal Accessibility

```html
<!-- ✓ Proper ARIA attributes -->
<div
  *ngIf="isOpen"
  role="dialog"
  [attr.aria-modal]="true"
  [attr.aria-labelledby]="'modal-title'"
  [attr.aria-describedby]="'modal-description'"
  class="modal"
>
  <h2 id="modal-title">{{ title }}</h2>
  <p id="modal-description">{{ description }}</p>

  <!-- ✓ Focusable elements -->
  <button (click)="close()" autofocus>Close</button>
</div>
```

### 8.2 Keyboard Navigation

```typescript
@Component({
  template: `
    <div *ngIf="isOpen" (keydown)="onKeydown($event)" tabindex="-1">
      <!-- Modal content -->
    </div>
  `,
})
export class ModalComponent {
  // ✓ Handle Escape key
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }

    // ✓ Handle Tab key for focus trapping
    if (event.key === 'Tab') {
      this.handleTabNavigation(event);
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab on first element
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab on last element
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const focusableQuery = focusableSelectors.join(', ');
    const modalElement = this.elementRef.nativeElement;

    return Array.from(modalElement.querySelectorAll(focusableQuery)) as HTMLElement[];
  }
}
```

---

## 9. Common Pitfalls to Avoid

### 9.1 Pitfall: Multiple Bindings on Modal

```typescript
// ❌ WRONG: Conflicting visibility control
<app-modal
  *ngIf="showModal"           // Structural directive
  [isOpen]="showModal"        // Property binding (redundant)
  (onClose)="closeModal()"
>

// ✓ RIGHT: Pick one approach
<app-modal
  [isOpen]="showModal"        // Only property binding
  (onClose)="closeModal()"
>

// OR: If unmounting is important
<app-modal
  *ngIf="showModal"           // Unmount when closed
  [isOpen]="showModal"        // Keep binding for safety
  (onClose)="closeModal()"
>
```

### 9.2 Pitfall: Shared Form State

```typescript
// ❌ WRONG: Form shared between create and edit
createAndEditForm: FormGroup;

openCreateModal(): void {
  this.createAndEditForm.reset();  // Affects edit too if open
  this.showCreateModal = true;
}

// ✓ RIGHT: Separate forms
createForm: FormGroup;
editForm: FormGroup;

openCreateModal(): void {
  this.createForm.reset();
  this.showCreateModal = true;
}
```

### 9.3 Pitfall: Not Resetting Modal State

```typescript
// ❌ WRONG: Form keeps values between opens
closeModal(): void {
  this.showModal = false;
  // Form not reset - values persist
}

// ✓ RIGHT: Clean up on close
closeModal(): void {
  this.showModal = false;
  this.modalForm.reset();
  this.selectedRecord = null;
}
```

### 9.4 Pitfall: Z-Index Conflicts

```css
/* ❌ WRONG: Modal has lower z-index than other elements */
.modal-backdrop {
  z-index: 40; /* Too low */
}

.other-element {
  z-index: 50; /* Higher, blocks modal */
}

/* ✓ RIGHT: Modal always on top */
.modal-backdrop {
  z-index: 1000; /* High enough */
}

.modal-dialog {
  z-index: 1001; /* Higher than backdrop */
}
```

---

## 10. Performance Considerations

### 10.1 Lazy Loading for Heavy Modals

```typescript
/**
 * For complex modals, lazy load the form component
 */
@Component({
  template: `
    <app-modal [isOpen]="showModal">
      <ng-container *ngIf="showModal">
        <!-- Only loaded when modal is open -->
        <app-employee-form></app-employee-form>
      </ng-container>
    </app-modal>
  `,
})
export class EntitiesComponent {
  showModal = false;
}
```

### 10.2 Memoization for Expensive Operations

```typescript
/**
 * Cache expensive computations
 */
@Component({})
export class EntitiesComponent {
  private securityLabelsCache = new Map<string, string[]>();

  getSecurityLabels(type: string): string[] {
    if (this.securityLabelsCache.has(type)) {
      return this.securityLabelsCache.get(type)!;
    }

    const labels = this.expensiveOperation(type);
    this.securityLabelsCache.set(type, labels);
    return labels;
  }
}
```

---

## 11. Documentation Standards

### 11.1 Component Documentation

```typescript
/**
 * Employee Management Component
 *
 * Displays a list of employees with options to create, edit, and manage their lifecycle.
 * Uses a modal-based form for data entry.
 *
 * @example
 * <app-entities></app-entities>
 *
 * Features:
 * - Search employees by name or ID
 * - Filter by security label
 * - Create new employee via modal
 * - Edit employee via modal
 * - Activate/deactivate employees
 *
 * State Management:
 * - showCreateModal: Controls create modal visibility
 * - showEditModal: Controls edit modal visibility
 * - createForm: Reactive form for employee creation
 * - editForm: Reactive form for employee editing
 * - employees: List of employees from API
 *
 * Modal Pattern (IMPORTANT):
 * Modals use [isOpen] property binding for visibility control.
 * Example: <app-modal [isOpen]="showCreateModal">
 *
 * Do NOT use: <app-modal *ngIf="showCreateModal">
 * This prevents the modal @Input from receiving the binding.
 */
@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
  standalone: true,
})
export class EntitiesComponent implements OnInit, OnDestroy {
  // Component body
}
```

### 11.2 Input/Output Documentation

```typescript
@Component({})
export class ModalComponent {
  /**
   * Controls whether the modal is displayed
   * IMPORTANT: This @Input must be bound via property binding [isOpen]
   * DO NOT use structural directive *ngIf alone without this binding
   *
   * @default false
   */
  @Input() isOpen = false;

  /**
   * Title displayed in the modal header
   * @default null
   */
  @Input() title: string | null = null;

  /**
   * Emitted when the user closes the modal
   * Can be triggered by close button, backdrop click, or Escape key
   */
  @Output() onClose = new EventEmitter<void>();
}
```

---

## 12. Migration Guide: Old to New Pattern

### 12.1 Before (Anti-pattern)

```typescript
// Old approach with issues
@Component({
  template: `
    <button (click)="toggleModal()">Toggle</button>

    <!-- ❌ Issues:
         1. *ngIf controls creation, not visibility
         2. Modal's @Input isOpen never receives binding
         3. Form inside unmounts/remounts unnecessarily
    -->
    <app-modal *ngIf="showModal">
      <form>...</form>
    </app-modal>
  `,
})
export class OldComponent {
  showModal = false;

  toggleModal(): void {
    this.showModal = !this.showModal;
  }
}
```

### 12.2 After (Best practice)

```typescript
// New approach - best practices
@Component({
  template: `
    <button (click)="openModal()">Open</button>

    <!-- ✓ Correct pattern:
         1. Property binding controls visibility
         2. Modal receives isOpen value
         3. Form state preserved on close
    -->
    <app-modal [isOpen]="showModal" [title]="'Employee Form'" (onClose)="closeModal()">
      <form [formGroup]="modalForm">...</form>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewComponent {
  showModal = signal(false);
  modalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.modalForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      // fields
    });
  }

  openModal(): void {
    this.modalForm.reset();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.modalForm.reset();
  }

  private createForm(): FormGroup {
    // form creation
  }
}
```

---

## Checklist for Modal Implementation

Use this checklist whenever implementing or reviewing a modal in the application:

- [ ] **Component Design**
  - [ ] Modal component has `@Input() isOpen` property
  - [ ] Modal component uses `*ngIf="isOpen"` for visibility
  - [ ] Modal component emits `@Output() onClose` event

- [ ] **Template Binding**
  - [ ] Parent uses `[isOpen]="showModal"` binding (NOT `*ngIf`)
  - [ ] Parent passes all required `@Input` properties
  - [ ] Parent handles `(onClose)` event

- [ ] **Form Handling**
  - [ ] Modal has dedicated form (not shared)
  - [ ] Form resets when modal opens
  - [ ] Form resets when modal closes
  - [ ] Form validates before submission

- [ ] **State Management**
  - [ ] State naming is clear (e.g., `showCreateModal`)
  - [ ] State is properly initialized
  - [ ] State updates are tracked (use signals or logging)

- [ ] **Event Handling**
  - [ ] Button click handler is called
  - [ ] Modal state updates on button click
  - [ ] Close button works
  - [ ] Backdrop click closes modal
  - [ ] Escape key closes modal

- [ ] **Testing**
  - [ ] Unit tests verify modal display
  - [ ] Unit tests verify form handling
  - [ ] E2E tests verify user workflow
  - [ ] Accessibility tests pass

- [ ] **Accessibility**
  - [ ] Modal has proper ARIA attributes
  - [ ] Modal has proper role attribute
  - [ ] Focus management implemented
  - [ ] Keyboard navigation works

- [ ] **Performance**
  - [ ] Change detection strategy is appropriate
  - [ ] No unnecessary re-renders
  - [ ] Form not recreated on each render

---

## Summary

Follow these principles to prevent modal display issues:

1. **Single Responsibility**: Modal components control visibility, parents control state
2. **Property Binding**: Use `[isOpen]` for visibility control, not just structural directives
3. **Clear Naming**: Use explicit names for modal state variables
4. **Dedicated Forms**: Each modal should have its own form when needed
5. **Proper Testing**: Unit tests + E2E tests for complete coverage
6. **Accessibility First**: Include ARIA attributes and keyboard navigation
7. **Performance**: Use OnPush change detection and lazy loading where appropriate
8. **Documentation**: Clearly document the modal pattern used in your codebase

The key lesson: **Always bind `[isOpen]="showModal"` when using reusable modal components that have internal visibility logic.**
