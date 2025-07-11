'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import FoodsTable from './FoodsTable';
import Link from 'next/link';
import { Food } from '@/types/food';

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

  if (loading) return <div>{FOODS_LOADING}</div>;
  if (error) return <div>{error}</div>;

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
