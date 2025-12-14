import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="detail-grid">
        <ng-container *ngFor="let item of data | keyvalue">
          <div class="detail-label">{{ formatLabel(item.key) }}:</div>
          <div class="detail-value">{{ formatValue(item.key, item.value) }}</div>
        </ng-container>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close()">Kapat</button>
    </div>
  `,
  styles: [`
    .modal-body {
      max-height: 50vh;
      overflow-y: auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 1rem;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 0.5rem;
      font-size: 12px;
    }
    .detail-label {
      font-weight: 600;
      text-align: right;
      color: #374151;
      font-size: 11px;
    }
    .detail-value {
      word-break: break-word;
      color: #1f2937;
      font-size: 12px;
      line-height: 1.3;
    }
    .modal-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      padding: 0.75rem 1rem;
    }
    .modal-title {
      font-size: 14px;
      font-weight: 600;
      color: #212529;
      margin: 0;
    }
    .modal-footer {
      padding: 0.75rem 1rem;
      border-top: 1px solid #dee2e6;
    }
    .btn-secondary {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }
  `]
})
export class DetailModalComponent {
  @Input() title: string = 'Detaylar';
  @Input() data: any;

  constructor(public activeModal: NgbActiveModal) {}

  formatLabel(key: string | number | symbol): string {
    const keyStr = String(key);
    const labels: {[key: string]: string} = {
      'customerCode': 'Müşteri Kodu',
      'firstName': 'Ad',
      'lastName': 'Soyad',
      'customerType': 'Müşteri Tipi',
      'discountRate': 'İndirim Oranı',
      'phoneNumber': 'Telefon',
      'email': 'E-posta',
      'name': 'Ad',
      'address': 'Adres',
      'phone': 'Telefon',
      'userName': 'Kullanıcı Adı',
      'role': 'Rol',
      'status': 'Durum',
      'createdAt': 'Oluşturulma Tarihi',
      'createdDate': 'Oluşturulma Tarihi',
      'contractEmail': 'Sözleşme E-posta',
      'contractPhone': 'Sözleşme Telefon',
      'storeName': 'Mağaza Adı',
      'storeId': 'Mağaza ID',
      'tenantId': 'Kiracı ID',
      'userId': 'Kullanıcı ID'
    };
    return labels[keyStr] || this.camelToTitle(keyStr);
  }

  formatValue(key: string | number | symbol, value: any): string {
    if (value === null || value === undefined) return '-';
    const keyStr = String(key);
    if (keyStr === 'status') {
      return this.statusLabel(value);
    }
    if (keyStr === 'role') {
      return this.roleLabel(value);
    }
    if (keyStr === 'createdAt' || keyStr === 'createdDate') {
      return this.formatDate(value);
    }
    if (keyStr === 'discountRate') {
      return value + '%';
    }
    return value.toString();
  }

  private camelToTitle(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private statusLabel(v: any): string {
    if (v === 1 || v === true || v === 'Active') return 'Aktif';
    if (v === 0 || v === false || v === 'Passive') return 'Pasif';
    return v ?? '-';
  }

  private roleLabel(v: any): string {
    switch (v) {
      case 'admin': return 'Admin';
      case 'user': return 'Kullanıcı';
      case 'manager': return 'Yönetici';
      default: return v ?? '-';
    }
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('tr-TR');
    } catch {
      return dateString;
    }
  }
}
