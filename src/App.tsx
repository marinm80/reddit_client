/**
 * Main application component
 *
 * Phase 4: Testing & Quality - Code splitting with React.lazy
 */
import { useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setSubreddit } from '@/features/posts/postsSlice';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import './App.css';

// Lazy load feature components for better performance
const SubredditFilter = lazy(() => import('@/features/subreddits/SubredditFilter').then(m => ({ default: m.SubredditFilter })));
const SearchBar = lazy(() => import('@/features/search/SearchBar').then(m => ({ default: m.SearchBar })));
const PostList = lazy(() => import('@/features/posts/PostList').then(m => ({ default: m.PostList })));

function App() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // Sync URL params with Redux on mount
  useEffect(() => {
    const subredditFromUrl = searchParams.get('subreddit');
    if (subredditFromUrl) {
      dispatch(setSubreddit(subredditFromUrl));
    }
  }, [dispatch, searchParams]);

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Reddit Client
          </h1>
          <p className="text-sm text-text-secondary">
            Phase 3: Subreddit Filters + Search + Infinite Scroll
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar - Lazy loaded with Suspense */}
        <div className="mb-8">
          <Suspense fallback={
            <div className="h-12 bg-surface animate-pulse rounded-md" />
          }>
            <SearchBar />
          </Suspense>
        </div>

        {/* Layout: Sidebar + Posts */}
        <div className="flex gap-6">
          {/* Sidebar - Subreddit Filter - Lazy loaded */}
          <div className="hidden lg:block flex-shrink-0">
            <Suspense fallback={
              <div className="w-64 h-96 bg-surface animate-pulse rounded-lg" />
            }>
              <SubredditFilter />
            </Suspense>
          </div>

          {/* Main Content - Post List - Lazy loaded */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<LoadingSpinner />}>
              <PostList />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-sm text-text-secondary border-t border-border">
        <p>
          Built with{' '}
          <span className="text-primary font-medium">React 18</span> +{' '}
          <span className="text-primary font-medium">Redux Toolkit</span> +{' '}
          <span className="text-primary font-medium">TypeScript</span> +{' '}
          <span className="text-primary font-medium">Tailwind CSS</span>
        </p>
        <p className="mt-2 text-xs">
          🚀 Learning project - Reddit Client
        </p>
      </footer>
    </div>
  );
}

export default App;
