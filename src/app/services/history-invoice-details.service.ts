import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDocs,
  Timestamp,
} from '@angular/fire/firestore';
import { InvoiceDetails } from '../models/invoice-details.model';
import { ClientsService } from './clients.service';

@Injectable({
  providedIn: 'root',
})
export class HistoryInvoiceDetailsService {
  fireStore = inject(Firestore);
  auth = inject(Auth);
  currUserName: string = '';
  currentTimestamp = Timestamp.now(); // Get current date and time
  clientService = inject(ClientsService);
  constructor() {}

  async get(invoicdId: string): Promise<InvoiceDetails[]> {
    try {
      const querySnapshot = await getDocs(
        collection(this.fireStore, 'invoiceDetails')
      );

      return querySnapshot.docs
        .map((doc) => {
          const data = doc.data() as InvoiceDetails;
          return {
            id: doc.id,
            invoiceId: data.invoiceId,
            serviceType: data.serviceType,
            price: data.price,
            discount: data.discount,
            createdBy: data.createdBy,
            modifiedBy: data.modifiedBy,
            createdAt: data.createdAt,
            modifiedAt: data.modifiedAt,
          };
        })
        .filter((detail) => detail.invoiceId === invoicdId);
    } catch (error) {
      console.error('Error getting document details: ', error);
      return [];
    }
  }
}
