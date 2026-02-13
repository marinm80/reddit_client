# Reddit Client - AI Agent Guidelines

> **Project Overview**: A modern Reddit client built with React 18, Redux Toolkit (RTK Query), TypeScript, and Tailwind CSS. This is a learning project focused on best practices, comprehensive testing, and excellent UX.

**Last Updated**: 2026-02-13
**Tech Stack**: Vite + React 18 + TypeScript 5 + Redux Toolkit 2 + RTK Query + Tailwind CSS 4

---

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Development Commands](#development-commands)
- [Code Style Guidelines](#code-style-guidelines)
- [Tailwind CSS Guidelines](#tailwind-css-guidelines)
- [Redux Patterns](#redux-patterns)
- [Component Patterns](#component-patterns)
- [Testing Guidelines](#testing-guidelines)
- [Performance Best Practices](#performance-best-practices)
- [Pre-Change Checklist](#pre-change-checklist)

---

## 📁 Project Structure

```
reddit-client/
├── src/
│   ├── app/                    # Redux store configuration
│   │   ├── store.ts            # Store setup with RTK Query
│   │   └── hooks.ts            # Typed useAppDispatch/useAppSelector
│   ├── features/               # Feature-based organization
│   │   ├── posts/              # Post-related features
│   │   │   ├── postsSlice.ts   # Local UI state (filters, sort)
│   │   │   ├── postsApi.ts     # RTK Query API endpoints
│   │   │   ├── PostList.tsx    # Container component
│   │   │   ├── PostCard.tsx    # Presentation component
│   │   │   └── __tests__/      # Co-located tests
│   │   ├── search/             # Search functionality
│   │   ├── subreddits/         # Subreddit filtering
│   │   └── comments/           # Comment display
│   ├── components/             # Shared components
│   │   ├── layout/             # Layout components (Header, Footer)
│   │   └── ui/                 # Design system components (Button, Card)
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions (including cn helper)
│   ├── types/                  # TypeScript type definitions
│   └── routes/                 # Route components
├── e2e/                        # Playwright E2E tests
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind configuration
└── [config files]              # vite.config.ts, tsconfig.json, etc.
```

**Organization Principles:**
- **Feature-based**: Group by feature (posts, search, comments), not by type
- **Co-location**: Keep tests and components together
- **Separation of concerns**: Container components handle logic, presentation components handle UI
- **Tailwind CSS**: Utility-first styling with custom configuration

---

## 🛠 Development Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking (no emit)

# Testing
npm run test:unit        # Run unit tests with Vitest
npm run test:e2e         # Run E2E tests with Playwright
npm run test:coverage    # Generate coverage report

# Pre-commit
npm run lint && npm run type-check && npm run test:unit
```

**Development Workflow:**
1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Make changes following these guidelines
3. Run pre-commit checks: lint + type-check + tests
4. Commit with conventional commits: `feat:`, `fix:`, `test:`, `docs:`
5. Push and create pull request

---

## 🎨 Code Style Guidelines

### Import Organization

**Order** (separated by blank lines):
1. React imports
2. Third-party libraries
3. Redux/RTK Query imports
4. Local features
5. Components
6. Hooks
7. Utils/types

```typescript
// ✅ Good
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useGetPostsQuery } from './postsApi';

import PostCard from './PostCard';
import { Skeleton } from '@/components/ui/Skeleton';

import { useDebounce } from '@/hooks/useDebounce';
import { formatScore } from '@/utils/formatters';
import type { RedditPost } from '@/types/reddit';

// ❌ Bad - mixed order, no grouping
import { useState } from 'react';
import PostCard from './PostCard';
import { formatScore } from '@/utils/formatters';
```

### TypeScript Guidelines

**Always use TypeScript strict mode**. No `any` unless absolutely necessary (use `unknown` instead).

```typescript
// ✅ Good - Explicit types
interface PostCardProps {
  post: RedditPost;
  onClick?: (postId: string) => void;
  className?: string;
}

export function PostCard({ post, onClick, className }: PostCardProps) {
  // ...
}

// ✅ Good - Type inference for simple cases
const [count, setCount] = useState(0); // inferred as number
const posts = useGetPostsQuery({ subreddit: 'popular' }); // inferred from RTK Query

// ❌ Bad - Using 'any'
function processData(data: any) {
  return data.value;
}

// ✅ Good - Using 'unknown' with type guard
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value;
  }
  throw new Error('Invalid data structure');
}
```

**Type Definitions:**
- Place shared types in `src/types/`
- Reddit API types → `src/types/reddit.ts`
- App-specific types → `src/types/app.ts`
- Feature-specific types → co-locate with feature

```typescript
// src/types/reddit.ts
export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  thumbnail: string;
  selftext?: string;
  preview?: RedditPreview;
}

export interface RedditListing {
  kind: 'Listing';
  data: {
    after: string | null;
    before: string | null;
    children: Array<{ kind: 't3'; data: RedditPost }>;
  };
}
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `PostCard`, `SearchBar` |
| Hooks | camelCase with `use` prefix | `useDebounce`, `useInfiniteScroll` |
| Utilities | camelCase | `formatScore`, `parseDate` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `DEFAULT_LIMIT` |
| Types/Interfaces | PascalCase | `RedditPost`, `PostListProps` |
| Tailwind Classes | Use `cn()` helper | `cn("bg-blue-500", className)` |

```typescript
// ✅ Good
const API_BASE_URL = 'https://www.reddit.com';
const DEFAULT_POST_LIMIT = 25;

interface PostCardProps {
  post: RedditPost;
}

function useDebounce<T>(value: T, delay: number): T {
  // ...
}

export function PostCard({ post }: PostCardProps) {
  return <div className="rounded-lg bg-surface p-4">{post.title}</div>;
}

// ❌ Bad
const api_url = 'https://www.reddit.com'; // should be UPPER_SNAKE_CASE
interface postCardProps {} // should be PascalCase
function DebounceHook() {} // hooks should start with 'use'
```

### Function Components

**Always use function components** (no class components). Use named exports for components.

```typescript
// ✅ Good - Named export, explicit props type
interface PostCardProps {
  post: RedditPost;
  onClick?: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      className="rounded-lg bg-surface p-4 transition-all hover:bg-surface-hover hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-lg font-semibold text-text">{post.title}</h2>
      <p className="text-sm text-text-secondary">
        by {post.author} • {formatScore(post.score)} points
      </p>
    </article>
  );
}

// ❌ Bad - Default export, inline type
export default ({ post }: { post: RedditPost }) => {
  return <div>{post.title}</div>;
};
```

### Comments

Write **why**, not **what**. Code should be self-documenting for the "what".

```typescript
// ✅ Good - Explains WHY
// RTK Query caches for 60s by default, but Reddit rate limits at 10 req/min
// so we extend cache time to 5 minutes to avoid hitting rate limits
const { data } = useGetPostsQuery(
  { subreddit },
  { pollingInterval: 300000 }
);

// ❌ Bad - States the obvious
// Get posts from the API
const { data } = useGetPostsQuery({ subreddit });

// ✅ Good - Complex logic explanation
// Merge new posts into existing cache for infinite scroll
// We check for duplicates by post ID to avoid rendering the same post twice
merge: (currentCache, newItems, { arg }) => {
  const existingIds = new Set(currentCache.data.children.map(c => c.data.id));
  const uniqueNew = newItems.data.children.filter(
    child => !existingIds.has(child.data.id)
  );
  currentCache.data.children.push(...uniqueNew);
};
```

---

## 🎨 Tailwind CSS Guidelines

### Tailwind Configuration

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#ff4500',          // Reddit Orange
        'primary-hover': '#ff5722',
        background: '#0b1416',       // Dark mode
        surface: '#1a1a1b',
        'surface-hover': '#272729',
        text: '#d7dadc',
        'text-secondary': '#818384',
        border: '#343536',
        success: '#46d160',
        error: '#ea0027',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
        md: '0 4px 6px rgba(0, 0, 0, 0.16)',
        lg: '0 10px 20px rgba(0, 0, 0, 0.24)',
      },
    },
  },
  plugins: [],
};
```

### cn() Utility Helper

**CRITICAL: Always use the `cn()` helper** to merge Tailwind classes conditionally. This prevents class conflicts.

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**
```typescript
import { cn } from '@/utils/cn';

// ✅ Good - Using cn() for conditional classes
<div className={cn(
  'base-class',
  isActive && 'active-class',
  error && 'error-class',
  className
)}>

// ❌ Bad - Manual string concatenation (causes class conflicts)
<div className={`base-class ${isActive ? 'active-class' : ''} ${className}`}>
```

### Tailwind Best Practices

1. **Use semantic color names** from config instead of raw hex values
2. **Use spacing scale** (xs, sm, md, lg, xl) instead of arbitrary values
3. **Prefer composition** over creating complex utility classes
4. **Extract repeated patterns** into reusable components

```typescript
// ✅ Good
<button className="bg-primary text-white px-md py-sm rounded-md hover:bg-primary-hover transition-colors">

// ❌ Bad - Arbitrary values when config exists
<button className="bg-[#ff4500] text-white px-[16px] py-[8px] rounded-[8px]">
```

---

## 🔄 Redux Patterns

### RTK Query API Slice

**Single source of truth for API calls**. All Reddit API interactions go through RTK Query.

```typescript
// src/features/posts/postsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RedditListing, RedditPost } from '@/types/reddit';

export const redditApi = createApi({
  reducerPath: 'redditApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.reddit.com' }),
  tagTypes: ['Posts', 'Comments'],
  endpoints: (builder) => ({
    getPosts: builder.query<RedditListing, GetPostsParams>({
      query: ({ subreddit, after, sort = 'hot' }) =>
        `/r/${subreddit}/${sort}.json?limit=25${after ? `&after=${after}` : ''}`,
      providesTags: ['Posts'],

      // Infinite scroll: merge new posts into existing cache
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs.subreddit}-${queryArgs.sort}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.after) {
          currentCache.data.children.push(...newItems.data.children);
          currentCache.data.after = newItems.data.after;
        } else {
          return newItems;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.after !== previousArg?.after;
      },
    }),

    searchPosts: builder.query<RedditListing, string>({
      query: (searchTerm) =>
        `/search.json?q=${encodeURIComponent(searchTerm)}&limit=25`,
    }),

    getPostDetails: builder.query<PostDetailsResponse, GetPostDetailsParams>({
      query: ({ subreddit, postId }) =>
        `/r/${subreddit}/comments/${postId}.json`,
      transformResponse: (response: [RedditListing, RedditListing]) => ({
        post: response[0].data.children[0].data,
        comments: response[1].data.children,
      }),
      providesTags: ['Comments'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useSearchPostsQuery,
  useGetPostDetailsQuery,
} = redditApi;
```

**RTK Query Best Practices:**
- ✅ Use `providesTags` for cache invalidation
- ✅ Implement `merge` for infinite scroll
- ✅ Use `transformResponse` to reshape API data
- ✅ Export auto-generated hooks (e.g., `useGetPostsQuery`)
- ✅ Handle errors in components, not in API slice
- ❌ Don't create manual thunks when RTK Query can handle it

### Local UI State (Slice)

For state that doesn't come from the API (filters, UI toggles, etc.), use a traditional slice.

```typescript
// src/features/posts/postsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostsState {
  selectedSubreddit: string;
  sortBy: 'hot' | 'top' | 'new';
  timeFilter: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
}

const initialState: PostsState = {
  selectedSubreddit: 'popular',
  sortBy: 'hot',
  timeFilter: 'day',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSubreddit: (state, action: PayloadAction<string>) => {
      state.selectedSubreddit = action.payload;
    },
    setSortBy: (state, action: PayloadAction<PostsState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setTimeFilter: (state, action: PayloadAction<PostsState['timeFilter']>) => {
      state.timeFilter = action.payload;
    },
  },
});

export const { setSubreddit, setSortBy, setTimeFilter } = postsSlice.actions;
export default postsSlice.reducer;
```

### Typed Hooks

**Always use typed hooks** instead of raw `useDispatch`/`useSelector`.

```typescript
// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Usage in components:**
```typescript
// ✅ Good - Typed hooks with auto-complete
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setSubreddit } from './postsSlice';

export function SubredditFilter() {
  const dispatch = useAppDispatch();
  const selectedSubreddit = useAppSelector((state) => state.posts.selectedSubreddit);

  const handleChange = (subreddit: string) => {
    dispatch(setSubreddit(subreddit));
  };

  return <select value={selectedSubreddit} onChange={e => handleChange(e.target.value)} />;
}

// ❌ Bad - Untyped hooks, no auto-complete
import { useDispatch, useSelector } from 'react-redux';

export function SubredditFilter() {
  const dispatch = useDispatch(); // untyped
  const selectedSubreddit = useSelector((state: any) => state.posts.selectedSubreddit); // any!
  // ...
}
```

---

## 🧩 Component Patterns

### Container vs Presentation Components

**Container Components** (logic):
- Fetch data (RTK Query hooks)
- Manage local state
- Handle user interactions
- Pass data to presentation components

**Presentation Components** (UI):
- Receive data via props
- Render UI with Tailwind classes
- Minimal logic (formatting, conditional rendering)
- Reusable across features

```typescript
// ✅ Container Component - PostList.tsx
import { useGetPostsQuery } from './postsApi';
import { useAppSelector } from '@/app/hooks';
import PostCard from './PostCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export function PostList() {
  const selectedSubreddit = useAppSelector((state) => state.posts.selectedSubreddit);
  const sortBy = useAppSelector((state) => state.posts.sortBy);

  const { data, error, isLoading, refetch } = useGetPostsQuery({
    subreddit: selectedSubreddit,
    sort: sortBy,
  });

  if (isLoading) return <Skeleton count={10} />;
  if (error) return <ErrorState message="Error loading posts" onRetry={refetch} />;

  return (
    <div className="space-y-4">
      {data?.data.children.map(({ data: post }) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// ✅ Presentation Component - PostCard.tsx
import type { RedditPost } from '@/types/reddit';
import { formatScore, formatTimestamp } from '@/utils/formatters';

interface PostCardProps {
  post: RedditPost;
  onClick?: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      className="flex gap-3 rounded-lg bg-surface p-4 transition-all hover:bg-surface-hover hover:shadow-md cursor-pointer"
      onClick={onClick}
      data-testid="post-card"
    >
      <div className="flex-shrink-0 w-20 h-20">
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover rounded"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-text line-clamp-2 mb-1">
          {post.title}
        </h2>
        <p className="text-sm text-text-secondary">
          by {post.author} • {formatScore(post.score)} points •{' '}
          {formatTimestamp(post.created_utc)}
        </p>
        <p className="text-xs text-primary mt-1">r/{post.subreddit}</p>
      </div>
    </article>
  );
}
```

### Design System Components

Located in `src/components/ui/`. All components should:
- Use Tailwind utility classes
- Support `className` prop via `cn()` helper
- Include TypeScript prop types
- Have `data-testid` for testing

**Example: Button Component**
```typescript
// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-surface text-text border border-border hover:bg-surface-hover',
  ghost: 'bg-transparent text-text hover:bg-surface-hover',
};

const sizeStyles = {
  sm: 'px-sm py-xs text-sm',
  md: 'px-md py-sm text-base',
  lg: 'px-lg py-md text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium rounded-md border-none cursor-pointer transition-all',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  );
}
```

**Usage:**
```typescript
<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" className="w-full">Full width</Button>
```

### Custom Hooks

Extract reusable logic into custom hooks.

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in component
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data } = useSearchPostsQuery(debouncedSearch, {
    skip: debouncedSearch.length < 3,
  });

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-md py-sm border border-border rounded-md"
    />
  );
}
```

---

## 🧪 Testing Guidelines

### Unit Tests (Vitest + React Testing Library)

**Coverage targets**: 80%+ components, 90%+ hooks/utils

**Test file naming**: `ComponentName.test.tsx` or `functionName.test.ts`

**What to test:**
- ✅ Component renders correctly
- ✅ User interactions (clicks, input changes)
- ✅ Conditional rendering (loading, error, success states)
- ✅ Utility functions with edge cases
- ✅ Custom hooks behavior
- ❌ Don't test implementation details (Tailwind classes, internal state)
- ❌ Don't test third-party libraries

```typescript
// src/features/posts/__tests__/PostCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PostCard } from '../PostCard';
import type { RedditPost } from '@/types/reddit';

const mockPost: RedditPost = {
  id: '1abc',
  title: 'Test Post Title',
  author: 'testuser',
  subreddit: 'reactjs',
  score: 150,
  num_comments: 25,
  created_utc: 1707840000,
  url: 'https://reddit.com/r/reactjs/comments/1abc',
  thumbnail: 'https://example.com/thumb.jpg',
  subreddit_name_prefixed: 'r/reactjs',
  permalink: '/r/reactjs/comments/1abc',
};

describe('PostCard', () => {
  it('renders post title and author', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  it('displays formatted score', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<PostCard post={mockPost} onClick={handleClick} />);

    screen.getByTestId('post-card').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders thumbnail image', () => {
    render(<PostCard post={mockPost} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockPost.thumbnail);
  });
});
```

### E2E Tests (Playwright)

**Test critical user flows** end-to-end.

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads and displays posts', async ({ page }) => {
    await page.goto('/');

    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();

    // Should have multiple posts
    const postCards = page.locator('[data-testid="post-card"]');
    const count = await postCards.count();
    expect(count).toBeGreaterThan(10);
  });

  test('opens post modal on click', async ({ page }) => {
    await page.goto('/');

    // Click first post
    await page.locator('[data-testid="post-card"]').first().click();

    // Modal should appear
    await expect(page.locator('[data-testid="post-modal"]')).toBeVisible();
  });
});
```

---

## ⚡ Performance Best Practices

### Code Splitting

Use **React.lazy** for route-based code splitting.

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoadingPage } from '@/components/ui/LoadingPage';

const Home = lazy(() => import('./routes/Home'));
const PostDetailPage = lazy(() => import('./routes/PostDetailPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/r/:subreddit/comments/:postId',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <PostDetailPage />
      </Suspense>
    ),
  },
]);
```

### Image Optimization

**Always lazy load images** below the fold.

```typescript
// ✅ Good - Lazy loading with native attribute
<img
  src={post.thumbnail}
  alt=""
  loading="lazy"
  decoding="async"
  className="w-20 h-20 object-cover rounded"
/>
```

---

## ✅ Pre-Change Checklist

Before committing code, ensure:

### Code Quality
- [ ] TypeScript strict mode passes (`npm run type-check`)
- [ ] ESLint passes with no warnings (`npm run lint`)
- [ ] No `console.log` statements in production code
- [ ] No `any` types (use `unknown` or proper typing)
- [ ] Imports are organized correctly
- [ ] Using `cn()` helper for conditional Tailwind classes

### Functionality
- [ ] Feature works as expected in dev mode
- [ ] No errors in browser console
- [ ] Tested on mobile viewport (responsive)
- [ ] Loading states display correctly
- [ ] Error states display correctly with retry

### Testing
- [ ] Unit tests pass (`npm run test:unit`)
- [ ] New features have unit tests (80%+ coverage)
- [ ] E2E tests pass for critical flows

### Performance
- [ ] Images use `loading="lazy"`
- [ ] Routes use React.lazy for code splitting
- [ ] No unnecessary re-renders
- [ ] Bundle size is reasonable

### Accessibility
- [ ] Interactive elements have proper ARIA labels
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA

### Git
- [ ] Commit follows conventional commits
- [ ] Branch name is descriptive
- [ ] No sensitive data committed

---

## 🚨 Common Pitfalls to Avoid

### ❌ Don't use `any`
```typescript
// ❌ Bad
function processPost(post: any) {
  return post.title;
}

// ✅ Good
function processPost(post: RedditPost) {
  return post.title;
}
```

### ❌ Don't forget to use cn() helper
```typescript
// ❌ Bad - Manual string concatenation
<div className={`bg-surface ${isActive ? 'bg-primary' : ''} ${className}`}>

// ✅ Good - Using cn() helper
import { cn } from '@/utils/cn';
<div className={cn('bg-surface', isActive && 'bg-primary', className)}>
```

### ❌ Don't test implementation details
```typescript
// ❌ Bad - Testing Tailwind classes
expect(container.firstChild).toHaveClass('bg-surface');

// ✅ Good - Testing behavior
expect(screen.getByRole('article')).toBeInTheDocument();
expect(screen.getByText('Test Post')).toBeVisible();
```

---

## 📚 Additional Resources

**Project Documentation:**
- [README.md](./README.md) - Project overview, quick start guide, and features
- [ROADMAP.md](./ROADMAP.md) - Project phases, milestones, and progress tracking

**Official Documentation:**
- [React 18 Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Vite](https://vitejs.dev)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
- [Tailwind CSS](https://tailwindcss.com)

**Reddit API:**
- [Reddit JSON API](https://data365.co/blog/reddit-json-api)
- [Rate Limits Guide](https://painonsocial.com/blog/reddit-api-rate-limits-guide)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-13 | Initial CLAUDE.md creation |
| 1.1.0 | 2026-02-13 | Updated to use Tailwind CSS 4, converted to English |
| 1.2.0 | 2026-02-13 | Added README.md and ROADMAP.md references |

---

**Last Updated**: 2026-02-13
**Maintainer**: AI Agent (Claude)
**Status**: Active Development
