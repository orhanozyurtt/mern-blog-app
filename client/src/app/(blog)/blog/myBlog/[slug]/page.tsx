//detail page
import React from 'react';
import Detail from '@/components/blogPages/blogDetail';
interface IParams {
  params: {
    slug: string;
  };
}
const page = ({ params }: IParams) => {
  return (
    <div>
      <Detail params={params} />
    </div>
  );
};

export default page;
