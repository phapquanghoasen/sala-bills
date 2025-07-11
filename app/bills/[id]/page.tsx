'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, updateDoc, collection, getDocs, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import type { Food } from '@/types/food';
import type { Bill, BillFood } from '@/types/bill';
import React from 'react';
import * as TEXT from '@/constants/bill';
import BillFoodsTable from '@/components/BillFoodsTable';
import SelectedFoodsList from '@/components/SelectedFoodsList';
import AvailableFoodsList from '@/components/AvailableFoodsList';
import BillHistoryList from '@/components/BillHistoryList';

interface BillDetailProps {
  params: Promise<{ id: string }>;
}

const BillDetail: React.FC<BillDetailProps> = ({ params }) => {
  const { id } = React.use(params);
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // State cho edit
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<BillFood[]>([]);
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Realtime listener cho bill
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const billDoc = doc(db, 'bills', id);
    const unsubscribe = onSnapshot(
      billDoc,
      billData => {
        if (billData.exists()) {
          const billObj = billData.data() as Bill;
          setBill(billObj);
          setSelectedFoods(billObj.foods || []);
          setDescription(billObj.description || '');
          setCode(billObj.code || '');
          setError(null);
        } else {
          setError(TEXT.BILL_DETAIL_NOT_FOUND);
        }
        setLoading(false);
      },
      () => {
        setError(TEXT.BILL_DETAIL_LOAD_ERROR);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [id]);

  // Lấy danh sách món ăn để thêm mới
  useEffect(() => {
    if (editMode) {
      const fetchFoods = async () => {
        const foodsCollection = collection(db, 'foods');
        const foodsSnapshot = await getDocs(foodsCollection);
        const foodsList = foodsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Food[];
        setFoods(foodsList);
      };
      fetchFoods();
    }
  }, [editMode]);

  // Thêm món mới vào bill
  const handleAddFood = (food: Food) => {
    setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
  };

  // Xóa món khỏi bill
  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter(f => f.id !== foodId));
  };

  // Sửa số lượng món
  const handleQuantityChange = (foodId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedFoods(selectedFoods.map(f => (f.id === foodId ? { ...f, quantity: newQuantity } : f)));
  };

  // Lưu bill đã chỉnh sửa
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const billRef = doc(db, 'bills', id);
      const billSnap = await getDoc(billRef);

      if (!billSnap.exists()) {
        setError(TEXT.BILL_DETAIL_UPDATE_NOT_FOUND);
        setIsSaving(false);
        return;
      }
      const oldBill = billSnap.data();

      await updateDoc(billRef, {
        code,
        description,
        foods: selectedFoods,
        history: [
          ...(oldBill.history || []),
          {
            updatedAt: new Date().toISOString(),
            oldData: {
              code: oldBill.code,
              description: oldBill.description,
              foods: oldBill.foods,
            },
          },
        ],
      });

      setEditMode(false);
    } catch {
      setError(TEXT.BILL_DETAIL_UPDATE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  // Gửi yêu cầu in hóa đơn
  const handleSendToPrint = async () => {
    if (!bill) return;
    await addDoc(collection(db, 'printQueue'), {
      billId: id,
      code: bill.code,
      description: bill.description,
      foods: bill.foods,
      total: bill.foods.reduce((sum: number, food: BillFood) => sum + food.price * food.quantity, 0),
      createdAt: Timestamp.now(),
      status: 'pending',
      posSecret: process.env.NEXT_PUBLIC_POS_SECRET,
    });
    alert(TEXT.BILL_DETAIL_PRINTED);
  };

  if (loading) return <div>{TEXT.BILL_DETAIL_LOADING}</div>;
  if (error) return <div>{error}</div>;
  if (!bill) return <div>{TEXT.BILL_DETAIL_NOT_FOUND}</div>;

  // Lọc ra các món chưa có trong bill để thêm mới
  const availableFoods = foods.filter(food => !selectedFoods.some(f => f.id === food.id));

  // Tổng tiền động
  const total = (bill.foods || []).reduce((sum: number, food: BillFood) => sum + food.price * food.quantity, 0);
  const editTotal = selectedFoods.reduce((sum, food) => sum + food.price * food.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{TEXT.BILL_DETAIL_TITLE}</h1>
      {!editMode ? (
        <div>
          <p>
            <b>{TEXT.BILL_DETAIL_DESC}:</b> {bill.description}
          </p>
          <p>
            <b>{TEXT.BILL_DETAIL_TOTAL}:</b> {total.toLocaleString('vi-VN')} VNĐ
          </p>
          <p>
            <b>{TEXT.BILL_DETAIL_DATE}:</b> {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
          </p>
          <p>
            <b>{TEXT.BILL_DETAIL_CODE}:</b> <span className="font-mono">{bill.code}</span>
          </p>
          <h2 className="text-lg font-semibold mt-6 mb-2">{TEXT.BILL_DETAIL_LIST}</h2>
          <BillFoodsTable foods={bill.foods} />

          <button
            className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded print:hidden"
            onClick={() => setEditMode(true)}
          >
            {TEXT.BILL_DETAIL_EDIT}
          </button>

          <button
            className="mt-6 bg-green-500 text-white px-4 py-2 rounded print:hidden"
            onClick={handleSendToPrint}
          >
            {TEXT.BILL_DETAIL_PRINT}
          </button>

          {bill.history && bill.history.length > 0 && (
            <div className="my-6">
              <h2 className="text-lg font-semibold mb-2">{TEXT.BILL_DETAIL_HISTORY}</h2>
              <BillHistoryList
                history={bill.history || []}
                timeLabel={TEXT.BILL_DETAIL_HISTORY_TIME}
                descLabel={TEXT.BILL_DETAIL_HISTORY_DESC}
                codeLabel={TEXT.BILL_DETAIL_HISTORY_CODE}
                listLabel={TEXT.BILL_DETAIL_HISTORY_LIST}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">{TEXT.BILL_DETAIL_DESC}</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">{TEXT.BILL_DETAIL_SELECTED}</label>
            <SelectedFoodsList
              selectedFoods={selectedFoods}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveFood}
              minusLabel={TEXT.BILL_DETAIL_MINUS}
              plusLabel={TEXT.BILL_DETAIL_PLUS}
              removeLabel={TEXT.BILL_DETAIL_REMOVE}
              noSelectedLabel={TEXT.BILL_DETAIL_NO_SELECTED}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">{TEXT.BILL_DETAIL_ADD_FOOD}</label>
            <AvailableFoodsList
              availableFoods={availableFoods}
              onAdd={handleAddFood}
              addLabel={TEXT.BILL_DETAIL_ADD_FOOD}
              noFoodLabel={TEXT.BILL_DETAIL_NO_FOOD}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">{TEXT.BILL_DETAIL_TOTAL_INPUT}</label>
            <input
              type="text"
              value={editTotal.toLocaleString('vi-VN') + ' VNĐ'}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
            />
          </div>
          {editMode && (
            <div className="mb-4">
              <label className="block text-gray-700">{TEXT.BILL_DETAIL_CODE_LABEL}</label>
              <div className="mt-1 block w-full border border-gray-200 rounded-md p-2 bg-gray-100 font-mono select-text">{code}</div>
            </div>
          )}
          <div className="space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? TEXT.BILL_DETAIL_SAVING : TEXT.BILL_DETAIL_SAVE}
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setEditMode(false)}
              disabled={isSaving}
            >
              {TEXT.BILL_DETAIL_CANCEL}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetail;
