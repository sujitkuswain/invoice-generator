import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServicelistService } from './servicelist.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css',
  providers: [],
})
export class ServiceListComponent {
  // Table columns
  displayedColumns: string[] = ['service', 'price', 'discount', 'actions'];

  rows = this.serviceListService.rows;

  constructor(private serviceListService: ServicelistService) {}
  deleteRow(index: any) {
    this.serviceListService.deleteService(index);
  }
}
