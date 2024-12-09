import { DatePipe, CommonModule } from '@angular/common';
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
import { BehaviorSubject } from 'rxjs';

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
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  invoiceForm: FormGroup; // Initialize form group here

  total$ = new BehaviorSubject<number>(0); // Observable for the total

  clients: Client[] = this.clientsService.clients;

  displayedColumns: string[] = [
    'service',
    'price',
    'discount',
    'finalPrice',
    'actions',
  ];
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

    // Initialize total when form data changes
    this.services.valueChanges.subscribe(() => this.updateTotal());
  }

  updateTotal() {
    const total = this.services.controls.reduce((sum, group) => {
      const finalPrice = group.get('finalPrice')?.value || 0;
      return sum + parseFloat(finalPrice);
    }, 0);
    this.total$.next(total);
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
      finalPrice: new FormControl({ value: '', disabled: true }),
    });

    const index = this.services.length;

    // Subscribe to changes in price and discount
    newRow.get('price')?.valueChanges.subscribe(() => {
      this.calculateFinalPrice(index);
    });

    newRow.get('discount')?.valueChanges.subscribe(() => {
      this.calculateFinalPrice(index);
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

  calculateFinalPrice(index: number) {
    const serviceGroup = this.services.at(index) as FormGroup;
    const price = serviceGroup.get('price')?.value || 0;
    const discount = serviceGroup.get('discount')?.value || 0;

    if (price >= 0 && discount >= 0 && discount <= 100) {
      const finalPrice = this.invoiceService.calculateFinalPrice(
        price,
        discount
      );
      serviceGroup
        .get('finalPrice')
        ?.setValue(finalPrice, { emitEvent: false });
    } else {
      serviceGroup.get('finalPrice')?.setValue(0, { emitEvent: false });
    }

    this.updateTotal(); // Update total after recalculating the price
    this.updateDataSource();
  }
}
function minOneRowValidator(): import('@angular/forms').ValidatorFn {
  throw new Error('Function not implemented.');
}
