import { apiSlice } from './apiSlice';

const USERS_URL = '/api';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
}

interface GetBlogsResponse {
  data: Blog[];
  meta: {
    totalPages: number;
    currentPage: number;
    totalCount: number;
  };
}

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyBlogs: builder.query<any, void>({
      query: () => ({
        url: `${USERS_URL}/blog/list`,
        method: 'GET',
      }),
    }),
    getAllCategories: builder.query<any, void>({
      query: () => ({
        url: `${USERS_URL}/blog/categoryList`,
        method: 'GET',
      }),
    }),
    getAllBlogs: builder.query<
      GetBlogsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `${USERS_URL}/blog/globalList`,
        method: 'GET',
        params: { page, limit },
      }),
    }),
    getAllBlogsByCategory: builder.query<
      GetBlogsResponse,
      {
        categoryId?: string;
        categoryName?: string;
        page: number;
        limit: number;
      }
    >({
      query: ({ categoryId, categoryName, page, limit }) => ({
        url: `${USERS_URL}/blog/globalListByCategory`,
        method: 'GET',
        params: { categoryId, categoryName, page, limit },
      }),
    }),
    updateBlog: builder.mutation<any, { slug: string; data: any }>({
      query: ({ slug, data }) => ({
        url: `${USERS_URL}/blog/update/${slug}`,
        method: 'POST',
        body: data,
      }),
    }),
    addBlog: builder.mutation<any, any>({
      query: (data) => ({
        url: `${USERS_URL}/blog/add`,
        method: 'POST',
        body: data,
      }),
    }),
    detailBlog: builder.query<any, string>({
      query: (slug) => ({
        url: `${USERS_URL}/blog/detail/${slug}`,
        method: 'GET',
      }),
    }),
    deleteBlog: builder.mutation<any, string>({
      query: (slug) => ({
        url: `${USERS_URL}/blog/delete/${slug}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMyBlogsQuery,
  useUpdateBlogMutation,
  useDetailBlogQuery,
  useDeleteBlogMutation,
  useAddBlogMutation,
  useGetAllBlogsQuery,
  useGetAllBlogsByCategoryQuery,
  useGetAllCategoriesQuery,
} = blogApiSlice;
