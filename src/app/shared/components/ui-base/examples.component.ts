/**
 * QUICK START: Unified UI Component System
 *
 * This file demonstrates the 3 most common patterns:
 * 1. Single Button with Toast
 * 2. Data Table with Actions
 * 3. Card Layout with Form
 *
 * Copy & modify as needed for your features
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  APP_UI_COMPONENTS,
  TableColumn,
  AppTableComponent,
  AppButtonComponent,
} from '@app/shared/components/ui-base';
import { ToastService } from '@app/shared/components/ui-base/toast.service';

// ============================================================
// EXAMPLE 1: Simple Button with Toast
// ============================================================

@Component({
  selector: 'app-example-button-toast',
  standalone: true,
  imports: [APP_UI_COMPONENTS],
  template: `
    <div custom-card>
      <h3 card-title>Example: Button + Toast</h3>

      <app-button
        label="Click Me"
        variant="primary"
        icon="pi pi-check"
        (clicked)="onButtonClick()"
      />
    </div>

    <app-toast />
  `,
})
export class ExampleButtonToastComponent {
  constructor(private toastService: ToastService) {}

  onButtonClick(): void {
    this.toastService.success('Success!', 'Button was clicked');
  }
}

// ============================================================
// EXAMPLE 2: Data Table with Pagination & Sorting
// ============================================================

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Manager';
  joinDate: string;
}

@Component({
  selector: 'app-example-table',
  standalone: true,
  imports: [CommonModule, APP_UI_COMPONENTS],
  template: `
    <div custom-card>
      <h3 card-title>User Management</h3>
      <div card-action>
        <app-button
          label="Add User"
          icon="pi pi-plus"
          variant="primary"
          size="small"
          (clicked)="onAddUser()"
        />
      </div>

      <app-table
        [columns]="userColumns"
        [rows]="users"
        [pageSize]="10"
        headerTitle="Users"
      />
    </div>

    <app-toast />
  `,
})
export class ExampleTableComponent implements OnInit {
  loading = false;
  users: User[] = [];

  userColumns: TableColumn<User>[] = [
    { field: 'name', header: 'Name', sortable: true, width: '150px' },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'role', header: 'Role', sortable: true, width: '100px' },
    { field: 'joinDate', header: 'Joined', sortable: true },
  ];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      this.users = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'Admin',
          joinDate: '2024-01-15',
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'Manager',
          joinDate: '2024-02-20',
        },
        {
          id: 3,
          name: 'Carol White',
          email: 'carol@example.com',
          role: 'User',
          joinDate: '2024-03-10',
        },
      ];
      this.loading = false;
      this.toastService.info('Loaded', 'Users loaded successfully');
    }, 800);
  }

  onAddUser(): void {
    this.toastService.info('Add User', 'Add user dialog would open here');
  }
}

// ============================================================
// EXAMPLE 3: Card with Form & Multiple Buttons
// ============================================================

@Component({
  selector: 'app-example-form-card',
  standalone: true,
  imports: [CommonModule, FormsModule, APP_UI_COMPONENTS],
  template: `
    <div custom-card>
      <h3 card-title>Create New Item</h3>

      <!-- Form Fields -->
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input
            [(ngModel)]="formData.title"
            type="text"
            placeholder="Enter title"
            class="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            [(ngModel)]="formData.description"
            placeholder="Enter description"
            class="w-full px-3 py-2 border rounded h-24"
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div card-action>
        <app-button label="Cancel" variant="secondary" (clicked)="onCancel()" />
        <app-button label="Save" variant="primary" [loading]="isSaving" (clicked)="onSave()" />
      </div>
    </div>

    <app-toast />
  `,
})
export class ExampleFormCardComponent {
  isSaving = false;
  formData = {
    title: '',
    description: '',
  };

  constructor(private toastService: ToastService) {}

  onSave(): void {
    if (!this.formData.title.trim()) {
      this.toastService.warn('Validation', 'Title is required');
      return;
    }

    this.isSaving = true;

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.toastService.success('Saved!', 'Item created successfully');
      this.formData = { title: '', description: '' };
    }, 1000);
  }

  onCancel(): void {
    this.formData = { title: '', description: '' };
    this.toastService.info('Cancelled', 'Form reset');
  }
}

// ============================================================
// EXAMPLE 4: All Together - Dashboard
// ============================================================

@Component({
  selector: 'app-dashboard-example',
  standalone: true,
  imports: [
    CommonModule,
    ExampleButtonToastComponent,
    ExampleTableComponent,
    ExampleFormCardComponent,
  ],
  template: `
    <div class="p-6 space-y-6">
      <h1 class="text-3xl font-bold">FinXP Unified UI System</h1>

      <app-example-button-toast />
      <app-example-table />
      <app-example-form-card />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
      }
    `,
  ],
})
export class DashboardExampleComponent {}

// ============================================================
// USAGE IN YOUR APP
// ============================================================
//
// 1. Add to app.routes.ts:
//    path: 'examples', component: DashboardExampleComponent
//
// 2. In any component, import what you need:
//    import { APP_UI_COMPONENTS, ToastService } from '@app/shared/components/ui-base';
//
// 3. Use in template:
//    <app-button label="Test" (clicked)="onTest()" />
//    <app-table [columns]="cols" [rows]="data" />
//    <div custom-card><h3 card-title>Title</h3></div>
//    <app-toast />
//
// That's it! No PrimeNG API needed.
