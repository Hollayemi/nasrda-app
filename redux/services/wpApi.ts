import { createApi } from '@reduxjs/toolkit/query/react';
import { wpAxiosBaseQuery } from '../shared/wpAxiosBaseQuery';
import {
  GetPostsResponse,
  GetSinglePostResponse,
} from '../wp';

export const wpApi = createApi({
  reducerPath: 'wpApi',
  baseQuery: wpAxiosBaseQuery(),
  tagTypes: ['Posts'],

  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, void>({
      query: () => ({
        url: '/posts',
        method: 'GET',
        params: {
          _embed: true,
          per_page: 20,
        },
      }),
      providesTags: ['Posts'],
    }),

    getSinglePost: builder.query<any, any>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'GET',
        params: {
          _embed: true,
        },
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Posts', id },
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetSinglePostQuery,
} = wpApi;