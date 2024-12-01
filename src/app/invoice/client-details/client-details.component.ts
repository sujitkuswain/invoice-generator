import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Client } from './client.model';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent {
  clients: Client[] = [
    { value: 'yummy', viewValue: 'Yummy Bakery and Sweets' },
    { value: 'technozone', viewValue: 'Techno Zone' },
  ];
}
