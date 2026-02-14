import { configureStore } from '@reduxjs/toolkit';
import { redditApi } from '../features/posts/postsApi';
import postsReducer from '../features/posts/postsSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [redditApi.reducerPath]: redditApi.reducer,
    // Local UI state reducer
    posts: postsReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(redditApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
