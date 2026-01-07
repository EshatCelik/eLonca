import { Component, OnInit, ChangeDetectorRef , Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService, Role } from './roles.service';
import { BaseComponent } from '../../core/base.component';


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent extends BaseComponent  implements OnInit {
  roles: Role[] = [];
  isLoading = false; 

  constructor(
     @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private rolesService: RolesService,
    private baseComponent :BaseComponent
  ) {super(platformId);}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    debugger
    // API'den rolleri getir
    this.rolesService.getAll({ storeId: this.currentStoreId }).subscribe({
      next: (response) => {
        console.log('Roller yüklendi:', response);
        this.roles = response.roles;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Roller yüklenirken hata:', error);
        this.isLoading = false; 
         
        this.cdr.detectChanges();
      }
    });
  }

  goToRoleDetail(roleId: number): void {
    this.router.navigate(['/roles', roleId]);
  }

  getRoleIcon(roleName: string): string {
    const icons: { [key: string]: string } = {
      'Yönetici': 'fa-user-shield',
      'Mağaza Sorumlusu': 'fa-store',
      'Satış Sorumlusu': 'fa-cash-register'
    };
    return icons[roleName] || 'fa-user';
  }

  trackByRoleId(index: number, role: any): number {
    return role.id;
  }
}
