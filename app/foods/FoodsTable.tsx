import { Food } from '@/types/food';
import FoodItem from './FoodItem';

const FOODS_TABLE_NAME = 'Tên món';
const FOODS_TABLE_PRICE = 'Giá (VNĐ)';
const FOODS_TABLE_EMPTY = 'Không có món ăn nào.';

const FoodsTable = ({ foods }: { foods: Food[] }) => (
  <div className="overflow-x-auto">
    <table className="min-w-[300px] w-full bg-white rounded shadow border border-gray-200 text-sm sm:text-base table-fixed">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-2 py-2 border-b border-gray-200 text-left font-semibold text-gray-800 w-2/3 max-w-[220px] truncate">
            {FOODS_TABLE_NAME}
          </th>
          <th className="px-2 py-2 border-b border-gray-200 text-left font-semibold text-gray-800 w-1/3">
            {FOODS_TABLE_PRICE}
          </th>
        </tr>
      </thead>
      <tbody>
        {foods.length === 0 ? (
          <tr>
            <td colSpan={2} className="text-center text-gray-500 py-6">{FOODS_TABLE_EMPTY}</td>
          </tr>
        ) : (
          foods.map((food) => <FoodItem key={food.id} food={food} />)
        )}
      </tbody>
    </table>
  </div>
);

export default FoodsTable;