import { Component, Inject, PLATFORM_ID, HostListener, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { BaseComponent } from '../core/base.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="logo">
          <div class="logo-icon">
            <i class="fas fa-store"></i>
          </div>
          <div class="logo-text">eLonca Admin</div>
        </div>
        <nav class="menu">
          <a routerLink="dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-home"></i>
            </div>
            <span class="menu-text">Dashboard</span>
          </a>
          <a routerLink="tenants" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-building"></i>
            </div>
            <span class="menu-text">Tenantlar</span>
          </a>
          <a routerLink="users" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-users"></i>
            </div>
            <span class="menu-text">Kullanıcılar</span>
          </a>
          <a routerLink="stores" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-store"></i>
            </div>
            <span class="menu-text">Mağazalar</span>
          </a>
          <a routerLink="categories" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-tags"></i>
            </div>
            <span class="menu-text">Kategoriler</span>
          </a>
          <a routerLink="products" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-box"></i>
            </div>
            <span class="menu-text">Ürünler</span>
          </a>
          <a routerLink="customers" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-user-friends"></i>
            </div>
            <span class="menu-text">Müşteriler</span>
          </a>
          <a routerLink="sales" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <span class="menu-text">Satışlarım</span>
          </a>
          <a routerLink="lists" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-list-alt"></i>
            </div>
            <span class="menu-text">Listelerim</span>
          </a>
          <a routerLink="inventory" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-warehouse"></i>
            </div>
            <span class="menu-text">Stoklarım</span>
          </a>
          <a routerLink="e-ledger" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-book"></i>
            </div>
            <span class="menu-text">e-Defter</span>
          </a>
          <a routerLink="receivables" routerLinkActive="active" class="menu-item">
            <div class="menu-icon">
              <i class="fas fa-hand-holding-usd"></i>
            </div>
            <span class="menu-text">Alacaklar</span>
          </a>
        </nav>
      </aside>
      <div class="main">
        <header class="topbar">
          <div class="alerts">
            <div class="alert-item">
              <i class="fas fa-bell"></i>
              <span class="alert-count">3</span>
            </div>
          </div>
          <div class="user-dropdown">
            <button class="user-button" (click)="toggleUserMenu()">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <span class="user-name">{{ getCurrentUserDisplayName() }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
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
export class AdminLayoutComponent extends BaseComponent implements OnDestroy {
  showUserMenu = false;
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly authService: AuthService,
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly router: Router
  ) {
    super(platformId);
    
    // Browser'da auth kontrolünü tetikle ve yönlendir
    setTimeout(() => {
      this.authService.checkAuthOnBrowser();
      
      // 100ms sonra auth durumunu kontrol et
      setTimeout(() => {
        // Geçici olarak auth kontrolünü devre dışı bırak
        // if (!this.authService.isAuthenticated()) {
        //   console.log('Not authenticated - redirecting to login');
        //   this.router.navigate(['/login']);
        // } else {
        //   console.log('Authenticated - staying on page');
        // }
        console.log('Auth check temporarily disabled');
      }, 100);
    }, 0);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.removeDropdown();
      this.showUserMenu = false;
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    
    if (this.showUserMenu) {
      this.createDropdown();
    } else {
      this.removeDropdown();
    }
  }

  private createDropdown(): void {
    // Remove existing dropdown if any
    this.removeDropdown();
    
    // Create dropdown element
    const dropdown = this.renderer.createElement('div');
    this.renderer.setStyle(dropdown, 'position', 'fixed');
    this.renderer.setStyle(dropdown, 'top', '60px');
    this.renderer.setStyle(dropdown, 'right', '20px');
    this.renderer.setStyle(dropdown, 'min-width', '200px');
    this.renderer.setStyle(dropdown, 'background', 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)');
    this.renderer.setStyle(dropdown, 'border', '1px solid #e2e8f0');
    this.renderer.setStyle(dropdown, 'border-radius', '12px');
    this.renderer.setStyle(dropdown, 'padding', '8px 0');
    this.renderer.setStyle(dropdown, 'box-shadow', '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)');
    this.renderer.setStyle(dropdown, 'z-index', '10000');
    this.renderer.setStyle(dropdown, 'backdrop-filter', 'blur(10px)');
    this.renderer.setStyle(dropdown, 'animation', 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    
    // Add menu items
    const items = [
      { text: 'Hesabım', action: 'account' },
      { text: 'Şifre Değiştir', action: 'password' },
      { text: 'Çıkış Yap', action: 'logout', color: '#dc3545' }
    ];
    
    items.forEach((item, index) => {
      if (index === 2) {
        // Add divider
        const divider = this.renderer.createElement('div');
        this.renderer.setStyle(divider, 'height', '1px');
        this.renderer.setStyle(divider, 'background', '#eee');
        this.renderer.setStyle(divider, 'margin', '8px 0');
        this.renderer.appendChild(dropdown, divider);
      }
      
      const menuItem = this.renderer.createElement('a');
      this.renderer.setProperty(menuItem, 'textContent', item.text);
      this.renderer.setStyle(menuItem, 'display', 'flex');
      this.renderer.setStyle(menuItem, 'align-items', 'center');
      this.renderer.setStyle(menuItem, 'padding', '12px 20px');
      this.renderer.setStyle(menuItem, 'color', item.color || '#475569');
      this.renderer.setStyle(menuItem, 'text-decoration', 'none');
      this.renderer.setStyle(menuItem, 'cursor', 'pointer');
      this.renderer.setStyle(menuItem, 'transition', 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)');
      this.renderer.setStyle(menuItem, 'font-weight', '500');
      this.renderer.setStyle(menuItem, 'font-size', '0.875rem');
      
      // Add hover effect
      this.renderer.listen(menuItem, 'mouseenter', () => {
        this.renderer.setStyle(menuItem, 'background', item.color ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)');
        this.renderer.setStyle(menuItem, 'transform', 'translateX(4px)');
      });
      
      this.renderer.listen(menuItem, 'mouseleave', () => {
        this.renderer.setStyle(menuItem, 'background', 'transparent');
        this.renderer.setStyle(menuItem, 'transform', 'translateX(0)');
      });
      
      this.renderer.listen(menuItem, 'click', () => {
        this.handleMenuAction(item.action);
      });
      
      this.renderer.appendChild(dropdown, menuItem);
    });
    
    // Add to body
    this.renderer.setAttribute(dropdown, 'data-user-dropdown', 'true');
    if (this.isBrowser()) {
      this.renderer.appendChild(document.body, dropdown);
    }
  }

  private removeDropdown(): void {
    if (this.isBrowser()) {
      const existing = document.querySelector('[data-user-dropdown="true"]');
      if (existing) {
        existing.remove();
      }
    }
  }

  private handleMenuAction(action: string): void {
    this.removeDropdown();
    this.showUserMenu = false;
    
    switch (action) {
      case 'account':
        this.onMyAccount();
        break;
      case 'password':
        this.onChangePassword();
        break;
      case 'logout':
        this.onLogout();
        break;
    }
  }

  onMyAccount(): void {
    this.removeDropdown();
    this.showUserMenu = false;
    this.router.navigate(['/admin/profile']);
  }

  onChangePassword(): void {
    this.removeDropdown();
    this.showUserMenu = false;
    this.router.navigate(['/admin/change-password']);
  }

  onLogout(): void {
    this.removeDropdown();
    this.showUserMenu = false;
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.removeDropdown();
    this.showUserMenu = false;
    // Tüm subscription'ları temizle
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  override getCurrentUserDisplayName(): string {
    return this.currentUser?.fullName || this.currentUser?.email || 'Admin';
  }
}
