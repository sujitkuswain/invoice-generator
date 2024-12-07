import { DatePipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'; // Added ReactiveFormsModule and FormBuilder
import { InvoiceService } from '../invoice.service';
import { LogoComponent } from '../shared/logo/logo.component';
import { Client } from './client.model';
import { ServiceDetails } from './invoice.model';
import { ServicelistService } from './servicelist.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule, // Added ReactiveFormsModule
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    LogoComponent,
  ],
  providers: [DatePipe],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  todayDate: Date = new Date();
  formattedDateForDisplay: string = '';
  formattedDateForInvoice: string = '';
  invoiceNumber: string = '';
  invoiceForm: FormGroup; // Initialize form group here

  clients: Client[] = [
    { value: 'yummy', viewValue: 'Yummy Bakery and Sweets' },
    { value: 'technozone', viewValue: 'Techno Zone' },
  ];

  displayedColumns: string[] = ['service', 'price', 'discount', 'actions'];
  rows = this.serviceListService.rows();

  constructor(
    private datePipe: DatePipe,
    private invoiceService: InvoiceService,
    private serviceListService: ServicelistService,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    // Initialize the form group
    this.invoiceForm = new FormGroup({
      clientName: new FormControl(),
      billingPeriod: new FormControl(),
    });
  }

  ngOnInit() {
    this.generateInvoiceNumber();
    this.formatDateForDisplay();
  }

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

  deleteRow(index: number) {
    this.serviceListService.deleteService(index);
  }

  generateCustomInvoice() {
    this.setInvoiceDetails();
    this.invoiceService.generateCustomPDF();
  }
  generateInvoice() {
    this.setInvoiceDetails();
    this.invoiceService.generatePDF();
  }

  addNewService() {
    this.serviceListService.addService();
  }

  setInvoiceDetails() {
    let serviceDetails: ServiceDetails[] = [];
    // Get all the rows
    this.serviceListService.rows().forEach((row) => {
      serviceDetails.push({
        serviceType: row.service,
        price: +row.price,
        discount: +row.discount,
      });
    });

    // Set invoice details
    this.invoiceService.setInvoiceDetails({
      clientName: this.invoiceForm.controls['clientName'].value, // Use form control value
      billingPeriod: this.invoiceForm.controls['billingPeriod'].value, // Use form control value
      service: serviceDetails,
    });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      this.generateInvoice();
    }
  }
}
