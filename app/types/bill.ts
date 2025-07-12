export interface BillFood {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
}

export interface BillHistory {
  updatedAt: string;
  oldData: {
    code: string;
    description: string;
    foods: BillFood[];
  };
}

export interface Bill {
  id: string;
  description: string;
  createdAt: string;
  code: string;
  foods: BillFood[];
  amount: number;
  history?: BillHistory[];
  tableNumber: string;
}

export type BillFormData = {
  tableNumber: string;
  description: string;
  foods: BillFood[];
};
