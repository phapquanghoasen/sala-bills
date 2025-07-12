import type { BillFood } from '@/types/bill';

export function getBillTotal(foods: BillFood[]): number {
  return (foods || []).reduce((sum, food) => sum + food.price * food.quantity, 0);
}
