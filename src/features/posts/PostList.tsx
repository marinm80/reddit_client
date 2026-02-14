/**
 * PostList Component
 *
 * Container component that:
 * - Fetches posts using RTK Query
 * - Manages loading and error states
 * - Renders a list of PostCard components
 *
 * This is a CONTAINER component:
 * - Fetches data (RTK Query hooks)
 * - Manages state (Redux selectors)
 * - Handles user interactions
 * - Passes data to presentation components
 */
import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useGetPostsQuery } from './postsApi';
import { PostCard } from './PostCard';
import { PostDetail } from './PostDetail';
import type { RedditPost } from '@/types/reddit';

export function PostList() {
  // Get selected subreddit and sort from Redux
  const selectedSubreddit = useAppSelector((state) => state.posts.selectedSubreddit);
  const sortBy = useAppSelector((state) => state.posts.sortBy);

  // Modal state
  const [selectedPost, setSelectedPost] = useState<RedditPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open post detail modal
  const handlePostClick = (post: RedditPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Wait for animation before clearing selected post
    setTimeout(() => setSelectedPost(null), 200);
  };

  // Fetch posts using RTK Query
  const { data, error, isLoading, isFetching, refetch } = useGetPostsQuery({
    subreddit: selectedSubreddit,
    sort: sortBy,
  });

  // Loading state (first load)
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-surface rounded-lg animate-pulse"
            data-testid="skeleton"
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="bg-surface border border-error rounded-lg p-8 text-center"
        data-testid="error-state"
      >
        <p className="text-error text-lg font-semibold mb-2">
          Error loading posts
        </p>
        <p className="text-text-secondary mb-4">
          {('status' in error && typeof error.status === 'number')
            ? `Error ${error.status}: Failed to fetch posts`
            : 'Something went wrong. Please try again.'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // No data
  if (!data || data.data.children.length === 0) {
    return (
      <div
        className="bg-surface rounded-lg p-8 text-center"
        data-testid="empty-state"
      >
        <p className="text-text-secondary text-lg">
          No posts found in r/{selectedSubreddit}
        </p>
      </div>
    );
  }

  // Success - render posts
  return (
    <>
      <div className="space-y-4">
        {/* Refetch indicator */}
        {isFetching && !isLoading && (
          <div className="bg-primary text-white px-4 py-2 rounded-md text-sm text-center">
            Refreshing posts...
          </div>
        )}

        {/* Posts list */}
        {data.data.children.map(({ data: post }) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => handlePostClick(post)}
          />
        ))}

        {/* Posts count */}
        <div className="text-center text-sm text-text-secondary pt-4">
          Showing {data.data.children.length} posts from r/{selectedSubreddit}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
