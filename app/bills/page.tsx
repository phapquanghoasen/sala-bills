'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import type { Bill } from '@/types/bill';

const BILLS_TITLE = 'Danh sách hóa đơn';
const BILLS_ADD_BUTTON = '+ Thêm hóa đơn';
const BILLS_LOADING = 'Đang tải...';
const BILLS_ERROR = 'Lỗi khi tải danh sách hóa đơn';
const BILLS_EMPTY = 'Không có hóa đơn nào.';
const BILLS_TABLE_CODE = 'Mã hóa đơn';
const BILLS_TABLE_DESC = 'Mô tả';
const BILLS_TABLE_TOTAL = 'Số tiền';
const BILLS_TABLE_DATE = 'Ngày tạo';
const BILLS_TABLE_ACTION = 'Thao tác';
const BILLS_VIEW_EDIT = 'Xem / Sửa';

const Bills: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const billsCollection = collection(db, 'bills');
        const billsSnapshot = await getDocs(billsCollection);
        const billsList = billsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Bill[];
        // Sắp xếp giảm dần theo createdAt
        billsList.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setBills(billsList);
      } catch {
        setError(BILLS_ERROR);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  if (loading) return <div>{BILLS_LOADING}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{BILLS_TITLE}</h1>
        <Link
          href="/bills/create-bill"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {BILLS_ADD_BUTTON}
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">{BILLS_TABLE_CODE}</th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">{BILLS_TABLE_DESC}</th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">{BILLS_TABLE_TOTAL}</th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">{BILLS_TABLE_DATE}</th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">{BILLS_TABLE_ACTION}</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-4"
                >
                  {BILLS_EMPTY}
                </td>
              </tr>
            ) : (
              bills.map(bill => {
                const total = bill.foods ? bill.foods.reduce((sum, food) => sum + food.price * food.quantity, 0) : 0;
                return (
                  <tr
                    key={bill.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b text-left font-mono text-blue-700">{bill.code}</td>
                    <td className="px-4 py-2 border-b text-left font-semibold text-gray-800">{bill.description}</td>
                    <td className="px-4 py-2 border-b text-left text-gray-800">{total.toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-4 py-2 border-b text-left text-gray-800">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString('vi-VN') : ''}</td>
                    <td className="px-4 py-2 border-b text-left">
                      <Link
                        href={`/bills/${bill.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {BILLS_VIEW_EDIT}
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bills;
