import React from 'react';

import { formatDate } from '@/utils/date';
import { formatPrice } from '@/utils/format';

import type { BillHistory, BillFood } from '@/types/bill';

interface BillHistoryListProps {
  history: BillHistory[];
}

const TIME_LABEL = 'Thời gian: ';
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
            <span>{TIME_LABEL}</span>
            <span>{formatDate(h.updatedAt)}</span>
          </div>
          <div>
            <span>{LIST_LABEL}</span>
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
