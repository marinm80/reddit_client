/**
 * SearchBar Component - Post search with debouncing
 *
 * This component demonstrates several key concepts:
 * 1. Custom hooks (useDebounce)
 * 2. RTK Query with dynamic parameters
 * 3. Conditional queries (skip)
 * 4. Controlled inputs in React
 * 5. Loading and error states
 */
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchPostsQuery } from '@/features/posts/postsApi';
import { cn } from '@/utils/cn';

export function SearchBar() {
  // Local state for the input
  // Changes with EVERY key the user presses
  const [searchTerm, setSearchTerm] = useState('');

  // Debouncing hook: waits 500ms after the last change
  // This is the value we use for the API call
  // ANALOGY: The "traffic officer" that waits for no more cars to pass
  const debouncedSearch = useDebounce(searchTerm, 500);

  // RTK Query hook with conditional configuration
  // KEY CONCEPT - skip:
  // If skip is true, the query is NOT executed
  // This avoids making unnecessary calls when there are < 3 characters
  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useSearchPostsQuery(debouncedSearch, {
    // Only execute the query if:
    // 1. debouncedSearch has at least 3 characters
    // This avoids searching with "r" or "re" (too generic)
    skip: debouncedSearch.length < 3,
  });

  // Function to clear the search
  const handleClear = () => {
    setSearchTerm('');
  };

  /**
   * COMPONENT STATE:
   *
   * 1. User types "r" → searchTerm = "r", debouncedSearch = "" (still)
   * 2. User types "re" → searchTerm = "re", debouncedSearch = "" (waiting)
   * 3. User types "rea" → searchTerm = "rea", debouncedSearch = "" (waiting)
   * 4. User stops typing → after 500ms → debouncedSearch = "rea"
   * 5. debouncedSearch.length >= 3 → skip = false → API call ✅
   * 6. Response arrives → data is filled with results
   */

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Field */}
        {/* CONCEPT - Controlled Input:
            The input value is controlled by React state (searchTerm)
            Each change triggers setSearchTerm, which re-renders the component
        */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Reddit... (min. 3 characters)"
          className={cn(
            'w-full pl-10 pr-10 py-3 rounded-lg',
            'bg-surface text-text',
            'border border-border',
            'focus:outline-none focus:border-primary',
            'transition-colors'
          )}
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {/* Show spinner only when fetching AND there's text */}
          {isFetching && searchTerm.length >= 3 ? (
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          ) : searchTerm.length > 0 ? (
            // Clear button only if there's text
            <button
              onClick={handleClear}
              className="text-text-secondary hover:text-text transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Helper Text */}
      {searchTerm.length > 0 && searchTerm.length < 3 && (
        <p className="mt-2 text-sm text-text-secondary">
          Type at least 3 characters to search
        </p>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">
            Error searching. Please try again.
          </p>
        </div>
      )}

      {/* Results Count */}
      {data && !isFetching && (
        <p className="mt-2 text-sm text-text-secondary">
          {data.data.children.length} results found
        </p>
      )}

      {/* Results List - For now we only show titles */}
      {/* In the next phase we will create PostCard to show this better */}
      {data && data.data.children.length > 0 && (
        <div className="mt-4 space-y-2">
          {data.data.children.map(({ data: post }) => (
            <div
              key={post.id}
              className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors"
            >
              <h3 className="font-semibold text-text line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                r/{post.subreddit} • by {post.author} • {post.score} points
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {data && data.data.children.length === 0 && !isFetching && (
        <div className="mt-8 text-center">
          <p className="text-text-secondary">
            No results found for "{debouncedSearch}"
          </p>
        </div>
      )}
    </div>
  );
}
