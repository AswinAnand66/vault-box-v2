import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VaultComponent } from './components/vault/vault.component';
import { TrustedContactComponent } from './components/trusted-contact/trusted-contact.component';
import { EmergencyAccessComponent } from './components/emergency-access/emergency-access.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'vault', component: VaultComponent, canActivate: [AuthGuard] },
  { path: 'trusted-contact', component: TrustedContactComponent, canActivate: [AuthGuard] },
  { path: 'emergency-access', component: EmergencyAccessComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 