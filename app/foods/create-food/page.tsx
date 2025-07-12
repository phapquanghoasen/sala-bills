'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { db } from '@/firebase/config';

import { RequestCreateFood } from '@/types/food';

import FoodForm from '@/components/FoodForm';

const CREATE_FOOD_TITLE = 'Thêm món ăn mới';
const CREATE_FOOD_ERROR = 'Không thể tạo món ăn mới. Vui lòng thử lại sau.';

const CreateFood: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateFood = async ({ name, description, price }: RequestCreateFood) => {
    const foodData = {
      name,
      description,
      price,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'foods'), foodData);
      router.push('/foods');
    } catch {
      setError(CREATE_FOOD_ERROR);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-center uppercase mb-4 sm:text-2xl sm:mb-6">
        {CREATE_FOOD_TITLE}
      </h1>
      <FoodForm
        onSubmit={handleCreateFood}
        error={error}
        submitLabel="Tạo món ăn"
      />
    </div>
  );
};

export default CreateFood;
