import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
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
  fireStore = inject(Firestore);
  gridOptions: GridOptions = {};
  auth = inject(Auth);
  historyInvoiceService = inject(HistoryInvoiceService);

  // Initial empty rowData, will be populated after fetching Firestore data
  rowData: Invoice[] = [];

  // Column definitions for ag-Grid
  colDefs: ColDef[] = [
    { field: 'clientName', headerName: 'Client Name', flex: 1 },
    { field: 'billingPeriod', headerName: 'Billing Period', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1 },
    { field: 'setteled', headerName: 'Setteled', flex: 1, editable: true },
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
