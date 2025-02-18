import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
} from '@angular/fire/firestore';
import { MatButton } from '@angular/material/button';

interface Invoice {
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

  // Save data to Firestore (if needed)
  save() {
    const testCollection = collection(this.fireStore, 'testCollection');
    addDoc(testCollection, { message: 'Hello Firebase!' })
      .then(() => console.log('Data added!'))
      .catch((error) => console.error('Error adding data:', error));
  }

  // Get data from Firestore and populate it into rowData for ag-Grid
  async get() {
    try {
      const querySnapshot = await getDocs(
        collection(this.fireStore, 'invoices')
      );

      // Clear previous rowData
      this.rowData = [];

      querySnapshot.forEach((doc) => {
        // Mapping Firestore document data into rowData format
        const data = doc.data() as Invoice;
        this.rowData.push(data);
      });

      console.log('Data fetched:', this.rowData);
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  }

  gridOptions: GridOptions = {};

  // Initial empty rowData, will be populated after fetching Firestore data
  rowData: Invoice[] = [];

  // Column definitions for ag-Grid
  colDefs: ColDef[] = [
    { field: 'Client Name', flex: 1 },
    { field: 'Billing Period', flex: 1 },
    { field: 'Total', flex: 1 },
    { field: 'Setteled', flex: 1 },
  ];

  ngOnInit() {
    this.get();
  }
}
