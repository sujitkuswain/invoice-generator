import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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
import { Invoice } from '../models/invoice.model';
import { ClientsService } from './clients.service';

@Injectable({
  providedIn: 'root',
})
export class HistoryInvoiceService {
  fireStore = inject(Firestore);
  auth = inject(Auth);
  currUserName: string = '';
  currentTimestamp = Timestamp.now(); // Get current date and time
  clientService = inject(ClientsService);
  constructor() {}

  async get(): Promise<Invoice[]> {
    try {
      const querySnapshot = await getDocs(
        collection(this.fireStore, 'invoices')
      );

      return querySnapshot.docs.map((doc) => {
        const data = doc.data() as Invoice;
        return {
          id: doc.id,
          clientName: data.clientName,
          billingPeriod: data.billingPeriod,
          total: data.total,
          setteled: data.setteled,
        };
      });
    } catch (error) {
      console.error('Error getting documents: ', error);
      return [];
    }
  }

  async save(invoices: Invoice[]) {
    try {
      for (const invoice of invoices) {
        if (invoice.id) {
          const docRef = doc(this.fireStore, 'invoices', invoice.id);
          await updateDoc(docRef, {
            clientName: invoice.clientName,
            billingPeriod: invoice.billingPeriod,
            total: invoice.total,
            setteled: invoice.setteled,
          });
        }
      }
    } catch (error) {
      console.error('Error updating invoices:', error);
    }
  }

  async create(invoices: Invoice[]) {
    try {
      const invoicesCollection = collection(this.fireStore, 'invoices');

      const createPromise = invoices.map((invoice) => {
        addDoc(invoicesCollection, {
          clientName: this.clientService.getClientViewValue(invoice.clientName),
          billingPeriod: invoice.billingPeriod,
          total: invoice.total,
          setteled: invoice.setteled,
        });
      });

      await Promise.all(createPromise);
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
    insertedInvoices.forEach((invoice) => {
      this.addInvoiceDetails(invoice.id);
    });
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
