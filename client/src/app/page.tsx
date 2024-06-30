import React from 'react';
import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div className="relative w-full h-screen">
      <div className="fill-background">
        <Image
          src="/img/blogHome.png"
          alt="Sample Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
    </div>
  );
};

export default Home;
