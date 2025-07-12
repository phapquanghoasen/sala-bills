import { Timestamp } from 'firebase-admin/firestore';

export interface BillFood {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
}

export interface BillHistory {
  updatedAt: Timestamp;
  oldData: {
    code: string;
    description: string;
    foods: BillFood[];
  };
}

export interface Bill {
  id: string;
  note?: string;
  code: string;
  foods: BillFood[];
  history?: BillHistory[];
  tableNumber: string;
  createdAt: Timestamp;
}

export type BillFormData = {
  foods: BillFood[];
  note: string;
  tableNumber: string;
};
