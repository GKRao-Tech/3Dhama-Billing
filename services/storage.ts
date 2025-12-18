
import { Bill } from '../types';

const STORAGE_KEY = 'sweettreats_bills_v1';

export const saveBill = (bill: Bill) => {
  const existing = getBills();
  const updated = [bill, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getBills = (): Bill[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteBill = (id: string) => {
  const existing = getBills();
  const updated = existing.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
