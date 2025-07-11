'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import CreateFoodForm from './CreateFoodForm';
import { RequestCreateFood } from '@/types/food';

const CREATE_FOOD_TITLE = 'Thêm món ăn mới';
const CREATE_FOOD_ERROR = 'Không thể tạo món ăn mới. Vui lòng thử lại sau.';

const CreateFood: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFormSubmit = async ({
    name,
    description,
    price,
  }: RequestCreateFood) => {
    const foodData = {
      name,
      description,
      price,
      createdAt: new Date().toISOString(),
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
      <h1 className="text-2xl font-bold mb-4">{CREATE_FOOD_TITLE}</h1>
      <CreateFoodForm onSubmit={handleFormSubmit} error={error} />
    </div>
  );
};

export default CreateFood;
