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
  auth = inject(Auth);
  currUserName: string = '';
  currentTimestamp = Timestamp.now(); // Get current date and time

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

  extractNameFromEmail(email: string): string {
    const namePart = email.split('@')[0]; // Get part before '@'
    return namePart.charAt(0).toUpperCase() + namePart.slice(1); // Capitalize first letter
  }

  setCurrentUser() {
    // Get the currently logged-in user
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.error('No user logged in!');
      return;
    }

    this.currUserName = this.extractNameFromEmail(currentUser.email!); // Get user ID
  }

  async import() {
    const invoicesCollection = collection(this.fireStore, 'invoices');

    // Step 1: Delete all existing documents
    const existingDocs = await getDocs(invoicesCollection);
    const deletePromises = existingDocs.docs.map((docRef) =>
      deleteDoc(doc(this.fireStore, 'invoices', docRef.id))
    );
    await Promise.all(deletePromises);

    console.log('Existing invoices deleted.');

    this.setCurrentUser();

    if (!this.currUserName) {
      console.error('No user logged in!');
      return;
    }

    // Step 2: Insert new invoices with additional fields
    const invoices = [
      {
        clientName: 'Techno Zone',
        billingPeriod: 'Oct 2024',
        total: 2257.55,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
      },
      {
        clientName: 'Techno Zone',
        billingPeriod: 'Jan 2025',
        total: 2032,
        setteled: false,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
      },
      {
        clientName: 'Yummy Bakery and Sweets',
        billingPeriod: '19 Aug 2024 - 19 Sept 2024',
        total: 3000,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
      },
      {
        clientName: 'Yummy Bakery and Sweets',
        billingPeriod: '19 Jun 2024 - 19 Aug 2024',
        total: 2333.63,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
      },
      {
        clientName: 'Yummy Bakery and Sweets',
        billingPeriod: '20 Sep 2024 - 19 Oct 2024',
        total: 3000,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
      },
      {
        clientName: 'Yummy Bakery and Sweets',
        billingPeriod: '20 Oct 2024 - 19 Nov 2024',
        total: 3000,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
      },
    ];

    const insertPromises = invoices.map(async (invoice) => {
      const docRef = await addDoc(invoicesCollection, invoice);
      return { id: docRef.id, ...invoice }; // Return invoice data with ID
    });

    const insertedInvoices = await Promise.all(insertPromises);

    // Now you have an array of invoices with their IDs
    console.log(insertedInvoices);

    // insert invoice details
  }

  async addInvoiceDetails(invoiceId: string) {
    const invoiceDetailsRef = collection(this.fireStore, 'invoiceDetails');

    this.setCurrentUser();

    if (!this.currUserName) {
      console.error('No user logged in!');
      return;
    }

    await addDoc(invoiceDetailsRef, {
      invoiceId: invoiceId,
      serviceType: 'Social Media Handling',
      price: 3000,
      discount: 50,
      createdBy: this.currUserName,
      modifiedBy: this.currUserName,
      createdAt: this.currentTimestamp,
      modifiedAt: this.currentTimestamp,
    });

    console.log(`Invoice details added for invoice ID: ${invoiceId}`);
  }
}
