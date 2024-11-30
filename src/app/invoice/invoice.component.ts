import { Component } from '@angular/core';
import { MainFormComponent } from './main-form/main-form.component';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [MainFormComponent],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent {}
