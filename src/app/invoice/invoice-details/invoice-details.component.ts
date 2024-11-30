import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css',
  providers: [DatePipe],
})
export class InvoiceDetailsComponent {
  todayDate: Date = new Date();

  formattedDateForDate: string;
  formattedDateForInvoice: string;

  constructor(private datePipe: DatePipe) {
    this.formattedDateForDate = this.datePipe.transform(
      this.todayDate,
      'MMMM d, yyyy'
    )!;

    this.formattedDateForInvoice = this.datePipe.transform(
      this.todayDate,
      'dd MM yyyy hh mm ss'
    )!;
  }
}
