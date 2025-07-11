import { Food } from '@/types/food';
import { useRouter } from 'next/navigation';

const FoodItem = ({ food }: { food: Food }) => {
  const router = useRouter();
  return (
    <tr
      className="hover:bg-blue-50 transition-colors cursor-pointer"
      onClick={() => router.push(`/foods/${food.id}`)}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') router.push(`/foods/${food.id}`);
      }}
      role="button"
    >
      <td className="px-2 py-2 border-b border-gray-200 text-left font-semibold text-gray-800 sm:px-4 max-w-[180px] truncate">
        {food.name}
      </td>
      <td className="px-2 py-2 border-b border-gray-200 text-left text-gray-800 sm:px-4 max-w-[120px] truncate">
        {food.price.toLocaleString('vi-VN')}
      </td>
    </tr>
  );
};

export default FoodItem;
