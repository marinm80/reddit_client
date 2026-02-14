/**
 * Posts Slice - Local UI State
 *
 * This slice manages LOCAL state that is NOT from the API:
 * - Selected subreddit (which subreddit is being viewed)
 * - Sort method (hot, top, new, rising)
 * - Time filter (for "top" sort: hour, day, week, month, year, all)
 *
 * API data (posts) is handled by RTK Query in postsApi.ts
 *
 * CONCEPT - Why separate slices?
 * - postsApi.ts = Server state (API responses, caching)
 * - postsSlice.ts = Client state (UI preferences, filters)
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * Type for sort options
 */
export type SortBy = 'hot' | 'top' | 'new' | 'rising';

/**
 * Type for time filter (used with "top" sort)
 */
export type TimeFilter = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';

/**
 * State shape for posts feature
 */
interface PostsState {
  selectedSubreddit: string;
  sortBy: SortBy;
  timeFilter: TimeFilter;
}

/**
 * Initial state
 */
const initialState: PostsState = {
  selectedSubreddit: 'popular', // Default subreddit
  sortBy: 'hot',               // Default sort
  timeFilter: 'day',           // Default time filter
};

/**
 * Posts slice
 *
 * CONCEPT - createSlice:
 * createSlice is a Redux Toolkit helper that automatically:
 * - Creates action creators
 * - Creates reducers
 * - Uses Immer for immutable updates (you can "mutate" state directly)
 */
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    /**
     * Sets the selected subreddit
     * Usage: dispatch(setSubreddit('reactjs'))
     */
    setSubreddit: (state, action: PayloadAction<string>) => {
      state.selectedSubreddit = action.payload;
    },

    /**
     * Sets the sort method
     * Usage: dispatch(setSortBy('top'))
     */
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
    },

    /**
     * Sets the time filter
     * Usage: dispatch(setTimeFilter('week'))
     */
    setTimeFilter: (state, action: PayloadAction<TimeFilter>) => {
      state.timeFilter = action.payload;
    },
  },
});

// Export actions
export const { setSubreddit, setSortBy, setTimeFilter } = postsSlice.actions;

// Export reducer (to be added to the store)
export default postsSlice.reducer;
