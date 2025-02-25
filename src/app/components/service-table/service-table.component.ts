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
    {
      service: 'test',
      price: 'test',
      discount: 'test',
      finalPrice: 'test',
      setteled: 'N',
    },
  ];

  colDefs: ColDef[] = [
    {
      field: 'service',
      flex: 1,
    },
    {
      field: 'price',
      flex: 1,
    },
    {
      field: 'discount',
      flex: 1,
    },
    {
      field: 'finalPrice',
      flex: 1,
    },
    {
      field: 'setteled',
      flex: 1,
    },
  ];
}
