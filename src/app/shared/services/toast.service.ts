import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  showToast(severity: string, summary: string, sticky: boolean) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      sticky: sticky,
    });
  }
}
