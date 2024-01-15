import { CanActivateFn, CanActivateChildFn } from '@angular/router';
/** */
export const guardDashboard: CanActivateFn = (route, state) => {
  return true;
};
/** */
export const guardDashboardChild: CanActivateChildFn = (route, state) => {
  return true;
};
