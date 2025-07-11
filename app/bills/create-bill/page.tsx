'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase/config';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import type { Food } from '@/types/food';
import type { BillFood } from '@/types/bill';

const CREATE_BILL_TITLE = 'Tạo hóa đơn';
const CREATE_BILL_TABLE_LABEL = 'Số bàn';
const CREATE_BILL_TABLE_PLACEHOLDER = 'Nhập số bàn...';
const CREATE_BILL_DESC_LABEL = 'Mô tả (không bắt buộc)';
const CREATE_BILL_DESC_PLACEHOLDER = 'Ghi chú thêm (nếu có)...';
const CREATE_BILL_SEARCH_LABEL = 'Tìm kiếm món ăn';
const CREATE_BILL_SEARCH_PLACEHOLDER = 'Nhập tên món ăn...';
const CREATE_BILL_FOOD_LABEL = 'Chọn món ăn';
const CREATE_BILL_LOADING_FOODS = 'Đang tải danh sách món ăn...';
const CREATE_BILL_NO_FOOD_FOUND = 'Không tìm thấy món nào';
const CREATE_BILL_ADD_BUTTON = 'Thêm';
const CREATE_BILL_SELECTED_FOOD_LABEL = 'Món ăn đã chọn';
const CREATE_BILL_NO_SELECTED_FOOD = 'Chưa chọn món nào';
const CREATE_BILL_REMOVE_BUTTON = 'Xóa';
const CREATE_BILL_CREATING = 'Đang tạo...';
const CREATE_BILL_SUBMIT = 'Tạo hóa đơn';
const CREATE_BILL_ALERT = 'Vui lòng nhập số bàn và chọn ít nhất 1 món ăn.';
const CREATE_BILL_ERROR = 'Có lỗi xảy ra khi tạo hóa đơn. Vui lòng thử lại!';

const CreateBill: React.FC = () => {
  const [description, setDescription] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [allFoods, setAllFoods] = useState<Food[]>([]); // Lưu danh sách gốc
  const [selectedFoods, setSelectedFoods] = useState<BillFood[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsCollection = collection(db, 'foods');
        const foodsSnapshot = await getDocs(foodsCollection);
        const foodsList = foodsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Food[];
        setFoods(foodsList);
        setAllFoods(foodsList); // Lưu lại danh sách gốc
      } finally {
        setLoadingFoods(false);
      }
    };
    fetchFoods();
  }, []);

  const handleAddFood = (food: Food) => {
    setSelectedFoods([
      ...selectedFoods,
      {
        id: food.id,
        name: food.name || '',
        price: food.price || 0,
        description: food.description || '',
        imageUrl: food.imageUrl || '',
        quantity: 1,
      },
    ]);
    setFoods(foods.filter(f => f.id !== food.id));
  };

  const handleRemoveFood = (food: BillFood) => {
    setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
    setFoods(prevFoods => {
      // Thêm lại món ăn vào đúng vị trí ban đầu dựa trên allFoods
      const newFoods = [
        ...prevFoods,
        {
          id: food.id,
          name: food.name || '',
          description: food.description || '',
          price: food.price || 0,
          imageUrl: food.imageUrl || '',
        },
      ];
      // Sắp xếp lại theo thứ tự allFoods
      return allFoods.filter(f => newFoods.some(nf => nf.id === f.id));
    });
  };

  const handleQuantityChange = (foodId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedFoods(selectedFoods.map(f => (f.id === foodId ? { ...f, quantity: newQuantity } : f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim() || selectedFoods.length === 0) {
      alert(CREATE_BILL_ALERT);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const billsCollection = collection(db, 'bills');
      const billsSnapshot = await getDocs(billsCollection);
      const billCount = billsSnapshot.size + 1;
      const newCode = `HS${billCount.toString().padStart(8, '0')}`;

      const foodsWithAmount = selectedFoods.map(food => ({
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
        createdAt: new Date().toISOString(),
        history: [],
      });
      router.push('/bills');
    } catch {
      setError(CREATE_BILL_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFoods = foods.filter(food => food.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{CREATE_BILL_TITLE}</h1>
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">
            {CREATE_BILL_TABLE_LABEL} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
            placeholder={CREATE_BILL_TABLE_PLACEHOLDER}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{CREATE_BILL_DESC_LABEL}</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder={CREATE_BILL_DESC_PLACEHOLDER}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{CREATE_BILL_SEARCH_LABEL}</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={CREATE_BILL_SEARCH_PLACEHOLDER}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{CREATE_BILL_FOOD_LABEL}</label>
          {loadingFoods ? (
            <div>{CREATE_BILL_LOADING_FOODS}</div>
          ) : (
            <ul className="border rounded p-2 bg-white max-h-60 overflow-y-auto">
              {filteredFoods.length === 0 ? (
                <li className="text-gray-400">{CREATE_BILL_NO_FOOD_FOUND}</li>
              ) : (
                filteredFoods.map(food => (
                  <li
                    key={food.id}
                    className="flex justify-between items-center py-1 border-b last:border-b-0"
                  >
                    <span>
                      {food.name} ({Number(food.price).toLocaleString('vi-VN')} VNĐ)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddFood(food)}
                      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      {CREATE_BILL_ADD_BUTTON}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{CREATE_BILL_SELECTED_FOOD_LABEL}</label>
          <ul className="border rounded p-2 bg-white max-h-60 overflow-y-auto">
            {selectedFoods.length === 0 ? (
              <li className="text-gray-400">{CREATE_BILL_NO_SELECTED_FOOD}</li>
            ) : (
              selectedFoods.map(food => (
                <li
                  key={food.id}
                  className="flex justify-between items-center py-1 border-b last:border-b-0"
                >
                  <span>
                    {food.name} ({Number(food.price).toLocaleString('vi-VN')}₫)
                  </span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveFood(food)}
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      {CREATE_BILL_REMOVE_BUTTON}
                    </button>
                    <input
                      type="number"
                      value={food.quantity}
                      onChange={e => handleQuantityChange(food.id, Number(e.target.value))}
                      className="ml-2 w-16 border border-gray-300 rounded-md p-1 text-center"
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? CREATE_BILL_CREATING : CREATE_BILL_SUBMIT}
        </button>
      </form>
    </div>
  );
};

export default CreateBill;
