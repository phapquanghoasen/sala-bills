import { useState, useEffect } from 'react';

import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { formatPrice } from '@/utils/format';

import type { BillFood, BillFormData } from '@/types/bill';
import type { Food } from '@/types/food';

interface BillFormProps {
  initialTableNumber?: string;
  initialNote?: string;
  initialSelectedFoods?: BillFood[];
  error?: string | null;
  submitLabel: string;
  cancelLabel?: string;
  title: string;
  onSubmit: (data: BillFormData) => Promise<void>;
  onCancel?: () => void;
}

const BILL_FORM_TABLE_LABEL = 'Số bàn';
const BILL_FORM_TABLE_PLACEHOLDER = 'Nhập số bàn...';
const BILL_FORM_NOTE_LABEL = 'Ghi chú (không bắt buộc)';
const BILL_FORM_NOTE_PLACEHOLDER = 'Ghi chú thêm (nếu có)...';
const BILL_FORM_FOOD_LABEL = 'Chọn món ăn';
const BILL_FORM_LOADING_FOODS = 'Đang tải danh sách món ăn...';
const BILL_FORM_NO_FOOD_FOUND = 'Không tìm thấy món nào';
const BILL_FORM_ADD_BUTTON = 'Thêm';
const BILL_FORM_SELECTED_FOOD_LABEL = 'Món ăn đã chọn';
const BILL_FORM_NO_SELECTED_FOOD = 'Chưa chọn món nào';
const BILL_FORM_REMOVE_BUTTON = 'Xóa';
const FOODS_ERROR_MESSAGE = 'Lỗi khi tải danh sách món ăn!';

const BillForm = ({
  initialTableNumber = '',
  initialNote = '',
  initialSelectedFoods = [],
  error,
  submitLabel,
  cancelLabel,
  title,
  onSubmit,
  onCancel,
}: BillFormProps) => {
  const [tableNumber, setTableNumber] = useState(initialTableNumber);
  const [note, setNote] = useState(initialNote);
  const [selectedFoods, setSelectedFoods] = useState<BillFood[]>(initialSelectedFoods);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [search, setSearch] = useState('');
  const [foodsError, setFoodsError] = useState<string | null>(null);

  useEffect(() => {
    setTableNumber(initialTableNumber);
    setNote(initialNote);
    setSelectedFoods(initialSelectedFoods);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTableNumber, initialNote, JSON.stringify(initialSelectedFoods)]);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoadingFoods(true);
      try {
        const foodsCollection = collection(db, 'foods');
        const foodsSnapshot = await getDocs(foodsCollection);
        const foodsList = foodsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Food[];
        setFoods(foodsList);
      } catch {
        setFoodsError(FOODS_ERROR_MESSAGE);
      } finally {
        setLoadingFoods(false);
      }
    };
    fetchFoods();
  }, []);


  console.log('Selected Foods:', selectedFoods);
  console.log('Available Foods:', foods);

  const availableFoods = foods.filter(food => !selectedFoods.some(f => f.id === food.id));
  const filteredFoods = availableFoods.filter(food =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFood = (food: Food) => {
    setSelectedFoods([
      ...selectedFoods,
      {
        id: food.id,
        name: food.name || '',
        price: food.price || 0,
        description: food.description || '',
        imageUrl: food.imageUrl || '',
        type: food.type || '',
        quantity: 1,
      },
    ]);
  };

  const handleRemoveFood = (food: BillFood) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${food.name}" khỏi danh sách?`)) {
      setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
    }
  };

  const handleQuantityChange = (foodId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedFoods(
      selectedFoods.map(f => (f.id === foodId ? { ...f, quantity: newQuantity } : f))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('first submit', selectedFoods);

    await onSubmit({
      tableNumber,
      note,
      foods: selectedFoods,
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center uppercase mb-4 sm:text-2xl sm:mb-6">{title}</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-full sm:max-w-lg mx-auto bg-white p-4 sm:p-6 rounded shadow"
      >
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">
            {BILL_FORM_TABLE_LABEL}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
            required
            placeholder={BILL_FORM_TABLE_PLACEHOLDER}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{BILL_FORM_NOTE_LABEL}</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-base resize-none"
            rows={3}
            placeholder={BILL_FORM_NOTE_PLACEHOLDER}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{BILL_FORM_FOOD_LABEL}</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nhập tên món ăn..."
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-base"
          />
          {loadingFoods ? (
            <div className="mt-2">{BILL_FORM_LOADING_FOODS}</div>
          ) : (
            <ul className="border rounded p-2 bg-white max-h-60 overflow-y-auto mt-2">
              {filteredFoods.length === 0 ? (
                <li className="text-gray-400">{BILL_FORM_NO_FOOD_FOUND}</li>
              ) : (
                filteredFoods.map(food => (
                  <li
                    key={food.id}
                    className="py-1 border-b last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className="font-semibold truncate max-w-[140px] block"
                        title={food.name}
                      >
                        {food.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddFood(food)}
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        {BILL_FORM_ADD_BUTTON}
                      </button>
                    </div>
                    <div className="text-gray-500 text-xs mt-1">{formatPrice(food.price)}</div>
                  </li>
                ))
              )}
            </ul>
          )}
          {foodsError && <div className="text-red-500">{foodsError}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{BILL_FORM_SELECTED_FOOD_LABEL}</label>
          <ul className="border rounded p-2 bg-white max-h-60 overflow-y-auto">
            {selectedFoods.length === 0 ? (
              <li className="text-gray-400">{BILL_FORM_NO_SELECTED_FOOD}</li>
            ) : (
              selectedFoods.map(food => (
                <li
                  key={food.id}
                  className="py-1 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <span
                      className="font-semibold truncate max-w-[140px] block"
                      title={food.name}
                    >
                      {food.name}
                    </span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveFood(food)}
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        {BILL_FORM_REMOVE_BUTTON}
                      </button>
                      <input
                        type="number"
                        value={food.quantity}
                        onChange={e => handleQuantityChange(food.id, Number(e.target.value))}
                        className="ml-2 w-16 border border-gray-300 rounded-md p-1 text-center"
                      />
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{formatPrice(food.price)}</div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className={cancelLabel ? 'flex flex-col gap-2 sm:flex-row sm:gap-4' : ''}>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-blue-600 transition"
          >
            {submitLabel}
          </button>
          {cancelLabel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-gray-500 transition"
            >
              {cancelLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BillForm;
