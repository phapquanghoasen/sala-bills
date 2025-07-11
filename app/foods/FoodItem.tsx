import Link from 'next/link';
import Image from 'next/image';

interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const FOOD_ITEM_VIEW_EDIT = 'Xem / Sửa';

const FoodItem = ({ food }: { food: Food }) => (
  <tr className="hover:bg-blue-50 transition-colors">
    <td className="px-4 py-2 border-b border-gray-200 text-left text-gray-800">
      {food.imageUrl ? (
        <Image
          src={food.imageUrl}
          alt={food.name}
          width={56}
          height={56}
          className="rounded object-cover"
        />
      ) : (
        <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-gray-400"></div>
      )}
    </td>
    <td className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-800">
      {food.name}
    </td>
    <td className="px-4 py-2 border-b border-gray-200 text-left text-gray-800">
      {food.description}
    </td>
    <td className="px-4 py-2 border-b border-gray-200 text-left text-gray-800">
      {food.price.toLocaleString('vi-VN')} VNĐ
    </td>
    <td className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-800">
      <Link
        href={`/foods/${food.id}`}
        className="text-blue-600 hover:underline"
      >
        {FOOD_ITEM_VIEW_EDIT}
      </Link>
    </td>
  </tr>
);

export default FoodItem;
