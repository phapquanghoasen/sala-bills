import Link from 'next/link';

const NOT_FOUND_TEXT = 'Không tìm thấy trang';
const NOT_FOUND_DESC = 'Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.';
const NOT_FOUND_HOME = 'Quay về trang chủ';
const NOT_FOUND_CODE = '404';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-5xl font-bold text-red-600 mb-4">{NOT_FOUND_CODE}</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{NOT_FOUND_TEXT}</h2>
      <p className="text-gray-500 mb-6">{NOT_FOUND_DESC}</p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {NOT_FOUND_HOME}
      </Link>
    </div>
  );
};

export default NotFound;
