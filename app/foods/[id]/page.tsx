'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Food } from '@/types/food';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    const fetchFood = async () => {
      if (id) {
        try {
          const foodDoc = doc(db, 'foods', id);
          const foodData = await getDoc(foodDoc);
          if (foodData.exists()) {
            setFood(foodData.data() as Food);
            setFormData({
              name: foodData.data().name || '',
              description: foodData.data().description || '',
              price: foodData.data().price?.toString() || '',
            });
          } else {
            setError('Không tìm thấy món ăn!');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => setEditMode(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setError(FOOD_DETAIL_INVALID);
      return;
    }
    try {
      const foodRef = doc(db, 'foods', id);
      await updateDoc(foodRef, {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price, 10),
      });
      setFood({
        ...food,
        ...formData,
        price: parseInt(formData.price, 10),
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
      <h1 className="text-2xl font-bold mb-4">{editMode ? FOOD_DETAIL_EDIT_TITLE : FOOD_DETAIL_TITLE}</h1>
      {editMode ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">{FOOD_DETAIL_NAME}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{FOOD_DETAIL_DESC}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{FOOD_DETAIL_PRICE}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min={0}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            <div className="text-xs text-gray-500 mt-1">{formData.price && !isNaN(Number(formData.price)) ? Number(formData.price).toLocaleString('vi-VN') + ' VNĐ' : ''}</div>
          </div>
          <div className="space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {FOOD_DETAIL_SAVE}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              {FOOD_DETAIL_CANCEL}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p>
            <b>Tên món:</b> {food.name}
          </p>
          <p>
            <b>Mô tả:</b> {food.description}
          </p>
          <p>
            <b>Giá:</b> {food.price?.toLocaleString('vi-VN')} VNĐ
          </p>
          <button
            onClick={handleEdit}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
          >
            {FOOD_DETAIL_EDIT}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDetail;
