'use client';
import React, { useEffect, useState } from 'react';
import {
  useDetailBlogQuery,
  useUpdateBlogMutation,
} from '@/redux/slice/blogApiSlice';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useRouter } from 'next/navigation';
interface IParams {
  params: {
    slug: string;
  };
}

// Tanımlanmamış SerializedError tipini tanımla
type SerializedError = {
  message: string;
};

const BlogUpdate2: React.FC<IParams> = ({ params }) => {
  const router = useRouter();
  const { data, isLoading, error } = useDetailBlogQuery(params.slug);
  const [updateBlogMutation] = useUpdateBlogMutation(); // Correct mutation hook
  const slug = params.slug;
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    category: '',
    enableNewTags: false,
    newTags: '',
  });

  useEffect(() => {
    if (data && data.data) {
      const { title, content, tags, categoryName } = data.data;
      setFormData({
        title: title || '',
        content: content || '',
        tags: tags ? tags.join(', ') : '',
        category: categoryName || '',
        enableNewTags: false,
        newTags: '',
      });
    }
  }, [data]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormData({
      ...formData,
      enableNewTags: checked,
      // Clear newTags when switching between tags and newTags
      newTags: checked ? formData.newTags : '',
      // Clear tags when switching between tags and newTags
      tags: !checked ? formData.tags : '',
    });
  };

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && error.data && typeof error.data === 'object';
  };

  const isSerializedError = (error: any): error is SerializedError => {
    return error && typeof error === 'object' && 'message' in error;
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { title, content, tags, category, newTags, enableNewTags } =
        formData;
      let updatedData;

      if (enableNewTags) {
        updatedData = {
          title,
          content,
          newTags: newTags.split(',').map((tag) => tag.trim()),
          category,
        };
      } else {
        updatedData = {
          title,
          content,
          tags: tags.split(',').map((tag) => tag.trim()),
          category,
        };
      }

      // Call the updateBlogMutation with the correct parameters
      const response: any = await updateBlogMutation({
        slug: slug,
        data: updatedData,
      });

      if (response.error) {
        console.error('Failed to update blog:', response.error);

        if (isFetchBaseQueryError(response.error)) {
          throw new Error(
            (response.error.data as { message: string }).message ||
              'Unknown error occurred'
          );
        } else if (isSerializedError(response.error)) {
          throw new Error(response.error.message);
        } else {
          throw new Error('An unknown error occurred');
        }
      }

      toast.success('Blog updated successfully');
      router.push(`/blog/myBlog`);
      // Handle success message or redirect to another page
    } catch (error) {
      console.error('Failed to update blog:', error);
      toast.error((error as Error).message);
    }
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

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6">Update Blog</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full h-32"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            disabled={formData.enableNewTags}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Add New Tags
          </label>
          <input
            type="text"
            name="newTags"
            value={formData.newTags}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            disabled={!formData.enableNewTags}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Use New Tags
          </label>
          <input
            type="checkbox"
            name="enableNewTags"
            checked={formData.enableNewTags}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogUpdate2;
