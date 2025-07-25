'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { useRequireUser } from '@/hooks/useRequireUser';
import { getBillTotal } from '@/utils/bill';
import { formatPrice } from '@/utils/format';

import { Bill } from '@/types/bill';
import { Column } from '@/types/table';

import Table from '@/components/Table';

import { db } from '../firebase/config';

const BILLS_TITLE = 'Danh sách hóa đơn';
const BILLS_ADD_BUTTON = '+ Thêm hóa đơn';
const BILLS_LOADING = 'Đang tải...';
const BILLS_ERROR = 'Lỗi khi tải danh sách hóa đơn';
const BILLS_EMPTY = 'Không có hóa đơn nào.';

const columns: Column<Bill>[] = [
  {
    title: 'Mã hóa đơn',
    className: 'text-blue-800 w-2/5 max-w-[120px]',
    render: (bill: Bill) => bill.code,
  },
  {
    title: 'Số bàn',
    className: 'w-1/5 max-w-[60px]',
    render: (bill: Bill) => bill.tableNumber ?? '-',
  },
  {
    title: 'Số tiền',
    className: 'w-2/5 max-w-[120px]',
    render: (bill: Bill) => {
      const total = getBillTotal(bill.foods);
      return formatPrice(total);
    },
  },
];

const Bills: React.FC = () => {
  const { user, userLoading } = useRequireUser();
  const [bills, setBills] = useState<Bill[]>([]);
  const [billsLoading, setBillsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (userLoading || !user) return;
    const fetchBills = async () => {
      try {
        const billsQuery = query(collection(db, 'bills'), orderBy('createdAt', 'desc'));
        const billsSnapshot = await getDocs(billsQuery);
        const billsList = billsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Bill[];
        setBills(billsList);
      } catch (error) {
        console.error('Error fetching bills:', error);
        setError(BILLS_ERROR);
      } finally {
        setBillsLoading(false);
      }
    };
    fetchBills();
  }, [user, userLoading]);

  if (userLoading || !user) return <div>Đang kiểm tra đăng nhập...</div>;

  if (billsLoading) return <div>{BILLS_LOADING}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-xl font-bold sm:text-2xl uppercase text-center sm:text-left w-full sm:w-auto">
          {BILLS_TITLE}
        </h1>
        <Link
          href="/bills/create-bill"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
        >
          {BILLS_ADD_BUTTON}
        </Link>
      </div>
      <Table
        columns={columns}
        data={bills}
        emptyText={BILLS_EMPTY}
        onRowClick={bill => router.push(`/bills/${bill.id}`)}
      />
    </div>
  );
};

export default Bills;
