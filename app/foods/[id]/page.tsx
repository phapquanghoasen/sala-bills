'use client';

import React, { useEffect, useState } from 'react';

import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { formatPrice } from '@/utils/format';

import { Food } from '@/types/food';

import FoodForm from '@/components/FoodForm';

interface FoodDetailProps {
  params: Promise<{ id: string }>;
}

const FOOD_DETAIL_TITLE = 'Chi tiết món ăn';
const FOOD_DETAIL_EDIT_TITLE = 'Chỉnh sửa món ăn';
const FOOD_DETAIL_NAME = 'Tên món';
const FOOD_DETAIL_DESC = 'Mô tả';
const FOOD_DETAIL_PRICE = 'Giá';
const FOOD_DETAIL_SAVE = 'Lưu';
const FOOD_DETAIL_CANCEL = 'Hủy';
const FOOD_DETAIL_EDIT = 'Sửa';
const FOOD_DETAIL_LOADING = 'Đang tải...';
const FOOD_DETAIL_NOT_FOUND = 'Không tìm thấy món ăn!';
const FOOD_DETAIL_INVALID = 'Vui lòng nhập thông tin hợp lệ.';
const FOOD_DETAIL_UPDATE_ERROR = 'Lỗi khi cập nhật món ăn';

const FoodDetail: React.FC<FoodDetailProps> = ({ params }) => {
  const { id } = React.use(params);

  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      if (id) {
        try {
          const foodDoc = doc(db, 'foods', id);
          const foodData = await getDoc(foodDoc);
          if (foodData.exists()) {
            setFood(foodData.data() as Food);
          } else {
            setError(FOOD_DETAIL_NOT_FOUND);
          }
        } catch {
          setError('Lỗi khi tải món ăn!');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFood();
  }, [id]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleEditSubmit = async (data: { name: string; description: string; price: number }) => {
    if (!data.name.trim() || isNaN(Number(data.price)) || Number(data.price) < 0) {
      setError(FOOD_DETAIL_INVALID);
      return;
    }
    try {
      const foodRef = doc(db, 'foods', id);
      await updateDoc(foodRef, {
        name: data.name,
        description: data.description,
        price: Number(data.price),
      });
      setFood({
        ...food,
        ...data,
        price: Number(data.price),
      } as Food);
      setEditMode(false);
      setError(null);
    } catch {
      setError(FOOD_DETAIL_UPDATE_ERROR);
    }
  };

  if (loading) return <div>{FOOD_DETAIL_LOADING}</div>;
  if (error) return <div>{error}</div>;
  if (!food) return <div>{FOOD_DETAIL_NOT_FOUND}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left">{editMode ? FOOD_DETAIL_EDIT_TITLE : FOOD_DETAIL_TITLE}</h1>
      {editMode ? (
        <FoodForm
          initialData={food}
          onSubmit={handleEditSubmit}
          error={error}
          submitLabel={FOOD_DETAIL_SAVE}
          cancelLabel={FOOD_DETAIL_CANCEL}
          onCancel={handleCancel}
        />
      ) : (
        <div className="max-w-full sm:max-w-lg mx-auto bg-white p-4 sm:p-6 rounded shadow">
          <p className="mb-2">
            <b>{FOOD_DETAIL_NAME}:</b> {food.name}
          </p>
          <p className="mb-2">
            <b>{FOOD_DETAIL_DESC}:</b> {food.description}
          </p>
          <p className="mb-2">
            <b>{FOOD_DETAIL_PRICE}:</b> {formatPrice(food.price)}
          </p>
          <button
            onClick={handleEdit}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            {FOOD_DETAIL_EDIT}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDetail;
