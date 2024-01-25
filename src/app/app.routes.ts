import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormUsersComponent } from './forms/users/users.component';
import { FormTzokerComponent } from './forms/tzoker/tzoker.component';
import { guardDashboard, guardDashboardChild } from './dashboard/dashboard.guard';
/** */
export const routes: Routes = [
  /** Auth */
  {
    path: 'auth',
    component: AuthComponent
  },
  /** Dashboard */
  {
    path: 'dashboard',
    canActivate: [guardDashboard],
    canActivateChild: [guardDashboardChild],
    component: DashboardComponent,
    children: [
      /** Users */
      {
        path: 'users',
        component: FormUsersComponent
      },
      /** Tzoker */
      {
        path: 'tzoker',
        component: FormTzokerComponent
      },
      /** Default */
      { path: '**', redirectTo: '' }
    ]
  },
  /** Index */
  {
    path: '',
    component: IndexComponent
  },
  /** Default */
  { path: '**', redirectTo: '' }
];
