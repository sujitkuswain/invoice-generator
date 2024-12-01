import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServicelistService {
  rows = signal([{ service: '', price: '', discount: '' }]);

  addService() {
    this.rows.update((currentRows) => [
      ...currentRows,
      { service: '', price: '', discount: '' },
    ]);
  }

  deleteService(index: number) {
    this.rows.update((currentRows) =>
      currentRows.filter((_, i) => i !== index)
    );
  }
  constructor() {}
}
