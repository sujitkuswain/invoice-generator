import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ServiceListComponent } from '../service-list/service-list.component';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';

@Component({
  selector: 'app-main-form',
  standalone: true,
  imports: [HeaderComponent, ServiceListComponent, ActionButtonsComponent],
  templateUrl: './main-form.component.html',
  styleUrl: './main-form.component.css',
})
export class MainFormComponent {}
