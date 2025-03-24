export interface InvoiceDetails {
  id: string;
  invoiceId: string;
  serviceType: string;
  price: number;
  discount: number;
  createdBy: string;
  modifiedBy: string;
  createdAt: Date;
  modifiedAt: Date;
}
