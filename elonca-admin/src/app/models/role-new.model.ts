export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface PermissionCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Permission {
  id: string;
  name: string;
  category: string;
}

export interface RolePermission {
  roleId: number;
  permissionId: string;
  isGranted: boolean;
}

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  roleId: number;
}

// Mock Data
export const mockRoles: Role[] = [
  { id: 1, name: 'Yönetici', description: 'Tüm yetkilere sahip' },
  { id: 2, name: 'Mağaza Sorumlusu', description: 'Mağaza operasyonları' },
  { id: 3, name: 'Satış Sorumlusu', description: 'Satış işlemleri' }
];

export const mockPermissionCategories: PermissionCategory[] = [
  { id: 'kullanici', name: 'Kullanıcı', icon: 'fa-users' },
  { id: 'magaza', name: 'Mağaza', icon: 'fa-store' },
  { id: 'stok', name: 'Stok', icon: 'fa-box' },
  { id: 'sistem', name: 'Sistem', icon: 'fa-cog' }
];

export const mockPermissions: Permission[] = [
  // Kullanıcı Yetkileri
  { id: 'UC', name: 'Kullanıcı Ekle', category: 'kullanici' },
  { id: 'UD', name: 'Kullanıcı Sil', category: 'kullanici' },
  { id: 'UU', name: 'Kullanıcı Güncelle', category: 'kullanici' },
  { id: 'UL', name: 'Kullanıcı Listele', category: 'kullanici' },
  
  // Mağaza Yetkileri
  { id: 'MC', name: 'Mağaza Ekle', category: 'magaza' },
  { id: 'MD', name: 'Mağaza Sil', category: 'magaza' },
  { id: 'MU', name: 'Mağaza Güncelle', category: 'magaza' },
  { id: 'ML', name: 'Mağaza Listele', category: 'magaza' },
  
  // Stok Yetkileri
  { id: 'SC', name: 'Stok Ekle', category: 'stok' },
  { id: 'SD', name: 'Stok Sil', category: 'stok' },
  { id: 'SU', name: 'Stok Güncelle', category: 'stok' },
  { id: 'SL', name: 'Stok Listele', category: 'stok' },
  
  // Sistem Yetkileri
  { id: 'SR', name: 'Rol Yönetimi', category: 'sistem' },
  { id: 'SS', name: 'Sistem Ayarları', category: 'sistem' },
  { id: 'SB', name: 'Yedekleme', category: 'sistem' }
];

export const mockRolePermissions: { [key: number]: string[] } = {
  1: ['UC', 'UD', 'UU', 'UL', 'MC', 'MD', 'MU', 'ML', 'SC', 'SD', 'SU', 'SL', 'SR', 'SS', 'SB'], // Yönetici - Tüm yetkiler
  2: ['UL', 'ML', 'MU', 'SC', 'SD', 'SU', 'SL'], // Mağaza Sorumlusu
  3: ['ML', 'SL'] // Satış Sorumlusu
};
