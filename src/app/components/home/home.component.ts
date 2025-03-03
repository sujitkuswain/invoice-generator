import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { InvoiceComponent } from '../invoice/invoice.component';
import { HistoryDataComponent } from '../history-data/history-data.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabsModule, InvoiceComponent, HistoryDataComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
