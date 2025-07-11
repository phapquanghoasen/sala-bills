import FoodsTable from './FoodsTable';
import Link from 'next/link';

const FOODS_TITLE = 'Danh sách món ăn';
const FOODS_ADD_BUTTON = '+ Thêm món ăn';

async function getFoods() {
  const res = await fetch('http://localhost:3000/api/foods', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch foods');
  return res.json();
}

export default async function FoodsPage() {
  const foods = await getFoods();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{FOODS_TITLE}</h1>
        <Link
          href="/foods/create-food"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {FOODS_ADD_BUTTON}
        </Link>
      </div>
      <FoodsTable foods={foods} />
    </div>
  );
}
