import { Routes } from '@angular/router';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'invoice', component: InvoiceComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
