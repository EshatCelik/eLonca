import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  
  success(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'center' // Ortada göster
    });
  }

  error(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'center' // Ortada göster
    });
  }

  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'center' // Ortada göster
    });
  }

  info(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'center' // Ortada göster
    });
  }

  confirm(title: string, text?: string, confirmButtonText?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText || 'Evet',
      cancelButtonText: 'İptal'
    });
  }

  deleteConfirm(itemName?: string): Promise<SweetAlertResult> {
    return this.confirm(
      'Silmek istediğinizden emin misiniz?',
      itemName ? `"${itemName}" öğesi kalıcı olarak silinecektir.` : 'Bu öğe kalıcı olarak silinecektir.',
      'Evet, Sil'
    );
  }

  custom(options: SweetAlertOptions): Promise<SweetAlertResult> {
    return Swal.fire(options);
  }
}
