import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { MatButton } from '@angular/material/button';
import { Auth } from '@angular/fire/auth';
import { Invoice } from '../../models/invoice.model';
import { HistoryInvoiceService } from '../../services/history-invoice.service';

@Component({
  selector: 'app-history-data',
  standalone: true,
  imports: [MatCardModule, AgGridAngular, MatButton],
  templateUrl: './history-data.component.html',
  styleUrl: './history-data.component.css',
})
export class HistoryDataComponent implements OnInit {
  viewInvoice(id: any): any {
    console.log(id);
  }
  fireStore = inject(Firestore);
  gridOptions: GridOptions | any = {
    domLayout: 'autoHeight',
    responsive: true,
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
    // field to show a button or link to show the invoice details
    {
      field: 'invoiceDetails',
      headerName: 'Invoice Details',
      minWidth: 100,
      flex: 1,
      cellRenderer: (params: any) => {
        const button = document.createElement('button');
        button.innerText = 'Details';
        button.classList.add('invoice-details-btn');
        button.addEventListener('click', () =>
          this.viewInvoice(params.data.id)
        );
        return button;
      },
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
