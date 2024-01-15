import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TzokerComponent } from './dashboard/tzoker/tzoker.component';
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
      /** Tzoker */
      {
        path: 'tzoker',
        component: TzokerComponent
      },
      /** Default */
      { path: '**', redirectTo: 'tzoker' }
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
