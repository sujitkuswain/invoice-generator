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

    // Step 2: Define the invoices with actual data
    const invoices = [
      {
        clientName: 'Techno Zone',
        billingPeriod: 'October 2024',
        total: 2257.55,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
        details: [
          {
            serviceType: 'Advertise Create (2nd Hand Laptop)',
            price: 499.0,
            discount: 100,
          },
          {
            serviceType: 'Advertise Create (HP Laptop)',
            price: 499.0,
            discount: 100,
          },
          {
            serviceType: 'Advertise Create (Pooja Dhamaka)',
            price: 499.0,
            discount: 0,
          },
          {
            serviceType: 'Ad Campaign (FB/ Instagram)',
            price: 1758.55,
            discount: 0,
          },
        ],
      },
      {
        clientName: 'Yummy Bakery and Sweets',
        billingPeriod: '19 Aug 2024 - 19 Sept 2024',
        total: 3000.0,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
        details: [
          { serviceType: 'Social Media Handling', price: 3000.0, discount: 0 },
        ],
      },
      {
        clientName: 'Yummy Bakery and Sweets',
        billingPeriod: '19 June 2024 - 19 August 2024',
        total: 2333.63,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
        details: [
          {
            serviceType: 'Monthly Social Media Management (Jun 19 - Jul 19)',
            price: 3000.0,
            discount: 100,
          },
          {
            serviceType: 'Monthly Social Media Management (Jul 19 - Aug 19)',
            price: 3000.0,
            discount: 50,
          },
          { serviceType: 'Instagram Campaign 1', price: 415.92, discount: 0 },
          { serviceType: 'Instagram Campaign 2', price: 417.71, discount: 0 },
        ],
      },
      {
        clientName: 'Yummy Bakery and Sweets',
        billingPeriod: '20 Sept 2024 - 19 Oct 2024',
        total: 3000.0,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
        details: [
          { serviceType: 'Social Media Handling', price: 3000.0, discount: 0 },
        ],
      },
      {
        clientName: 'Techno Zone',
        billingPeriod: 'Jan-2025',
        total: 2032.0,
        setteled: false,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
        details: [
          { serviceType: 'Domain Renew 1yr', price: 883.0, discount: 0 },
          { serviceType: 'Website Renew 1yr', price: 3000.0, discount: 85 },
          { serviceType: 'Social Media Handle', price: 699.0, discount: 0 },
          { serviceType: 'Renew Handle Fee', price: 1499.0, discount: 100 },
        ],
      },
      {
        clientName: 'Yummy Bakery and Sweets',
        billingPeriod: '20 Oct 2024 - 19 Nov 2024',
        total: 3000.0,
        setteled: true,
        createdBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedBy: this.currUserName,
        modifiedAt: this.currentTimestamp,
        details: [
          { serviceType: 'Social Media Handling', price: 3000.0, discount: 0 },
        ],
      },
    ];

    // Step 3: Insert invoices and capture their IDs
    const insertPromises = invoices.map(async (invoice) => {
      const invoiceData = {
        clientName: invoice.clientName,
        billingPeriod: invoice.billingPeriod,
        total: invoice.total,
        setteled: invoice.setteled,
        createdBy: invoice.createdBy,
        createdAt: invoice.createdAt,
        modifiedBy: invoice.modifiedBy,
        modifiedAt: invoice.modifiedAt,
      };
      const docRef = await addDoc(invoicesCollection, invoiceData);
      return { id: docRef.id, details: invoice.details }; // Return ID and details
    });

    const insertedInvoices = await Promise.all(insertPromises);

    // Step 4: Insert invoice details for each invoice
    insertedInvoices.forEach((invoice) => {
      this.addInvoiceDetails(invoice.id, invoice.details);
    });

    console.log(
      'Invoices and details imported successfully:',
      insertedInvoices
    );
  }

  async addInvoiceDetails(
    invoiceId: string,
    details: { serviceType: string; price: number; discount: number }[]
  ) {
    const invoiceDetailsRef = collection(this.fireStore, 'invoiceDetails');

    this.setCurrentUser();

    if (!this.currUserName) {
      console.error('No user logged in!');
      return;
    }

    // Insert all details for this invoice
    const detailPromises = details.map((detail) =>
      addDoc(invoiceDetailsRef, {
        invoiceId: invoiceId,
        serviceType: detail.serviceType,
        price: detail.price,
        discount: detail.discount,
        createdBy: this.currUserName,
        modifiedBy: this.currUserName,
        createdAt: this.currentTimestamp,
        modifiedAt: this.currentTimestamp,
      })
    );

    await Promise.all(detailPromises);

    console.log(`Invoice details added for invoice ID: ${invoiceId}`);
  }
}
