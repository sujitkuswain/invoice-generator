import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ServicelistService } from '../service-list/servicelist.service';
import { InvoiceService } from '../../invoice.service';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css',
})
export class ActionButtonsComponent {
  generateCustomInvoice() {
    this.invoiceService.generateCustomPDF();
  }
  generateInvoice() {
    this.invoiceService.generatePDF();
  }
  constructor(
    private serviceListService: ServicelistService,
    private invoiceService: InvoiceService
  ) {}

  addNewService() {
    this.serviceListService.addService();
  }
}
