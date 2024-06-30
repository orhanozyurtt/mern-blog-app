'use client';
import React, { useState, useEffect } from 'react';
import {
  useGetMyBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '@/redux/slice/blogApiSlice';
import Blogadd from '@/components/blogPages/blogAdd2';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Blog {
  _id: string;
  title: string;
  publishDate: string;
  isPublished: boolean;
  slug: string;
  creationDate: string;
}

type SerializedError = {
  message: string;
};

const Test1: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetMyBlogsQuery(undefined);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [updateBlogMutation] = useUpdateBlogMutation();
  const [deleteBlogMutation] = useDeleteBlogMutation();

  useEffect(() => {
    if (data && data.code === 200 && data.data) {
      const fetchedBlogs: Blog[] = data.data.map((blog: any) => ({
        _id: blog._id,
        title: blog.title,
        publishDate: blog.publishDate || '-',
        isPublished: blog.isPublished,
        slug: blog.slug,
        creationDate: blog.creationDate,
      }));
      setBlogs(fetchedBlogs);
    }
  }, [data]);

  const handleDelete = async (slug: string) => {
    console.log(`Deleting blog with slug: ${slug}`);
    try {
      const response: any = await deleteBlogMutation(slug);

      if (response.error) {
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

      setBlogs(blogs.filter((blog) => blog.slug !== slug));
      toast.success('Blog deleted successfully');
      console.log(`Blog with slug ${slug} deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete blog with slug ${slug}`, error);
      toast.error((error as Error).message);
    }
  };

  const handleTogglePublish = async (slug: string, isPublished: boolean) => {
    const isPub = !isPublished;
    console.log(`Toggling publish status for blog with slug: ${slug}`);
    try {
      const response = await updateBlogMutation({
        slug,
        data: {
          isPublished: isPub,
        },
      });

      if (response.error) {
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

      setBlogs(
        blogs.map((blog) =>
          blog.slug === slug ? { ...blog, isPublished: isPub } : blog
        )
      );

      toast.success(`Blog ${isPub ? 'published' : 'unpublished'} successfully`);

      refetch();
    } catch (error) {
      console.error('Failed to update blog:', error);
      toast.error('Failed to update blog');
    }
  };

  const handleUpdate = (slug: string) => {
    console.log(`Updating blog with slug: ${slug}`);
    router.push(`/blog/myBlog/update/${slug}`);
  };

  const handleDetail = (slug: string) => {
    router.push(`/blog/myBlog/${slug}`);
    console.log(`Navigating to detail page for blog with slug: ${slug}`);
  };

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && error.data && typeof error.data === 'object';
  };

  const isSerializedError = (error: any): error is SerializedError => {
    return error && typeof error === 'object' && 'message' in error;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => refetch()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh
          </button>
          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Add
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add a New Blog</SheetTitle>
                <SheetDescription>
                  Fill in the details below to add a new blog.
                </SheetDescription>
              </SheetHeader>
              <Blogadd />
            </SheetContent>
          </Sheet>
        </div>
        {blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <Table>
            <TableCaption>A list of your blogs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.slug}>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.publishDate}</TableCell>
                  <TableCell>
                    {blog.isPublished ? 'Published' : 'Not Published'}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleUpdate(blog.slug)}
                      className="mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(blog.slug)}
                      className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        handleTogglePublish(blog.slug, blog.isPublished)
                      }
                      className={`bg-${
                        blog.isPublished ? 'red' : 'green'
                      }-500 hover:bg-${
                        blog.isPublished ? 'red' : 'green'
                      }-700 text-white font-bold py-1 px-2 rounded`}
                    >
                      {blog.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDetail(blog.slug)}
                      className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Detail
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default Test1;
