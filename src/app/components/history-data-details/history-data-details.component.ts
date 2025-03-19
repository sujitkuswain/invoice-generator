import { CommonModule } from '@angular/common';
import { InvoiceDetails } from '../../models/invoice-details.model';
import { HistoryInvoiceDetailsService } from './../../services/history-invoice-details.service';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-history-data-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-data-details.component.html',
  styleUrl: './history-data-details.component.css',
})
export class HistoryDataDetailsComponent {
  selectedInvoiceId = input.required<string>();
  historyInvoiceDetailsService = inject(HistoryInvoiceDetailsService);

  // Signal to store the fetched details
  invoiceDetails = signal<InvoiceDetails[]>([]);

  constructor() {
    // Effect to fetch details when selectedInvoiceId changes
    effect(() => {
      const invoiceId = this.selectedInvoiceId();
      if (invoiceId) {
        this.fetchInvoiceDetails(invoiceId);
      }
    });
  }

  async fetchInvoiceDetails(invoiceId: string) {
    const allDetails = await this.historyInvoiceDetailsService.get();
    this.invoiceDetails.set(
      allDetails.filter((detail) => detail.invoiceId === invoiceId)
    );
  }
}
