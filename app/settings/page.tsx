'use client';

import { useEffect, useState } from 'react';

import { doc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { useRequireAdmin } from '@/hooks/useRequireAdmin';

const SETTINGS_TITLE = 'Cài đặt hệ thống';
const PRINTER_IP_LABEL = 'Địa chỉ IP máy in';
const EDIT_LABEL = 'Chỉnh sửa';
const SAVE_LABEL = 'Lưu';
const SAVING_LABEL = 'Đang lưu...';
const SUCCESS_MSG = 'Cập nhật thành công!';
const ERROR_MSG = 'Có lỗi xảy ra. Vui lòng thử lại.';

export default function SettingsPage() {
  const { user, userLoading } = useRequireAdmin();
  const [printerIp, setPrinterIp] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.printerIp) {
      setPrinterIp(user.printerIp || '');
    }
  }, [user]);

  if (userLoading || !user) return <div className="p-4 text-center">Đang kiểm tra quyền truy cập...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateDoc(doc(db, 'users', user.id), {
        printerIp,
      });
      setSuccess(SUCCESS_MSG);
      setEditMode(false);
    } catch {
      setError(ERROR_MSG);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-full sm:max-w-md mx-auto p-2 sm:p-4">
      <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center">{SETTINGS_TITLE}</h1>
      <div className="bg-white p-4 sm:p-8 rounded shadow space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-base sm:text-lg">{PRINTER_IP_LABEL}</label>
          {!editMode ? (
            <div className="flex flex-col gap-3">
              <span className="font-mono break-all text-gray-800 text-base sm:text-lg px-2 py-2 bg-gray-50 rounded border border-gray-200">
                {printerIp || <i>Chưa có</i>}
              </span>
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base sm:text-lg transition"
                onClick={() => setEditMode(true)}
              >
                {EDIT_LABEL}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 text-base sm:text-lg"
                value={printerIp}
                onChange={e => setPrinterIp(e.target.value)}
                required
                placeholder="VD: 192.168.1.100"
                disabled={saving}
              />
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base sm:text-lg transition"
                  disabled={saving}
                >
                  {saving ? SAVING_LABEL : SAVE_LABEL}
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-semibold text-base sm:text-lg transition"
                  onClick={() => {
                    setPrinterIp(user.printerIp || '');
                    setEditMode(false);
                    setError('');
                    setSuccess('');
                  }}
                  disabled={saving}
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
        {success && <div className="text-green-600 text-sm">{success}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </div>
  );
}
