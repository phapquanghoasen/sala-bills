import { Timestamp } from "firebase/firestore";

export interface Food {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: Timestamp;
}

export interface RequestCreateFood {
  name: string;
  description: string;
  price: number;
  type: string;
  imageUrl: string;
}
