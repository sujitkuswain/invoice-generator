import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-service-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './service-table.component.html',
  styleUrl: './service-table.component.css',
})
export class ServiceTableComponent {
  rowData = [
    { service: 'test', price: 'test', discount: 'test', finalPrice: 'test' },
  ];

  colDefs: ColDef[] = [
    {
      field: 'service',
    },
    {
      field: 'price',
    },
    {
      field: 'discount',
    },
    {
      field: 'finalPrice',
    },
  ];
}
