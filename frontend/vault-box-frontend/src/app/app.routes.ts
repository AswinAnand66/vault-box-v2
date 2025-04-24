import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'vault',
    loadComponent: () => import('./components/vault/vault.component').then(m => m.VaultComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'trusted-contact',
    loadComponent: () => import('./components/trusted-contact/trusted-contact.component').then(m => m.TrustedContactComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'emergency-access',
    loadComponent: () => import('./components/emergency-access/emergency-access.component').then(m => m.EmergencyAccessComponent)
  }
];
