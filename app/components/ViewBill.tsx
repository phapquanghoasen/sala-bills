import { useState, useEffect } from 'react';

import clsx from 'clsx';

import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import { getBillTotal } from '@/utils/bill';
import { formatDate } from '@/utils/date';
import { formatPrice, formatPriceWithoutUnitCurrency } from '@/utils/format';

import { Bill, BillFood } from '@/types/bill';

import BillHistoryList from '@/components/BillHistoryList';
import Table from '@/components/Table';

interface ViewBillProps {
  bill: Bill;
  billId: string;
  total: number;
  title: string;
  onEdit: () => void;
}

const BILL_DETAIL_NOTE = 'Ghi chú';
const BILL_DETAIL_TOTAL = 'Tổng tiền';
const BILL_DETAIL_DATE = 'Ngày tạo';
const BILL_DETAIL_CODE = 'Mã hóa đơn';
const BILL_DETAIL_LIST = 'Danh sách món ăn';
const BILL_DETAIL_EDIT = 'Chỉnh sửa';
const BILL_DETAIL_PRINT = 'In hóa đơn';
const BILL_DETAIL_PRINT_LOADING = 'Đang gửi...';
const BILL_DETAIL_HISTORY = 'Lịch sử chỉnh sửa';
const BILL_DETAIL_TABLE_NUMBER = 'Số bàn';

const BILL_PRINT_STATUS = {
  pending: 'Đang chờ xử lý',
  printing: 'Đang in hóa đơn',
  success: 'In hóa đơn thành công',
  failed: 'In hóa đơn thất bại',
};

function canEditOrPrint(printStatus: string | null, printLoading: boolean) {
  return (
    !printLoading && (printStatus === 'success' || printStatus === 'failed' || printStatus === null)
  );
}

function getPrintBillStatus(printStatus: string | null) {
  return printStatus
    ? BILL_PRINT_STATUS[printStatus as keyof typeof BILL_PRINT_STATUS] ?? BILL_PRINT_STATUS.pending
    : BILL_PRINT_STATUS.pending;
}

const ViewBill: React.FC<ViewBillProps> = ({ title, bill, billId, total, onEdit }) => {
  const [printLoading, setPrintLoading] = useState(false);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'printQueue'),
      where('billId', '==', billId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      if (!snapshot.empty) {
        setPrintStatus(snapshot.docs[0].data().status);
      } else {
        setPrintStatus(null);
      }
    });
    return () => unsubscribe();
  }, [billId]);

  const handlePrint = async () => {
    const confirmPrint = window.confirm('Bạn có chắc chắn muốn gửi yêu cầu in hóa đơn này?');
    if (!confirmPrint) return;
    setPrintLoading(true);
    try {
      await addDoc(collection(db, 'printQueue'), {
        billId,
        code: bill.code,
        note: bill.note,
        foods: bill.foods,
        total: getBillTotal(bill.foods),
        createdAt: serverTimestamp(),
        status: 'pending',
        posSecret: process.env.NEXT_PUBLIC_POS_SECRET,
      });
    } finally {
      setPrintLoading(false);
    }
  };

  // Định nghĩa columns cho Table
  const columns = [
    {
      title: 'Tên món',
      className: 'w-1/5 max-w-[200px]',
      render: (food: BillFood) => food.name,
    },
    {
      title: 'SL',
      className: 'w-1/12 max-w-[40px]',
      render: (food: BillFood) => food.quantity,
    },
    {
      title: 'Giá',
      className: 'w-1/5 max-w-[100px] text-right',
      render: (food: BillFood) => formatPriceWithoutUnitCurrency(food.price),
    },
    {
      title: 'Thành tiền',
      className: 'w-1/5 max-w-[120px] text-right',
      render: (food: BillFood) => formatPriceWithoutUnitCurrency(food.price * food.quantity),
    },
  ];

  const printBillStatus = getPrintBillStatus(printStatus);
  const isPrintButtonDisabled = !canEditOrPrint(printStatus, printLoading);
  const isEditButtonDisabled = !canEditOrPrint(printStatus, printLoading);

  return (
    <div>
      <h1 className="text-xl font-bold text-center uppercase mb-4 sm:text-2xl sm:mb-6">{title}</h1>
      <div>
        <p className="mb-1 text-sm sm:text-base">
          <b>{BILL_DETAIL_DATE}:</b>
          <span className="ml-1">{formatDate(bill.createdAt)}</span>
        </p>
        <p className="mb-1 text-sm sm:text-base">
          <b>{BILL_DETAIL_CODE}:</b>
          <span className="ml-1">{bill.code}</span>
        </p>
        <p className="mb-1 text-sm sm:text-base">
          <b>{BILL_DETAIL_TABLE_NUMBER}:</b>
          <span className="ml-1">{bill.tableNumber}</span>
        </p>
        <p className="mb-1 text-sm sm:text-base">
          <b>{BILL_DETAIL_NOTE}:</b>
          <span className="ml-1">{bill.note}</span>
        </p>
        <h2 className="text-base sm:text-lg mt-4 mb-2">{BILL_DETAIL_LIST}</h2>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={bill.foods}
          />
        </div>
        <div className="flex justify-end mt-2">
          <p className="text-base sm:text-lg">
            <b>{BILL_DETAIL_TOTAL}:</b>
            <span className="ml-1">{formatPrice(total)}</span>
          </p>
        </div>
        {printLoading && (
          <p className="text-yellow-600 font-medium mt-2 mb-0">{BILL_DETAIL_PRINT_LOADING}</p>
        )}
        {printStatus && (
          <p className="text-blue-600 font-medium mt-2 mb-0">
            Trạng thái in hóa đơn: {printBillStatus}
          </p>
        )}
        <button
          className={clsx(
            'mt-4 sm:mt-6 bg-yellow-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded print:hidden w-full sm:w-auto',
            { 'opacity-50 cursor-not-allowed': isEditButtonDisabled }
          )}
          onClick={onEdit}
          disabled={isEditButtonDisabled}
        >
          {BILL_DETAIL_EDIT}
        </button>
        <button
          className={clsx(
            'mt-2 sm:mt-6 sm:ml-4 px-3 py-2 sm:px-4 sm:py-2 rounded print:hidden w-full sm:w-auto bg-green-500 text-white',
            { 'opacity-50 cursor-not-allowed': isPrintButtonDisabled }
          )}
          onClick={handlePrint}
          disabled={isPrintButtonDisabled}
        >
          {printLoading ? BILL_DETAIL_PRINT_LOADING : BILL_DETAIL_PRINT}
        </button>
        {bill.history && bill.history.length > 0 && (
          <div className="my-6">
            <h2 className="text-base sm:text-lg mb-2">{BILL_DETAIL_HISTORY}</h2>
            <BillHistoryList history={bill.history} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBill;
