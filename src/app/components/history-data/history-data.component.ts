import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Invoice } from '../../models/invoice.model';
import { HistoryInvoiceService } from '../../services/history-invoice.service';
import { HistoryDataDetailsComponent } from '../history-data-details/history-data-details.component';

@Component({
  selector: 'app-history-data',
  standalone: true,
  imports: [
    MatCardModule,
    AgGridAngular,
    MatButton,
    HistoryDataDetailsComponent,
  ],
  templateUrl: './history-data.component.html',
  styleUrl: './history-data.component.css',
})
export class HistoryDataComponent implements OnInit {
  selectedInvoiceId = signal('');

  fireStore = inject(Firestore);

  gridOptions: GridOptions | any = {
    domLayout: 'autoHeight',
    responsive: true,
    rowSelection: 'single', // Allows selecting a single row at a time
    onRowSelected: (event: {
      node: { selected: any };
      data: { id: string };
    }) => {
      if (event.node.selected) {
        this.selectedInvoiceId.set(event.data.id);
      }
    },
  };

  auth = inject(Auth);
  historyInvoiceService = inject(HistoryInvoiceService);

  // Initial empty rowData, will be populated after fetching Firestore data
  rowData: Invoice[] = [];

  // Column definitions for ag-Grid
  colDefs: ColDef[] = [
    {
      field: 'clientName',
      headerName: 'Client Name',
      minWidth: 200,
      flex: 1,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    {
      field: 'billingPeriod',
      headerName: 'Billing Period',
      minWidth: 200,
      flex: 1,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      minWidth: 100,
      flex: 1,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    {
      field: 'setteled',
      headerName: 'Setteled',
      editable: true,
      minWidth: 100,
      flex: 1,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    },
  ];

  ngOnInit() {
    this.get();
  }
  async get() {
    try {
      this.rowData = await this.historyInvoiceService.get();
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  }
  async save() {
    try {
      await this.historyInvoiceService.save(this.rowData);
    } catch (error) {
      console.error('Error updating invoices:', error);
    }
  }

  import() {
    this.historyInvoiceService.import();
  }
}
