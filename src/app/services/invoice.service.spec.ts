import { TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ClientsService } from './clients.service';
import { InvoiceService } from './invoice.service';

fdescribe('InvoiceService', () => {
  let service: InvoiceService, mockDatePipe: any, mockClientService: any;

  beforeEach(() => {
    mockDatePipe = jasmine.createSpyObj(DatePipe, ['transform']);
    mockClientService = jasmine.createSpyObj(ClientsService, [
      'getClientViewValue',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: DatePipe, useValue: mockDatePipe },
        { provide: ClientsService, useValue: mockClientService },
      ],
    });
    service = TestBed.inject(InvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
