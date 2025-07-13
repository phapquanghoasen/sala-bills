import { Timestamp } from 'firebase/firestore';

export interface BillFood {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
}

export interface BillHistory {
  code: string;
  foods: BillFood[];
  note?: string;
  tableNumber: string;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface Bill {
  id: string;
  note?: string;
  code: string;
  foods: BillFood[];
  history?: BillHistory[];
  tableNumber: string;
  createdAt: Timestamp;
  createdBy: string;
}

export type BillFormData = {
  foods: BillFood[];
  note: string;
  tableNumber: string;
};
