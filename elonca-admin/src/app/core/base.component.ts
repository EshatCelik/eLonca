import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BaseComponent {
  
  // Current user properties
  protected currentUser: any = null;
  protected currentToken: string = '';
  protected currentRefreshToken: string = '';
  protected currentTenantId: string = '';
  protected currentUserId: string = '';
  protected currentUserEmail: string = '';
  protected currentUserFullName: string = '';
  protected currentUserRole: string = '';
  protected currentStoreId: string = '';
  protected currentTenant: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCurrentUserFromStorage();
  }

  /**
   * Check if running in browser
   */
  protected isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Load current user data from localStorage
   */
  protected loadCurrentUserFromStorage(): void {
    if (!this.isBrowser()) {
      console.log('=== Running on server, skipping localStorage access ===');
      return;
    }

    try {
      const authData = localStorage.getItem('authData');
      if (authData) {
        const parsed = JSON.parse(authData);
        this.currentUser = parsed;
        this.currentToken = parsed.token || '';
        this.currentRefreshToken = parsed.refreshToken || '';
        this.currentTenantId = parsed.tenantId || '';
        this.currentUserId = parsed.userId || '';
        this.currentUserEmail = parsed.email || '';
        this.currentUserFullName = parsed.fullName || '';
        this.currentUserRole = parsed.role || '';
        this.currentTenant = parsed.tenant || null;
        this.currentTenantId = parsed.tenantId || parsed.tenant?.id || null;
        this.currentStoreId=parsed.storeId||null;
        
        console.log('=== Current user loaded ===', {
          userId: this.currentUserId,
          email: this.currentUserEmail,
          fullName: this.currentUserFullName,
          role: this.currentUserRole,
          tenantId: this.currentTenantId
        });
      } else {
        console.log('=== No auth data found in localStorage ===');
        this.clearUserData();
      }
    } catch (error) {
      console.error('=== Error loading current user ===', error);
      this.clearUserData();
    }
  }

  /**
   * Save user data to localStorage
   */
  protected saveCurrentUserToStorage(authData: any): void {
    if (!this.isBrowser()) {
      console.log('=== Running on server, skipping localStorage save ===');
      return;
    }

    try {
      localStorage.setItem('authData', JSON.stringify(authData));
      this.loadCurrentUserFromStorage();
    } catch (error) {
      console.error('=== Error saving current user ===', error);
    }
  }

  /**
   * Clear user data from localStorage and memory
   */
  protected clearUserData(): void {
    this.currentUser = null;
    this.currentToken = '';
    this.currentRefreshToken = '';
    this.currentTenantId = '';
    this.currentUserId = '';
    this.currentUserEmail = '';
    this.currentUserFullName = '';
    this.currentUserRole = '';
    this.currentStoreId = '';
    this.currentTenant = null;
    
    if (this.isBrowser()) {
      localStorage.removeItem('authData');
    }
  }

  /**
   * Check if user is authenticated
   */
  protected isAuthenticated(): boolean {
    return !!(this.currentToken && this.currentUserId);
  }

  /**
   * Check if user has specific role
   */
  protected hasRole(role: string): boolean {
    return this.currentUserRole === role;
  }

  /**
   * Check if user is SuperAdmin
   */
  protected isSuperAdmin(): boolean {
    return this.hasRole('SuperAdmin');
  }

  /**
   * Check if user is Admin
   */
  protected isAdmin(): boolean {
    return this.hasRole('Admin') || this.isSuperAdmin();
  }

  /**
   * Get authorization header
   */
  protected getAuthHeader(): { Authorization: string } {
    return {
      Authorization: `Bearer ${this.currentToken}`
    };
  }

  /**
   * Get current user info for API requests
   */
  protected getCurrentUserInfo(): any {
    debugger
    return {
      userId: this.currentUserId,
      tenantId: this.currentTenantId,
      email: this.currentUserEmail,
      fullName: this.currentUserFullName,
      role: this.currentUserRole,
      storeId: this.currentStoreId || this.currentTenantId // Store ID fallback to tenant ID
    };
  }

  /**
   * Set store ID for current user
   */
  protected setStoreId(storeId: string): void {
    this.currentStoreId = storeId;
    // Update stored data
    if (this.currentUser && this.isBrowser()) {
      this.currentUser.storeId = storeId;
      this.saveCurrentUserToStorage(this.currentUser);
    }
  }

  /**
   * Get display name for current user
   */
  protected getCurrentUserDisplayName(): string {
    return this.currentUserFullName || this.currentUserEmail || 'Bilinmeyen Kullanıcı';
  }

  /**
   * Refresh user data from storage
   */
  protected refreshUserData(): void {
    this.loadCurrentUserFromStorage();
  }
}
