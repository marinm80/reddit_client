/**
 * RTK Query API Slice for Reddit API
 *
 * This file defines all endpoints to interact with the Reddit API.
 * RTK Query automatically handles:
 * - Caching (store responses in memory)
 * - Loading states (isLoading, isFetching)
 * - Error handling
 * - Re-fetching when necessary
 * - Cache invalidation
 *
 * Documentation: https://redux-toolkit.js.org/rtk-query/overview
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RedditListing, GetPostsParams } from '@/types/reddit';

/**
 * Main API for Reddit
 *
 * KEY CONCEPT - createApi:
 * createApi is the main function of RTK Query. It automatically generates:
 * - React Hooks (useGetPostsQuery, useSearchPostsQuery)
 * - Reducers for the Redux store
 * - Actions to invalidate cache
 */
export const redditApi = createApi({
  // Reducer name in the store
  // In store.ts it will be registered as: state.redditApi
  reducerPath: 'redditApi',

  // Base configuration for all requests
  // All routes are concatenated to this baseUrl
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.reddit.com',
    // Note: Reddit API doesn't require auth for public reading
    // prepareHeaders would be used here to add tokens
  }),

  // Tags for cache invalidation
  // When we mark data as "stale", RTK Query automatically refetches them
  tagTypes: ['Posts', 'Comments'],

  // Endpoints definition (operations)
  endpoints: (builder) => ({
    /**
     * Gets posts from a subreddit
     *
     * Endpoint: GET /r/{subreddit}/{sort}.json
     * Example: /r/popular/hot.json?limit=25
     *
     * CONCEPT - builder.query:
     * - builder.query = READ operations (GET)
     * - builder.mutation = WRITE operations (POST/PUT/DELETE)
     */
    getPosts: builder.query<RedditListing, GetPostsParams>({
      // Function that builds the request URL
      // Parameters come from the hook: useGetPostsQuery({ subreddit: 'reactjs' })
      query: ({ subreddit, sort = 'hot', limit = 25, after }) => {
        // Build query params manually
        const params = new URLSearchParams({
          limit: limit.toString(),
        });

        // Only add 'after' if it exists (for pagination)
        if (after) {
          params.append('after', after);
        }

        // Return the complete URL
        // Concatenated with baseUrl: https://www.reddit.com + /r/reactjs/hot.json
        return `/r/${subreddit}/${sort}.json?${params.toString()}`;
      },

      // Mark this query as provider of the 'Posts' tag
      // If something invalidates 'Posts', this query is automatically refetched
      providesTags: ['Posts'],

      // IMPORTANT: Configuration for infinite scroll (we'll use it later)
      // For now these don't do anything, but are needed for Phase 2
      // transformResponse: (response: RedditListing) => response,
    }),

    /**
     * Searches posts across all Reddit by search term
     *
     * Endpoint: GET /search.json?q={searchTerm}
     * Example: /search.json?q=react&limit=25
     *
     * CONCEPT - Global Search:
     * This endpoint searches in ALL subreddits, not just one.
     * Reddit also allows search in a specific subreddit with:
     * /r/{subreddit}/search.json?q={term}
     */
    searchPosts: builder.query<RedditListing, string>({
      // The parameter is just a string (the search term)
      // Usage: useSearchPostsQuery('react hooks')
      query: (searchTerm) => {
        // encodeURIComponent is crucial for URLs
        // Converts spaces and special characters to URL-safe format
        // "react hooks" → "react%20hooks"
        const params = new URLSearchParams({
          q: encodeURIComponent(searchTerm),
          limit: '25',
          // sort: 'relevance', // Reddit uses relevance by default
        });

        return `/search.json?${params.toString()}`;
      },

      // Doesn't provide tags because search is dynamic
      // We don't want to invalidate search results when new posts are added
      // providesTags: [], // could be ['SearchResults'] if we wanted invalidation
    }),
  }),
});

/**
 * Auto-generated hooks by RTK Query
 *
 * KEY CONCEPT - Auto-generated Hooks:
 * RTK Query automatically creates hooks based on the endpoint name:
 * - getPosts → useGetPostsQuery
 * - searchPosts → useSearchPostsQuery
 *
 * These hooks return:
 * - data: The response data (RedditListing)
 * - error: Error object if it fails
 * - isLoading: true on first load
 * - isFetching: true on any fetch (including refetch)
 * - refetch: Function to manually refetch
 */
export const {
  useGetPostsQuery,
  useSearchPostsQuery,
} = redditApi;
