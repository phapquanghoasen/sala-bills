'use client';

import { useEffect, useState } from 'react';

import { doc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { useRequireAdmin } from '@/hooks/useRequireAdmin';

const SETTINGS_TITLE = 'Cài đặt hệ thống';
const CLIENT_PRINTER_IP_LABEL = 'Địa chỉ IP máy in khách';
const CLIENT_PRINTER_PORT_LABEL = 'Port máy in khách';
const KITCHEN_PRINTER_IP_LABEL = 'Địa chỉ IP máy in nhà bếp';
const KITCHEN_PRINTER_PORT_LABEL = 'Port máy in nhà bếp';
const EDIT_LABEL = 'Chỉnh sửa';
const SAVE_LABEL = 'Lưu';
const SAVING_LABEL = 'Đang lưu...';
const SUCCESS_MSG = 'Cập nhật thành công!';
const ERROR_MSG = 'Có lỗi xảy ra. Vui lòng thử lại.';

export default function SettingsPage() {
  const { user, userLoading } = useRequireAdmin();
  const [printerClientIp, setPrinterClientIp] = useState<string>('');
  const [printerClientPort, setPrinterClientPort] = useState<number>(0);
  const [printerKitchenIp, setPrinterKitchenIp] = useState<string>('');
  const [printerKitchenPort, setPrinterKitchenPort] = useState<number>(0);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setPrinterClientIp(user?.printerClientIp || '');
    setPrinterClientPort(user?.printerClientPort || 0);
    setPrinterKitchenIp(user?.printerKitchenIp || '');
    setPrinterKitchenPort(user?.printerKitchenPort || 0);
  }, [
    user?.printerClientIp,
    user?.printerClientPort,
    user?.printerKitchenIp,
    user?.printerKitchenPort,
  ]);

  if (userLoading || !user) {
    return <div className="p-4 text-center">Đang kiểm tra quyền truy cập...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateDoc(doc(db, 'users', user.id), {
        printerClientIp,
        printerClientPort,
        printerKitchenIp,
        printerKitchenPort,
      });

      setSuccess(SUCCESS_MSG);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(ERROR_MSG);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setPrinterClientIp(user.printerClientIp || '');
    setPrinterClientPort(user.printerClientPort || 9100);
    setPrinterKitchenIp(user.printerKitchenIp || '');
    setPrinterKitchenPort(user.printerKitchenPort || 9100);
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-full sm:max-w-md mx-auto p-2 sm:p-4">
      <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center">{SETTINGS_TITLE}</h1>
      <div className="bg-white p-4 sm:p-8 rounded shadow space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-base sm:text-lg">
            {CLIENT_PRINTER_IP_LABEL}
          </label>
          {!editMode ? (
            <span className="font-mono break-all text-gray-800 text-base sm:text-lg px-2 py-2 bg-gray-50 rounded border border-gray-200 block">
              {printerClientIp || <i>Chưa có</i>}
            </span>
          ) : (
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-base sm:text-lg"
              value={printerClientIp}
              onChange={e => setPrinterClientIp(e.target.value)}
              placeholder="VD: 192.168.1.100"
              disabled={saving}
            />
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-base sm:text-lg">
            {CLIENT_PRINTER_PORT_LABEL}
          </label>
          {!editMode ? (
            <span className="font-mono break-all text-gray-800 text-base sm:text-lg px-2 py-2 bg-gray-50 rounded border border-gray-200 block">
              {printerClientPort || <i>Chưa có</i>}
            </span>
          ) : (
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 text-base sm:text-lg"
              value={printerClientPort}
              onChange={e => setPrinterClientPort(Number(e.target.value))}
              placeholder="VD: 9100"
              disabled={saving}
            />
          )}
        </div>

        {/* Máy in nhà bếp */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-base sm:text-lg">
            {KITCHEN_PRINTER_IP_LABEL}
          </label>
          {!editMode ? (
            <span className="font-mono break-all text-gray-800 text-base sm:text-lg px-2 py-2 bg-gray-50 rounded border border-gray-200 block">
              {printerKitchenIp || <i>Chưa có</i>}
            </span>
          ) : (
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-base sm:text-lg"
              value={printerKitchenIp}
              onChange={e => setPrinterKitchenIp(e.target.value)}
              placeholder="VD: 192.168.1.101"
              disabled={saving}
            />
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-base sm:text-lg">
            {KITCHEN_PRINTER_PORT_LABEL}
          </label>
          {!editMode ? (
            <span className="font-mono break-all text-gray-800 text-base sm:text-lg px-2 py-2 bg-gray-50 rounded border border-gray-200 block">
              {printerKitchenPort || <i>Chưa có</i>}
            </span>
          ) : (
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 text-base sm:text-lg"
              value={printerKitchenPort}
              onChange={e => setPrinterKitchenPort(Number(e.target.value))}
              placeholder="VD: 9100"
              disabled={saving}
            />
          )}
        </div>

        {!editMode ? (
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base sm:text-lg transition"
            onClick={() => setEditMode(true)}
          >
            {EDIT_LABEL}
          </button>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
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
              onClick={resetForm}
              disabled={saving}
            >
              Hủy
            </button>
          </form>
        )}

        {success && <div className="text-green-600 text-sm">{success}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </div>
  );
}
