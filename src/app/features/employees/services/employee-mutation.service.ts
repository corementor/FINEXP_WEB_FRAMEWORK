import { Injectable, inject } from '@angular/core';
import { QueryClient, injectMutation } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { EmployeeFacadeService } from './employee-facade.service';
import { Employee } from '@app/core/models';
import { LoggerService } from '@app/core/services';
import { ToastService } from '@app/services/toast.service';

/**
 * Employee Mutation Service
 * Encapsulates all employee-related mutations with consistent cache invalidation
 * and error handling across the application.
 *
 * This service provides pre-configured mutations that handle:
 * - Cache invalidation on success
 * - Consistent error handling
 * - Logging for debugging
 *
 * Usage:
 *   const mutations = inject(EmployeeMutationService);
 *   const createMutation = mutations.createMutation();
 *   createMutation.mutate(employeeData);
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeeMutationService {
  private readonly employeeFacade = inject(EmployeeFacadeService);
  private readonly queryClient = inject(QueryClient);
  private readonly logger = inject(LoggerService);
  private readonly toast = inject(ToastService);

  private readonly employeeQueryKey = ['employees'];

  /**
   * Create Employee Mutation
   * Handles validation, API call, and cache invalidation
   */
  createMutation(onSuccess?: () => void, onError?: (error: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: ['employees', 'create'],
      mutationFn: (employee: Omit<Employee, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => {
        this.logger.debug('Mutation: creating employee', { name: employee['name'] });
        return firstValueFrom(this.employeeFacade.createEmployee(employee));
      },
      onSuccess: async () => {
        this.logger.info('Mutation: employee created successfully');
        this.toast.success('Employee created successfully!');
        await this.queryClient.invalidateQueries({ queryKey: this.employeeQueryKey });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        this.logger.error('Mutation: failed to create employee', error);
        this.toast.error('Failed to create employee');
        onError?.(error);
      },
    }));
  }

  /**
   * Update Employee Mutation
   * Handles validation, API call, and cache invalidation
   */
  updateMutation(onSuccess?: () => void, onError?: (error: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: ['employees', 'update'],
      mutationFn: (payload: { id: string; updates: Partial<Employee> }) => {
        this.logger.debug('Mutation: updating employee', { id: payload.id });
        return firstValueFrom(this.employeeFacade.updateEmployee(payload.id, payload.updates));
      },
      onSuccess: async () => {
        this.logger.info('Mutation: employee updated successfully');
        this.toast.success('Employee updated successfully!');
        await this.queryClient.invalidateQueries({ queryKey: this.employeeQueryKey });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        this.logger.error('Mutation: failed to update employee', error);
        this.toast.error('Failed to update employee');
        onError?.(error);
      },
    }));
  }

  /**
   * Activate Employee Mutation
   * Transitions employee state to ACTIVE and invalidates cache
   */
  activateMutation(onSuccess?: () => void, onError?: (error: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: ['employees', 'activate'],
      mutationFn: (id: string) => {
        this.logger.debug('Mutation: activating employee', { id });
        return firstValueFrom(this.employeeFacade.activateEmployee(id));
      },
      onSuccess: async () => {
        this.logger.info('Mutation: employee activated successfully');
        this.toast.success('Employee activated!');
        await this.queryClient.invalidateQueries({ queryKey: this.employeeQueryKey });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        this.logger.error('Mutation: failed to activate employee', error);
        this.toast.error('Failed to activate employee');
        onError?.(error);
      },
    }));
  }

  /**
   * Deactivate Employee Mutation
   * Transitions employee state to INACTIVE with optional comments
   */
  deactivateMutation(onSuccess?: () => void, onError?: (error: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: ['employees', 'deactivate'],
      mutationFn: (payload: { id: string; comments?: string }) => {
        this.logger.debug('Mutation: deactivating employee', { id: payload.id });
        return firstValueFrom(this.employeeFacade.deactivateEmployee(payload.id, payload.comments));
      },
      onSuccess: async () => {
        this.logger.info('Mutation: employee deactivated successfully');
        this.toast.success('Employee deactivated!');
        await this.queryClient.invalidateQueries({ queryKey: this.employeeQueryKey });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        this.logger.error('Mutation: failed to deactivate employee', error);
        this.toast.error('Failed to deactivate employee');
        onError?.(error);
      },
    }));
  }

  /**
   * Delete Employee Mutation
   * Removes employee and invalidates cache
   */
  deleteMutation(onSuccess?: () => void, onError?: (error: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: ['employees', 'delete'],
      mutationFn: (id: string) => {
        this.logger.debug('Mutation: deleting employee', { id });
        return firstValueFrom(this.employeeFacade.deleteEmployee(id));
      },
      onSuccess: async () => {
        this.logger.info('Mutation: employee deleted successfully');
        this.toast.success('Employee deleted successfully!');
        await this.queryClient.invalidateQueries({ queryKey: this.employeeQueryKey });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        this.logger.error('Mutation: failed to delete employee', error);
        this.toast.error('Failed to delete employee');
        onError?.(error);
      },
    }));
  }

  /**
   * Batch State Transition Mutation
   * Transitions multiple employees to a specific state
   */
  batchTransitionMutation(onSuccess?: () => void, onError?: (error: unknown) => void) {
    return injectMutation(() => ({
      mutationKey: ['employees', 'batch-transition'],
      mutationFn: (payload: { ids: string[]; state: string; comments?: string }) => {
        this.logger.debug('Mutation: batch transitioning employees', {
          count: payload.ids.length,
          state: payload.state,
        });

        // For each ID, call updateEmployee with the new state
        const updates = payload.ids.map((id) =>
          firstValueFrom(
            this.employeeFacade.updateEmployee(id, {
              state: payload.state as any,
              comments: payload.comments,
            } as any),
          ),
        );
        return Promise.all(updates);
      },
      onSuccess: async () => {
        this.logger.info('Mutation: batch transition completed successfully');
        this.toast.success('Batch transition completed!');
        await this.queryClient.invalidateQueries({ queryKey: this.employeeQueryKey });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        this.logger.error('Mutation: batch transition failed', error);
        this.toast.error('Batch transition failed');
        onError?.(error);
      },
    }));
  }

  /**
   * Invalidate employees cache
   * Manual cache invalidation when needed
   */
  async invalidateCache(): Promise<void> {
    this.logger.debug('Mutation: invalidating employees cache');
    await this.queryClient.invalidateQueries({ queryKey: this.employeeQueryKey });
  }
}
