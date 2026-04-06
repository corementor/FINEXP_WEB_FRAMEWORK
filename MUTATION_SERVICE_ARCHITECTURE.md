# Mutation Service Architecture - Separation of Concerns

## Overview

The application now follows a **clean separation of concerns** pattern where mutation logic is completely decoupled from components.

## Architecture Changes

### Before

- **Components:** Directly defined mutations using `injectMutation()`
- **Problem:** Business logic scattered across multiple components, hard to maintain consistency

### After

- **Dedicated Service:** `EmployeeMutationService` encapsulates all mutations
- **Components:** Only orchestrate UI, call mutation service methods
- **Benefit:** Single source of truth for mutation behavior and cache invalidation

## Key Files

### 1. EmployeeMutationService

📍 `src/app/features/employees/services/employee-mutation.service.ts`

This service provides pre-configured mutations:

- `createMutation()` - Create new employee with validation
- `updateMutation()` - Update existing employee
- `activateMutation()` - Activate employee (CREATED → ACTIVE)
- `deactivateMutation()` - Deactivate employee (ACTIVE → INACTIVE)
- `deleteMutation()` - Remove employee from system
- `batchTransitionMutation()` - Bulk state transitions

**Key Feature:** All mutations automatically invalidate the employees cache on success.

### 2. Refactored Components

#### EntitiesComponent

📍 `src/app/entities/entities.component.ts`

**Before:**

```typescript
readonly createEmployeeMutation = injectMutation(() => ({
  mutationKey: ['employees', 'create'],
  mutationFn: (employee) => firstValueFrom(this.employeeFacade.createEmployee(employee)),
  onSuccess: () => { /* cache invalidation */ },
  onError: () => { /* error handling */ }
}));
```

**After:**

```typescript
readonly createEmployeeMutation = this.mutationService.createMutation(
  () => this.closeModal(),  // onSuccess callback
  (error) => { this.error = 'Failed to create employee'; }  // onError callback
);
```

#### WorkflowsComponent

📍 `src/app/workflows/workflows.component.ts`

**Before:**

```typescript
activate(id: string): void {
  this.employeeFacade.updateEmployee(id, { state: ELifeCycle.ACTIVE })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => this.queryClient.invalidateQueries({ queryKey }),
      error: (err) => this.logger.error('Failed', err)
    });
}
```

**After:**

```typescript
readonly activateMutation = this.mutationService.activateMutation(
  () => this.logger.info('Activated'),
  (err) => this.logger.error('Failed', err)
);

activate(id: string): void {
  this.activateMutation.mutate(id);
}
```

## Benefits

✅ **Single Responsibility:** Mutations live in their own service  
✅ **DRY Principle:** Cache invalidation logic defined once, used everywhere  
✅ **Consistency:** All mutations follow the same pattern  
✅ **Testability:** Mutations can be unit tested independently  
✅ **Maintainability:** Changes to cache strategy in one place  
✅ **Reusability:** Any component can use the same mutations

## Usage Pattern

```typescript
// 1. Inject the service
private readonly mutationService = inject(EmployeeMutationService);

// 2. Create mutation with callbacks
readonly createMutation = this.mutationService.createMutation(
  () => console.log('Success!'),  // optional callback
  (err) => console.error(err)       // optional callback
);

// 3. Trigger mutation when needed
this.createMutation.mutate(employeeData);

// 4. Access mutation state
this.createMutation.isPending()      // Loading state
this.createMutation.isError()        // Error state
this.createMutation.data()           // Result data
```

## Cache Invalidation Strategy

**Automatic:** The mutation service automatically invalidates the employees cache after EVERY successful mutation.

**Manual:** If needed, call:

```typescript
await this.mutationService.invalidateCache();
```

## Query Keys

All mutations use the same query key pattern:

- Query: `['employees']`
- Mutations: `['employees', 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'batch-transition']`

This ensures mutations correctly invalidate queries.

## Error Handling

Each mutation accepts optional error callbacks:

```typescript
const mutation = this.mutationService.createMutation(onSuccess, (error: unknown) => {
  // Handle error - log, show toast, etc.
  this.showErrorMessage(error);
});
```

## Logging

All mutations are logged through `LoggerService` with:

- Debug logs for mutation initiation
- Info logs for success
- Error logs for failures

## Testing

Mutations can be tested via `EmployeeMutationService`:

```typescript
// Test - mutation executes with correct params
service.createMutation(...).mutate(testData);

// Test - cache invalidation after success
expect(queryClient.invalidateQueries).toHaveBeenCalled();
```

## Migration Checklist

- ✅ Created `EmployeeMutationService` with all mutation methods
- ✅ Updated `EntitiesComponent` to inject and use mutation service
- ✅ Updated `WorkflowsComponent` to inject and use mutation service
- ✅ Removed inline mutation definitions from components
- ✅ All components compile without errors
- ✅ Cache invalidation centralized in service
