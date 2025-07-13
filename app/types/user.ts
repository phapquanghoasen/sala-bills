import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  role: string;
  email: string;
  createdAt: Timestamp;
  printerIp?: string;
};
