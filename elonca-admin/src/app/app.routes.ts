import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserInfo } from './pages/users/user-info/user-info';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreEditComponent } from './pages/stores/store-edit/store-edit.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ELedgerComponent } from './pages/e-ledger/e-ledger.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ReceivablesComponent } from './pages/receivables/receivables.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tenants', component: TenantsComponent },
      { path: 'users', component: UserListComponent },
      { path: 'users/:id/edit', component: UserInfo },
      { path: 'stores', component: StoresComponent },
      { path: 'stores/:id/edit', component: StoreEditComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'e-ledger', component: ELedgerComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'receivables', component: ReceivablesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
