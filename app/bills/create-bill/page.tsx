'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

import { db } from '@/firebase/config';

import type { BillFormData } from '@/types/bill';

import BillForm from '@/components/BillForm';

const CREATE_BILL_TITLE = 'Tạo hóa đơn';
const CREATE_BILL_ERROR = 'Có lỗi xảy ra khi tạo hóa đơn. Vui lòng thử lại!';
const CREATE_BILL_VALIDATE_ERROR = 'Vui lòng nhập số bàn và chọn ít nhất 1 món ăn.';
const CREATE_BILL_CODE_PREFIX = 'HS';
const CREATE_BILL_SUBMIT_LABEL = 'Tạo hóa đơn';
const CREATE_BILL_SUBMIT_LABEL_LOADING = 'Đang tạo...';

const CreateBill: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async ({ tableNumber, description, foods }: BillFormData) => {
    if (!tableNumber.trim() || foods.length === 0) {
      setError(CREATE_BILL_VALIDATE_ERROR);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const billsCollection = collection(db, 'bills');
      const billsSnapshot = await getDocs(billsCollection);
      const billCount = billsSnapshot.size + 1;
      const newCode = `${CREATE_BILL_CODE_PREFIX}${billCount.toString().padStart(8, '0')}`;

      const foodsWithAmount = foods.map(food => ({
        id: food.id,
        name: food.name || '',
        price: food.price || 0,
        description: food.description || '',
        imageUrl: food.imageUrl || '',
        quantity: food.quantity || 1,
      }));

      await addDoc(collection(db, 'bills'), {
        code: newCode,
        tableNumber,
        description,
        foods: foodsWithAmount,
        createdAt: serverTimestamp(),
        history: [],
      });
      router.push('/bills');
    } catch {
      setError(CREATE_BILL_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{CREATE_BILL_TITLE}</h1>
      <BillForm
        error={error}
        submitLabel={isSubmitting ? CREATE_BILL_SUBMIT_LABEL_LOADING : CREATE_BILL_SUBMIT_LABEL}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateBill;
