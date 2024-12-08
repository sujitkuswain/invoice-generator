import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoiceService } from '../invoice.service';
import { LogoComponent } from '../shared/logo/logo.component';
import { Client } from './client.model';
import { ClientsService } from './clients.service';

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
  invoiceForm: FormGroup; // Initialize form group here

  clients: Client[] = this.clientsService.clients;

  displayedColumns: string[] = ['service', 'price', 'discount', 'actions'];
  dataSource = new MatTableDataSource<any>([]); // Use MatTableDataSource

  constructor(
    private datePipe: DatePipe,
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef,
    private clientsService: ClientsService
  ) {
    // Initialize the form group
    this.invoiceForm = new FormGroup({
      clientName: new FormControl(),
      billingPeriod: new FormControl(),
      services: new FormArray(
        [],
        [Validators.required, this.minOneRowValidator()]
      ),
    });
  }
  minOneRowValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control as FormArray;
      return array.length > 0 ? null : { minOneRow: true };
    };
  }

  ngOnInit() {
    this.addNewService();
  }

  deleteRow(index: number) {
    this.services.removeAt(index);
    this.updateDataSource();
  }

  addNewService() {
    const newRow = new FormGroup({
      service: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      discount: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
    });

    this.services.push(newRow);
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.services.controls;
    this.cdr.detectChanges(); // Trigger change detection
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const formData = this.invoiceForm.value;
      this.invoiceService.generateCustomPDF(formData);
    } else {
      console.log('Form is invalid!');
    }
  }

  get services(): FormArray {
    return this.invoiceForm.get('services') as FormArray;
  }
}
function minOneRowValidator(): import('@angular/forms').ValidatorFn {
  throw new Error('Function not implemented.');
}
