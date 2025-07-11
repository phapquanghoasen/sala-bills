import React from 'react';
import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <div
        className="w-full relative mb-8 rounded shadow overflow-hidden"
        style={{ aspectRatio: '21/9' }}
      >
        <Image
          src="/images/tay-phuong-cuc-lac.jpg"
          alt="Home"
          fill
          style={{ objectFit: 'cover' }}
          className="rounded"
          priority
        />
      </div>
    </div>
  );
};

export default Home;
