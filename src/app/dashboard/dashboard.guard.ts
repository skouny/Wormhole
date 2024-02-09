import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
/** */
export const guardDashboard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return true;
};
/** */
export const guardDashboardChild: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  return true;
};
