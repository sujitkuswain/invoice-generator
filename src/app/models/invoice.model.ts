export interface Invoice {
  id?: string;
  clientName: string;
  billingPeriod: string;
  total: number;
  setteled: boolean;
}
