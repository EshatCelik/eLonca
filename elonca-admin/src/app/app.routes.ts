import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { TenantEditComponent } from './pages/tenants/tenant-edit.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserInfo } from './pages/users/user-info/user-info';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreEditComponent } from './pages/stores/store-edit/store-edit.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryEditComponent } from './pages/categories/category-edit/category-edit.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductEditComponent } from './pages/products/product-edit/product-edit.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { CustomerEditComponent } from './pages/customers/customer-edit/customer-edit.component';
import { ELedgerComponent } from './pages/e-ledger/e-ledger.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ReceivablesComponent } from './pages/receivables/receivables.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangePasswordComponent } from './pages/profile/change-password.component';
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
    // canActivate: [authGuard], // Geçici olarak devre dışı
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tenants', component: TenantsComponent },
      { path: 'tenants/:id/edit', component: TenantEditComponent },
      { path: 'users', component: UserListComponent },
      { path: 'users/:id/edit', component: UserInfo },
      { path: 'stores', component: StoresComponent },
      { path: 'stores/:id/edit', component: StoreEditComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/:id/edit', component: CategoryEditComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/:id/edit', component: ProductEditComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'customers/:id/edit', component: CustomerEditComponent },
      { path: 'customers/:storeId/:customerStoreId/edit', component: CustomerEditComponent },
      { path: 'e-ledger', component: ELedgerComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'receivables', component: ReceivablesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
