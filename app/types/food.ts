import { Timestamp } from "firebase-admin/firestore";

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: Timestamp;
}

export interface RequestCreateFood {
  name: string;
  description: string;
  price: number;
}
