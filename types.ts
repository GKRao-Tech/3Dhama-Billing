
export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weightLabel?: string; // e.g., "0.5 kg", "1 kg"
}

export interface Bill {
  id: string;
  billNumber: string;
  customerName: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
}

export interface DailyReport {
  date: string;
  revenue: number;
  billCount: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Cakes' | 'Pastries' | 'Desserts' | 'Cookies';
  basePrice: number; // Used for non-cake items or as a base rate
  weightPrices?: { [weight: string]: number }; // e.g., { "0.5": 450, "1.0": 800 }
}
