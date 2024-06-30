'use client';
import React from 'react';
import { useDetailBlogQuery } from '@/redux/slice/blogApiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// Tanımlanmamış SerializedError tipini tanımla
type SerializedError = {
  message: string;
};

interface paramsType {
  params: {
    slug: string;
  };
}

const BlogDetail: React.FC<paramsType> = ({ params }) => {
  const { slug } = params;
  const { data, isLoading, error } = useDetailBlogQuery(slug);

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && error.data && typeof error.data === 'object';
  };

  const isSerializedError = (error: any): error is SerializedError => {
    return error && typeof error === 'object' && 'message' in error;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {isSerializedError(error) ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!data || !data.data) {
    return <div>No blog data found.</div>;
  }

  const {
    title,
    content,
    tags,
    authorName,
    categoryName,
    createdAt,
    updatedAt,
    publishDate,
  } = data.data;

  return (
    <>
      <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center mb-6 border-b pb-4 ">
          <h1 className="text-3xl font-bold ">{title}</h1>
          <div className="text-sm text-gray-600">
            <div className="mb-2">
              <span className="font-semibold">Author: </span>
              {authorName}
            </div>
            <div>
              <span className="font-semibold">Category: </span>
              {categoryName}
            </div>
          </div>
        </div>
        <div className="prose mb-6">
          <p>{content}</p>
        </div>
        <div className="border-t pt-4 text-sm text-gray-600">
          <div className="mb-2">
            <span className="font-semibold">Created At: </span>
            {createdAt}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Updated At: </span>
            {updatedAt}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Publish Date: </span>
            {publishDate}
          </div>
          <div>
            <span className="font-semibold">Tags: </span>
            {tags.join(', ')}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
