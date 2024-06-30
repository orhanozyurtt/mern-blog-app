import React from 'react';
import Update from '@/components/blogPages/blogUpdate2';
// import Update from '@/components/blogPages/blogUpdateTest';
interface IParams {
  params: {
    slug: string;
  };
}
const page = ({ params }: IParams) => {
  return (
    <div>
      <Update params={params} />
    </div>
  );
};

export default page;
