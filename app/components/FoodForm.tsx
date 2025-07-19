import { useState, useEffect } from 'react';

import { formatPrice } from '@/utils/format';

import type { RequestCreateFood } from '@/types/food';

interface FoodFormProps {
  initialData?: Partial<RequestCreateFood>;
  onSubmit: (data: RequestCreateFood) => Promise<void>;
  error?: string | null;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

const FOOD_FORM_DESC = 'Mô tả';
const FOOD_FORM_NAME = 'Tên món ăn';
const FOOD_FORM_PRICE = 'Giá';
const FOOD_FORM_TYPE = 'Nhóm món ăn';

const FoodForm = ({
  initialData = {},
  onSubmit,
  error,
  submitLabel,
  cancelLabel,
  onCancel,
}: FoodFormProps) => {
  const [name, setName] = useState<string>(initialData.name || '');
  const [price, setPrice] = useState<string>(String(initialData.price || ''));
  const [description, setDescription] = useState<string>(initialData.description || '');
  const [type, setType] = useState<string>(initialData.type || '');

  useEffect(() => {
    setName(initialData.name || '');
    setPrice(String(initialData.price || ''));
    setDescription(initialData.description || '');
    setType(initialData.type || '');
  }, [initialData.name, initialData.price, initialData.description, initialData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      description,
      price: parseFloat(price),
      type,
      imageUrl: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-full sm:max-w-lg mx-auto bg-white p-4 sm:p-6 rounded shadow"
    >
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">
          {FOOD_FORM_NAME}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-base"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          {FOOD_FORM_TYPE}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={type}
          onChange={e => setType(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-base"
          placeholder="1, 2, 3 ..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{FOOD_FORM_PRICE}</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          min={0}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-base"
        />
        <div className="text-xs text-gray-500 mt-1">
          {price && `Định dạng: ${formatPrice(price)}`}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{FOOD_FORM_DESC}</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-base resize-none"
          rows={3}
        />
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
  );
};

export default FoodForm;
