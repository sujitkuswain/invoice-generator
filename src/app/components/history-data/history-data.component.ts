import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { MatButton } from '@angular/material/button';

interface Invoice {
  id?: string;
  clientName: string;
  billingPeriod: string;
  total: number;
  setteled: boolean;
}

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
      const querySnapshot = await getDocs(
        collection(this.fireStore, 'invoices')
      );

      this.rowData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Invoice;
        this.rowData.push({ id: doc.id, ...data });
      });
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  }

  /**
   * Updates existing invoices in the Firestore database based on the current state of `rowData`.
   * Iterates through each invoice, and if it has an ID, updates the corresponding document in the
   * 'invoices' collection. Logs a message for each updated invoice and a final message once all
   * changes are saved. Catches and logs errors if the update process fails.
   */

  async save() {
    try {
      console.log('Saving changes...', this.rowData);
      for (const invoice of this.rowData) {
        console.log('Saving invoice:', invoice.id);
        if (invoice.id) {
          const docRef = doc(this.fireStore, 'invoices', invoice.id);
          await updateDoc(docRef, {
            clientName: invoice.clientName,
            billingPeriod: invoice.billingPeriod,
            total: invoice.total,
            setteled: invoice.setteled,
          });
          console.log('Invoice updated:', invoice.id);
        }
      }
      console.log('All changes saved.');
    } catch (error) {
      console.error('Error updating invoices:', error);
    }
  }
}
