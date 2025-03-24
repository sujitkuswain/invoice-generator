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
import { MatCardModule } from '@angular/material/card';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-history-data-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, AgGridAngular, MatButtonModule],
  templateUrl: './history-data-details.component.html',
  styleUrl: './history-data-details.component.css',
})
export class HistoryDataDetailsComponent {
  rowData = signal<InvoiceDetails[]>([]);

  gridOptions: GridOptions | any = {
    domLayout: 'autoHeight',
    responsive: true,
    rowSelection: 'single', // Allows selecting a single row at a time
  };

  save() {
    throw new Error('Method not implemented.');
  }
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
    //set invoice details for singal
    this.rowData.set(
      await this.historyInvoiceDetailsService.get(this.selectedInvoiceId())
    );
  }

  // Column definitions for ag-Grid
  colDefs: ColDef[] = [
    {
      field: 'serviceType',
      headerName: 'Service Type',
      minWidth: 200,
      flex: 1,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      minWidth: 200,
      flex: 1,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    {
      field: 'discount',
      headerName: 'Discount',
      minWidth: 100,
      flex: 1,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    },
  ];
}
