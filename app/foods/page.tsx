'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { useRequireUser } from '@/hooks/useRequireUser';
import { formatPrice } from '@/utils/format';

import { Food } from '@/types/food';
import { Column } from '@/types/table';

import Table from '@/components/Table';

const FOODS_TITLE = 'Danh sách món ăn';
const FOODS_ADD_BUTTON = '+ Thêm món ăn';
const FOODS_LOADING = 'Đang tải...';
const FOODS_ERROR = 'Lỗi khi tải danh sách món ăn';

export default function FoodsPage() {
  const { user, userLoading } = useRequireUser();

  const [foods, setFoods] = useState<Food[]>([]);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (userLoading || !user) return;

    const fetchFoods = async () => {
      try {
        const foodsQuery = query(collection(db, 'foods'), orderBy('name'));
        const foodsSnapshot = await getDocs(foodsQuery);
        const foodsList = foodsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            price: typeof data.price === 'number' ? data.price : 0,
            imageUrl: data.imageUrl || '',
            type: data.type || '',
            createdAt: data.createdAt,
          };
        });
        setFoods(foodsList);
      } catch {
        setError(FOODS_ERROR);
      } finally {
        setFoodsLoading(false);
      }
    };
    fetchFoods();
  }, [user, userLoading]);

  if (userLoading || !user) return <div>Đang kiểm tra đăng nhập...</div>;
  if (foodsLoading) return <div>{FOODS_LOADING}</div>;
  if (error) return <div>{error}</div>;

  const columns: Column<Food>[] = [
    {
      title: 'Tên món',
      className: 'w-2/3 max-w-[220px] font-semibold',
      render: food => food.name,
    },
    {
      title: 'Giá (VNĐ)',
      className: 'w-1/3 max-w-[120px]',
      render: food => formatPrice(food.price),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-xl font-bold sm:text-2xl uppercase text-center sm:text-left w-full sm:w-auto">
          {FOODS_TITLE}
        </h1>
        {user.role === 'admin' && (
          <Link
            href="/foods/create-food"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
          >
            {FOODS_ADD_BUTTON}
          </Link>
        )}
      </div>
      <Table
        columns={columns}
        data={foods}
        emptyText="Không có món ăn nào."
        onRowClick={food => router.push(`/foods/${food.id}`)}
      />
    </div>
  );
}
