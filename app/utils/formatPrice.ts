export function formatPrice(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue
    .toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    })
    .replace('₫', 'VNĐ')
    .trim();
}