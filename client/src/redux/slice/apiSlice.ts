import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Temel sorgu yapılandırması
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000', // API sunucunuzun temel URL'si
  credentials: 'include', // Çerezlerin gönderilmesi için gerekli sil ve terkar dene
});

// API dilimini oluşturma
export const apiSlice = createApi({
  reducerPath: 'api', // API dilimi için bir ad
  baseQuery,
  tagTypes: ['User'],
  endpoints: () => ({}),
});

// export const { useSomeQuery, useSomeMutation } = apiSlice;
