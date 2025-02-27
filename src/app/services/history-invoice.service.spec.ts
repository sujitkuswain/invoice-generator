import { TestBed } from '@angular/core/testing';

import { HistoryInvoiceService } from './history-invoice.service';

describe('HistoryInvoiceService', () => {
  let service: HistoryInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
