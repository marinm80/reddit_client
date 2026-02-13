// This is a placeholder file to be implemented in Phase 2.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const redditApi = createApi({
  reducerPath: 'redditApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.reddit.com' }),
  tagTypes: ['Posts', 'Comments'],
  endpoints: (builder) => ({
    // getPosts will be implemented in Phase 2
  }),
});
