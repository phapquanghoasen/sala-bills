import React from 'react';
import type { BillFood } from '@/types/bill';

interface BillFoodsTableProps {
  foods: BillFood[];
  tableName?: string;
  tablePrice?: string;
  tableQuantity?: string;
  tableAmount?: string;
}

const BILL_FOODS_TABLE_NAME = 'Tên món';
const BILL_FOODS_TABLE_PRICE = 'Giá';
const BILL_FOODS_TABLE_QUANTITY = 'Số lượng';
const BILL_FOODS_TABLE_AMOUNT = 'Thành tiền';

const BillFoodsTable: React.FC<BillFoodsTableProps> = ({
  foods,
  tableName = BILL_FOODS_TABLE_NAME,
  tablePrice = BILL_FOODS_TABLE_PRICE,
  tableQuantity = BILL_FOODS_TABLE_QUANTITY,
  tableAmount = BILL_FOODS_TABLE_AMOUNT,
}) => (
  <table className="min-w-full bg-white rounded shadow">
    <thead>
      <tr>
        <th className="px-4 py-2 border-b text-left">{tableName}</th>
        <th className="px-4 py-2 border-b text-left">{tablePrice}</th>
        <th className="px-4 py-2 border-b text-left">{tableQuantity}</th>
        <th className="px-4 py-2 border-b text-left">{tableAmount}</th>
      </tr>
    </thead>
    <tbody>
      {foods.map((food, idx) => (
        <tr key={idx}>
          <td className="px-4 py-2 border-b text-left">{food.name}</td>
          <td className="px-4 py-2 border-b text-left">{food.price.toLocaleString('vi-VN')} VNĐ</td>
          <td className="px-4 py-2 border-b text-left">{food.quantity}</td>
          <td className="px-4 py-2 border-b text-left">{(food.price * food.quantity).toLocaleString('vi-VN')} VNĐ</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default BillFoodsTable;
