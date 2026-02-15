/**
 * Test Utilities
 *
 * Custom render function and helpers for testing React components
 * with Redux and React Router.
 */
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { redditApi } from '@/features/posts/postsApi';
import postsReducer from '@/features/posts/postsSlice';
import type { RootState } from '@/app/store';

/**
 * Create a test store with optional preloaded state
 */
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      [redditApi.reducerPath]: redditApi.reducer,
      posts: postsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(redditApi.middleware),
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof setupStore>;

/**
 * Custom render options with store and router
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

/**
 * Custom render function that wraps components with Provider and Router
 *
 * Usage:
 * ```tsx
 * const { getByText } = renderWithProviders(<MyComponent />);
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 * Re-export everything from React Testing Library
 */
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
