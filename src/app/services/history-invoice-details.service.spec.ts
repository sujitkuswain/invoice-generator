import { TestBed } from '@angular/core/testing';

import { HistoryInvoiceDetailsService } from './history-invoice-details.service';

describe('HistoryInvoiceDetailsService', () => {
  let service: HistoryInvoiceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryInvoiceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
