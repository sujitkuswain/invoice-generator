import { Injectable } from '@angular/core';
import { Client } from './client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  getClientViewValue(clientValue: string): string {
    // Get the client name based on the clientValue
    const client = this.clients.find((client) => client.value === clientValue);
    return client ? client.viewValue : 'Client Name';
  }

  clients: Client[] = [
    { value: 'yummy', viewValue: 'Yummy Bakery and Sweets' },
    { value: 'technozone', viewValue: 'Techno Zone' },
  ];

  constructor() {}
}
