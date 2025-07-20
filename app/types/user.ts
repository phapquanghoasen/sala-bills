import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  role: string;
  email: string;
  createdAt: Timestamp;
  printerClientIp?: string;
  printerClientPort?: number;
  printerKitchenIp?: string;
  printerKitchenPort?: number;
};
