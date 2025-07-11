import { useState } from 'react';
import type { RequestCreateFood } from '@/types/food';

interface CreateFoodFormProps {
  onSubmit: (data: RequestCreateFood) => Promise<void>;
  error: string | null;
}

const CREATE_FOOD_FORM_NAME = 'Tên món ăn';
const CREATE_FOOD_FORM_DESC = 'Mô tả';
const CREATE_FOOD_FORM_PRICE = 'Giá';
const CREATE_FOOD_FORM_SUBMIT = 'Tạo món ăn';

const CreateFoodForm = ({ onSubmit, error }: CreateFoodFormProps) => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, description, price });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow"
    >
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">{CREATE_FOOD_FORM_NAME}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{CREATE_FOOD_FORM_DESC}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{CREATE_FOOD_FORM_PRICE}</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          min={0}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {CREATE_FOOD_FORM_SUBMIT}
      </button>
    </form>
  );
};

export default CreateFoodForm;
