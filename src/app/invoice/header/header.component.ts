import { Component } from '@angular/core';
import { LogoComponent } from '../../shared/logo/logo.component';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';
import { ClientDetailsComponent } from '../client-details/client-details.component';
import { ContactDetailsComponent } from '../../shared/contact-details/contact-details.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    InvoiceDetailsComponent,
    ClientDetailsComponent,
    ContactDetailsComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
