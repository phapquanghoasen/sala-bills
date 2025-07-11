import React from 'react';
import type { Food } from '@/types/food';

interface AvailableFoodsListProps {
  availableFoods: Food[];
  onAdd: (food: Food) => void;
  addLabel?: string;
  noFoodLabel?: string;
}

const AvailableFoodsList: React.FC<AvailableFoodsListProps> = ({ availableFoods, onAdd, addLabel = 'Thêm', noFoodLabel = 'Không còn món nào để thêm' }) => (
  <ul className="border rounded p-2 bg-white max-h-40 overflow-y-auto">
    {availableFoods.length === 0 ? (
      <li className="text-gray-400">{noFoodLabel}</li>
    ) : (
      availableFoods.map(food => (
        <li
          key={food.id}
          className="flex justify-between items-center py-1 border-b last:border-b-0"
        >
          <span>
            {food.name} ({food.price.toLocaleString('vi-VN')} VNĐ)
          </span>
          <button
            type="button"
            onClick={() => onAdd(food)}
            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
          >
            {addLabel}
          </button>
        </li>
      ))
    )}
  </ul>
);

export default AvailableFoodsList;
