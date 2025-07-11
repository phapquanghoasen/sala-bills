'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Food } from '@/types/food';
import Table from '@/components/Table';
import { Column } from '@/types/table';
import { formatPrice } from '@/utils/formatPrice';

const FOODS_TITLE = 'Danh sách món ăn';
const FOODS_ADD_BUTTON = '+ Thêm món ăn';
const FOODS_LOADING = 'Đang tải...';
const FOODS_ERROR = 'Lỗi khi tải danh sách món ăn';

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsCollection = collection(db, 'foods');
        const foodsSnapshot = await getDocs(foodsCollection);
        const foodsList = foodsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            price: typeof data.price === 'number' ? data.price : 0,
            imageUrl: data.imageUrl || '',
            createdAt: data.createdAt || new Date().toISOString(),
          };
        });
        setFoods(foodsList);
      } catch {
        setError(FOODS_ERROR);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const columns: Column<Food>[] = [
    {
      title: 'Tên món',
      className: 'px-2 py-2 border-b border-gray-200 text-left font-semibold text-gray-800 w-2/3 max-w-[220px] truncate',
      render: food => food.name,
    },
    {
      title: 'Giá (VNĐ)',
      className: 'px-2 py-2 border-b border-gray-200 text-left text-gray-800 w-1/3 max-w-[120px] truncate',
      render: food => formatPrice(food.price),
    },
  ];

  if (loading) return <div>{FOODS_LOADING}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-xl font-bold sm:text-2xl uppercase text-center sm:text-left w-full sm:w-auto">{FOODS_TITLE}</h1>
        <Link
          href="/foods/create-food"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
        >
          {FOODS_ADD_BUTTON}
        </Link>
      </div>
      <Table
        columns={columns}
        data={foods}
        emptyText="Không có món ăn nào."
        onRowClick={food => (window.location.href = `/foods/${food.id}`)}
      />
    </div>
  );
}
