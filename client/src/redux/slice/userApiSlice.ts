// redux/slice/usersApiSlice.ts
import { apiSlice } from '@/redux/slice/apiSlice';

const USERS_URL = '/api';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/user/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/user/register`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/user/logout`,
        method: 'POST',
      }),
    }),
    update: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/user/update`,
        method: 'POST',
        body: data,
      }),
    }),
    getProfileInfo: builder.query({
      query: () => ({
        url: `${USERS_URL}/user/profile`,
        method: 'GET',
        providesTags: () => ['User'],
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useUpdateMutation,
  useRegisterMutation,
  useGetProfileInfoQuery,
} = usersApiSlice;
