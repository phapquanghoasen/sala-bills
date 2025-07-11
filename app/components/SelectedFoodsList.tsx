import React from 'react';
import type { BillFood } from '@/types/bill';

interface SelectedFoodsListProps {
  selectedFoods: BillFood[];
  onQuantityChange: (foodId: string, newQuantity: number) => void;
  onRemove: (foodId: string) => void;
  minusLabel?: string;
  plusLabel?: string;
  removeLabel?: string;
  noSelectedLabel?: string;
}

const SelectedFoodsList: React.FC<SelectedFoodsListProps> = ({
  selectedFoods,
  onQuantityChange,
  onRemove,
  minusLabel = '-',
  plusLabel = '+',
  removeLabel = 'Xóa',
  noSelectedLabel = 'Chưa chọn món nào',
}) => (
  <ul className="border rounded p-2 bg-white max-h-60 overflow-y-auto">
    {selectedFoods.length === 0 ? (
      <li className="text-gray-400">{noSelectedLabel}</li>
    ) : (
      selectedFoods.map(food => (
        <li
          key={food.id}
          className="flex justify-between items-center py-1 border-b last:border-b-0"
        >
          <span>
            {food.name} ({food.price.toLocaleString('vi-VN')} VNĐ)
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onQuantityChange(food.id, food.quantity - 1)}
              className="px-2 py-1 bg-gray-300 rounded text-sm"
              disabled={food.quantity <= 1}
            >
              {minusLabel}
            </button>
            <input
              type="number"
              min={1}
              value={food.quantity}
              onChange={e => onQuantityChange(food.id, Number(e.target.value))}
              className="w-12 text-center border rounded"
            />
            <button
              type="button"
              onClick={() => onQuantityChange(food.id, food.quantity + 1)}
              className="px-2 py-1 bg-gray-300 rounded text-sm"
            >
              {plusLabel}
            </button>
            <button
              type="button"
              onClick={() => onRemove(food.id)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              {removeLabel}
            </button>
          </div>
        </li>
      ))
    )}
  </ul>
);

export default SelectedFoodsList;
