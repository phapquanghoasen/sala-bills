import React from 'react';

import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/images/amitabha.jpg"
        alt="Amitabha"
        fill
        style={{ objectFit: 'cover' }}
        className="rounded"
        priority
        quality={100}
      />
    </div>
  );
};

export default Home;
