import React from 'react';
import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/images/tay-phuong-cuc-lac.jpg"
        alt="Home"
        fill
        style={{ objectFit: 'cover' }}
        className="rounded"
        priority
      />
    </div>
  );
};

export default Home;
