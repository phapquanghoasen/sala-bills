import React from 'react';

import { formatPrice } from '@/utils/format';

import type { BillHistory, BillFood } from '@/types/bill';

interface BillHistoryListProps {
  history: BillHistory[];
}

const FIELD_LABEL_CLASS = 'font-semibold';
const FIELD_VALUE_CLASS = 'font-mono';

const TIME_LABEL = 'Thời gian: ';
const CODE_LABEL = 'Mã HĐ: ';
const LIST_LABEL = 'Danh sách món cũ:';

const BillHistoryList: React.FC<BillHistoryListProps> = ({ history }) => (
  <ul className="bg-gray-50 border rounded p-2 sm:p-4 max-h-60 overflow-y-auto text-xs sm:text-sm">
    {history
      .slice()
      .reverse()
      .map((h, idx) => (
        <li
          key={idx}
          className="mb-2 border-b last:border-b-0 pb-2 sm:pb-3"
        >
          <div>
            <span className={FIELD_LABEL_CLASS}>{CODE_LABEL}</span>
            <span className={FIELD_VALUE_CLASS}>{h.oldData.code}</span>
          </div>
          <div>
            <span className={FIELD_LABEL_CLASS}>{TIME_LABEL}</span>
            <span className={FIELD_VALUE_CLASS}>
              {new Date(h.updatedAt).toLocaleString('vi-VN')}
            </span>
          </div>
          <div>
            <span className={FIELD_LABEL_CLASS}>{LIST_LABEL}</span>
            <ul className="list-disc ml-4 sm:ml-5">
              {h.oldData.foods?.map((f: BillFood, i: number) => (
                <li key={i}>
                  {f.name} (SL: {f.quantity}, Giá: {formatPrice(f.price)})
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
  </ul>
);

export default BillHistoryList;
