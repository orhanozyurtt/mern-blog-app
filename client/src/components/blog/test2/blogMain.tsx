'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importing Next.js router for usage
import {
  useGetAllCategoriesQuery,
  useGetAllBlogsQuery,
  useGetAllBlogsByCategoryQuery,
} from '@/redux/slice/blogApiSlice';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ICategory {
  _id: string;
  name: string;
}
interface IBlog {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  tags: string[];
  category: string;
  publishDate: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  creationDate: string;
}

interface BlogApiResponse {
  code: {
    totalPages: number;
    currentPage: number;
    totalCount: number;
  };
  data: IBlog[];
  message: string;
}

const BlogMain = () => {
  const router = useRouter(); // Getting router object using useRouter hook
  const [page, setPage] = useState(1);
  const [limit] = useState(3); // Number of blogs per page
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery();
  const {
    data: blogsData,
    isLoading: blogsLoading,
    refetch: refetchBlogs,
  } = useGetAllBlogsQuery({ page, limit });
  const {
    data: categoryBlogsData,
    isLoading: categoryBlogsLoading,
    refetch: refetchCategoryBlogs,
  } = useGetAllBlogsByCategoryQuery(
    { categoryId: selectedCategory, page, limit },
    { skip: !selectedCategory }
  );

  useEffect(() => {
    if (selectedCategory) {
      refetchCategoryBlogs();
    } else {
      refetchBlogs();
    }
  }, [selectedCategory, page]);

  if (
    categoriesLoading ||
    blogsLoading ||
    (selectedCategory && categoryBlogsLoading)
  ) {
    return <div>Loading...</div>;
  }

  const blogs: IBlog[] = selectedCategory
    ? (categoryBlogsData as unknown as BlogApiResponse)?.data ?? []
    : (blogsData as unknown as BlogApiResponse)?.data ?? [];
  const totalPages = selectedCategory
    ? (categoryBlogsData as unknown as BlogApiResponse)?.code?.totalPages ?? 1
    : (blogsData as unknown as BlogApiResponse)?.code?.totalPages ?? 1;

  const truncateContent = (content: string, length: number) => {
    if (content.length > length) {
      return content.substring(0, length) + '...';
    }
    return content;
  };

  const handleReadMore = (slug: string) => {
    router.push(`/blog/myBlog/${slug}`); // Redirecting to detail page
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <select
          onChange={(e) => {
            setSelectedCategory(e.target.value === 'all' ? '' : e.target.value);
            setPage(1); // Reset page when category changes
          }}
          value={selectedCategory || 'all'}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="all">All Blogs</option>
          {categoriesData?.data.map((category: ICategory) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-3/4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Card key={blog._id} className="mb-4">
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
                <CardDescription>{blog.authorName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{truncateContent(blog.content, 100)}</p>
                {blog.content.length > 100 && (
                  <button
                    className="mt-2 text-blue-500 hover:underline"
                    onClick={() => handleReadMore(blog.slug)} // Calling handleReadMore function when Read More button is clicked
                  >
                    Read More
                  </button>
                )}
              </CardContent>
              <CardFooter>
                <p>{blog.publishDate}</p>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Pagination className="mt-4">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setPage(page - 1)}
                />
              </PaginationItem>
            )}
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => setPage(index + 1)}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {page < totalPages && (
              <PaginationItem>
                <PaginationNext href="#" onClick={() => setPage(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default BlogMain;
