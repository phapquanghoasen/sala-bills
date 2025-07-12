import { Timestamp } from 'firebase-admin/firestore';

export function formatDate(date: Timestamp): string {
  if (!date) return '';

  return date.toDate().toLocaleString('vi-VN');
}

export function getTimestamp(date: Timestamp): number {
  if (!date) return 0;

  return date.toDate().getTime();
}
