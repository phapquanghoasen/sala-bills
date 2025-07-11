import React from 'react';
import type { BillHistory, BillFood } from '@/types/bill';

interface BillHistoryListProps {
  history: BillHistory[];
  timeLabel?: string;
  descLabel?: string;
  codeLabel?: string;
  listLabel?: string;
}

const BillHistoryList: React.FC<BillHistoryListProps> = ({ history, timeLabel = 'Thời gian:', descLabel = 'Mô tả cũ:', codeLabel = 'Mã hóa đơn cũ:', listLabel = 'Danh sách món cũ:' }) => (
  <ul className="bg-gray-50 border rounded p-2 max-h-60 overflow-y-auto text-sm">
    {history
      .slice()
      .reverse()
      .map((h, idx) => (
        <li
          key={idx}
          className="mb-2 border-b last:border-b-0 pb-2"
        >
          <div>
            <b>{timeLabel}</b> {new Date(h.updatedAt).toLocaleString('vi-VN')}
          </div>
          <div>
            <b>{descLabel}</b> {h.oldData.description}
          </div>
          <div>
            <b>{codeLabel}</b> {h.oldData.code}
          </div>
          <div>
            <b>{listLabel}</b>
            <ul className="list-disc ml-5">
              {h.oldData.foods?.map((f: BillFood, i: number) => (
                <li key={i}>
                  {f.name} (SL: {f.quantity}, Giá: {f.price.toLocaleString('vi-VN')} VNĐ)
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
  </ul>
);

export default BillHistoryList;
