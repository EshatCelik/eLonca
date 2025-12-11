import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="logo">eLonca Admin</div>
        <nav class="menu">
          <a routerLink="dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="tenants" routerLinkActive="active">Tenantlar</a>
          <a routerLink="users" routerLinkActive="active">Kullanıcılar</a>
          <a routerLink="stores" routerLinkActive="active">Mağazalar</a>
          <a routerLink="categories" routerLinkActive="active">Kategoriler</a>
          <a routerLink="customers" routerLinkActive="active">Müşteriler</a>
          <a routerLink="e-ledger" routerLinkActive="active">e-Defter</a>
          <a routerLink="sales" routerLinkActive="active">Satışlar</a>
          <a routerLink="receivables" routerLinkActive="active">Alacaklar</a>
        </nav>
      </aside>
      <div class="main">
        <header class="topbar">
            <div class="alerts">Uyarılar (örnek)</div>
          <div class="user">
            <span class="user-name">Admin Kullanıcı</span>
            <button class="logout" type="button" (click)="onLogout()">Çıkış</button>
          </div>
        </header>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  constructor(private readonly authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}
