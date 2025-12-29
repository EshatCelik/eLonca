import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
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
import { SalesComponent } from './pages/sales/sales.component';
import { SaleEditComponent } from './pages/sales/sale-edit/sale-edit.component';
import { ListsComponent } from './pages/lists/lists.component';
import { ListEditComponent } from './pages/lists/list-edit/list-edit.component';
import { ListDetailComponent } from './pages/lists/list-detail/list-detail.component';
import { ELedgerComponent } from './pages/e-ledger/e-ledger.component';
import { ReceivablesComponent } from './pages/receivables/receivables.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangePasswordComponent } from './pages/profile/change-password.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { StockDetailComponent } from './pages/inventory/stock-detail/stock-detail.component';
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
      { path: 'users', component: UserListComponent },
      { path: 'users/:id', component: UserInfo },
      { path: 'users/edit/:id', component: UserInfo },
      { path: 'stores', component: StoresComponent },
      { path: 'stores/edit/:id', component: StoreEditComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/edit/:id', component: CategoryEditComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/edit/:id', component: ProductEditComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'customers/edit/:id', component: CustomerEditComponent },
      { path: 'customers/:storeId/:customerStoreId/edit', component: CustomerEditComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'sales/edit/:id', component: SaleEditComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'lists/new', component: ListEditComponent },
      { path: 'lists/:id', component: ListDetailComponent },
      { path: 'lists/:id/edit', component: ListEditComponent },
      { path: 'e-ledger', component: ELedgerComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'inventory/:productId/:storeId/detail', component: StockDetailComponent },
      { path: 'receivables', component: ReceivablesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin/dashboard' }
];
