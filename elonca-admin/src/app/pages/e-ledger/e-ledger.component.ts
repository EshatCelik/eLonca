import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs';
import { ELedgerService } from './e-ledger.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-e-ledger-page',
  standalone: true,
  templateUrl: './e-ledger.component.html',
  styleUrl: './e-ledger.component.scss'
})
export class ELedgerComponent implements OnInit, OnDestroy {
  entries: any[] = [];
  isLoading = false;
  errorMessage = '';
  private routerSubscription?: Subscription;

  constructor(
    private readonly eLedgerService: ELedgerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(() => {
      setTimeout(() => {
        if (!this.isLoading) {
          this.load();
        }
      }, 50);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  load(): void {
    if (this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;

    this.eLedgerService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.entries = Array.isArray(list) ? list : [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'e-Defter kayıtları alınamadı.';
        }
      });
  }

  transactionTypeLabel(v: any): string {
    switch (v) {
      case 'sale': return 'Satış';
      case 'purchase': return 'Alış';
      case 'payment': return 'Ödeme';
      case 'collection': return 'Tahsilat';
      case 'expense': return 'Gider';
      case 'income': return 'Gelir';
      default: return v || '-';
    }
  }
}
