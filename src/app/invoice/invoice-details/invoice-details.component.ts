import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css',
  providers: [DatePipe],
})
export class InvoiceDetailsComponent implements OnInit {
  todayDate: Date = new Date();

  formattedDateForDisplay: string = '';
  formattedDateForInvoice: string = '';
  invoiceNumber: string = '';

  constructor(private datePipe: DatePipe) {}

  generateInvoiceNumber() {
    this.formattedDateForInvoice = this.datePipe.transform(
      this.todayDate,
      'ddMMyyyyhhmmss'
    )!;
    this.invoiceNumber = 'MS-' + this.formattedDateForInvoice;
  }

  formatDateForDisplay() {
    this.formattedDateForDisplay = this.datePipe.transform(
      this.todayDate,
      'dd-MM-yyyy'
    )!;
  }

  ngOnInit(): void {
    this.generateInvoiceNumber();
    this.formatDateForDisplay();
  }
}
