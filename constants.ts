
import { Product } from './types';

export const GST_RATE = 0.09; // 9% CGST and 9% SGST

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Chocolate Truffle Cake', 
    category: 'Cakes',
    basePrice: 450,
    weightPrices: { "0.5": 450, "1.0": 850, "1.5": 1250, "2.0": 1600 }
  },
  { 
    id: '2', 
    name: 'Red Velvet Cake', 
    category: 'Cakes',
    basePrice: 550,
    weightPrices: { "0.5": 550, "1.0": 1000, "1.5": 1450, "2.0": 1900 }
  },
  { 
    id: '6', 
    name: 'Fresh Fruit Cake', 
    category: 'Cakes',
    basePrice: 500,
    weightPrices: { "0.5": 500, "1.0": 950, "1.5": 1400, "2.0": 1800 }
  },
  { id: '3', name: 'Vanilla Cupcake', basePrice: 45, category: 'Pastries' },
  { id: '4', name: 'Pineapple Pastry', basePrice: 60, category: 'Pastries' },
  { id: '5', name: 'Brownie Bliss', basePrice: 85, category: 'Desserts' },
  { id: '7', name: 'Chocolate Cookie', basePrice: 20, category: 'Cookies' },
];

export const SHOP_DETAILS = {
  name: '3Dhama',
  address: 'Premium Bakery & Studio, Flour Town',
  phone: '+91 9876543210',
  gstin: '27AAAAA0000A1Z5',
};
