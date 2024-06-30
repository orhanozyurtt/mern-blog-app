import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Temel sorgu yapılandırması
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.BASE_URL, // 'http://localhost:5000' API sunucunuzun temel URL'si
  credentials: 'include', // Çerezlerin gönderilmesi için gerekli sil ve terkar dene
});

// API dilimini oluşturma
export const apiSlice = createApi({
  reducerPath: 'api', // API dilimi için bir ad
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ['User'],
});

// export const { useSomeQuery, useSomeMutation } = apiSlice;
