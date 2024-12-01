import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ServicelistService } from '../service-list/servicelist.service';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css',
})
export class ActionButtonsComponent {
  constructor(private serviceListService: ServicelistService) {}

  addNewService() {
    this.serviceListService.addService();
  }
}
