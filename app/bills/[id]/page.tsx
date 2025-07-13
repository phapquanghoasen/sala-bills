'use client';

import React, { useEffect, useState } from 'react';

import { doc, getDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { useRequireUser } from '@/hooks/useRequireUser';

import type { Bill, BillFormData } from '@/types/bill';

import BillForm from '@/components/BillForm';
import ViewBill from '@/components/ViewBill';

// Constants chỉ dùng cho trang này
const BILL_LOAD_ERROR = 'Lỗi khi tải hóa đơn!';
const BILL_LOADING = 'Đang tải hóa đơn...';
const BILL_NOT_FOUND = 'Không tìm thấy hóa đơn!';
const EDIT_BILL_CANCEL = 'Hủy';
const EDIT_BILL_SAVE = 'Lưu';
const EDIT_BILL_SAVING = 'Đang lưu...';
const EDIT_BILL_TITLE = 'Chỉnh sửa hóa đơn';
const EDIT_BILL_UPDATE_ERROR = 'Lỗi khi cập nhật hóa đơn!';
const EDIT_BILL_UPDATE_NOT_FOUND = 'Không tìm thấy hóa đơn để cập nhật!';
const VIEW_BILL_TITLE = 'Chi tiết hóa đơn';

interface BillDetailProps {
  params: Promise<{ id: string }>;
}

const BillDetail: React.FC<BillDetailProps> = ({ params }) => {
  const { user, userLoading } = useRequireUser();
  const { id } = React.use(params);
  const [bill, setBill] = useState<Bill | null>(null);
  const [billLoading, setBillLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Realtime listener cho bill
  useEffect(() => {
    if (userLoading || !user || !id) return;
    setBillLoading(true);
    const billDocRef = doc(db, 'bills', id);
    const unsubscribe = onSnapshot(
      billDocRef,
      snapshot => {
        setBillLoading(false);
        if (snapshot.exists()) {
          setBill({ id: snapshot.id, ...snapshot.data() } as Bill);
          setError(null);
        } else {
          setBill(null);
          setError(BILL_NOT_FOUND);
        }
      },
      () => {
        setBillLoading(false);
        setError(BILL_LOAD_ERROR);
      }
    );
    return () => unsubscribe();
  }, [id, user, userLoading]);

  if (userLoading || !user) return <div>Đang kiểm tra đăng nhập...</div>;
  if (billLoading) return <div>{BILL_LOADING}</div>;
  if (error) return <div>{error}</div>;
  if (!bill) return <div>{BILL_NOT_FOUND}</div>;

  const handleUpdateBill = async ({ tableNumber, note, foods }: BillFormData) => {
    setIsSaving(true);
    try {
      const billRef = doc(db, 'bills', id);
      const billSnap = await getDoc(billRef);

      if (!billSnap.exists()) {
        setError(EDIT_BILL_UPDATE_NOT_FOUND);
        setIsSaving(false);
        return;
      }
      const oldBill = billSnap.data();

      await updateDoc(billRef, {
        code: oldBill.code,
        tableNumber,
        note,
        foods,
        history: [
          ...(oldBill.history || []),
          {
            code: oldBill.code,
            foods: oldBill.foods,
            note: oldBill.note,
            tableNumber: oldBill.tableNumber,
            updatedAt: Timestamp.now(),
            updatedBy: user.email,
          },
        ],
      });

      setEditMode(false);
    } catch (error) {
      console.log('error', error);
      setError(EDIT_BILL_UPDATE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {editMode ? (
        <BillForm
          title={EDIT_BILL_TITLE}
          initialTableNumber={bill.tableNumber}
          initialNote={bill.note}
          initialSelectedFoods={bill.foods}
          submitLabel={isSaving ? EDIT_BILL_SAVING : EDIT_BILL_SAVE}
          cancelLabel={EDIT_BILL_CANCEL}
          onSubmit={handleUpdateBill}
          onCancel={() => setEditMode(false)}
          error={error}
        />
      ) : (
        <ViewBill
          title={VIEW_BILL_TITLE}
          bill={bill}
          onEdit={() => setEditMode(true)}
        />
      )}
    </div>
  );
};

export default BillDetail;
