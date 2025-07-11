import FoodItem from './FoodItem';

interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const FOODS_TABLE_IMAGE = 'Hình ảnh';
const FOODS_TABLE_NAME = 'Tên món';
const FOODS_TABLE_DESC = 'Mô tả';
const FOODS_TABLE_PRICE = 'Giá';
const FOODS_TABLE_ACTION = 'Thao tác';
const FOODS_TABLE_EMPTY = 'Không có món ăn nào.';

const FoodsTable = ({ foods }: { foods: Food[] }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded shadow border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-800">{FOODS_TABLE_IMAGE}</th>
          <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-800">{FOODS_TABLE_NAME}</th>
          <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-800">{FOODS_TABLE_DESC}</th>
          <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-800">{FOODS_TABLE_PRICE}</th>
          <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-800">{FOODS_TABLE_ACTION}</th>
        </tr>
      </thead>
      <tbody>
        {foods.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center text-gray-500 py-6">{FOODS_TABLE_EMPTY}</td>
          </tr>
        ) : (
          foods.map((food) => <FoodItem key={food.id} food={food} />)
        )}
      </tbody>
    </table>
  </div>
);

export default FoodsTable;