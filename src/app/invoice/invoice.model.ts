export interface ServiceDetails {
  serviceType: string;
  price: number;
  discount: number;
}

export interface InvoiceDetails {
  clientName: string;
  billingPeriod: string;
  service: ServiceDetails[];
}
