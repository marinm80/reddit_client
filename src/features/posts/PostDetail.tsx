/**
 * PostDetail Component
 *
 * Modal that displays a full post with its comments.
 * Fetches post + comments from Reddit API and renders them.
 */
import { useEffect } from 'react';
import { useGetPostCommentsQuery } from './postsApi';
import { CommentList } from '../comments/CommentList';
import { formatScore, formatTimestamp } from '@/utils/formatters';
import type { RedditPost } from '@/types/reddit';

interface PostDetailProps {
  post: RedditPost;
  isOpen: boolean;
  onClose: () => void;
}

export function PostDetail({ post, isOpen, onClose }: PostDetailProps) {
  // Fetch comments for this post
  const { data, error, isLoading } = useGetPostCommentsQuery(
    {
      subreddit: post.subreddit,
      postId: post.id,
    },
    {
      // Only fetch when modal is open
      skip: !isOpen,
    }
  );

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extract comments from response
  const commentsListing = data?.[1];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-40"
        onClick={onClose}
        data-testid="modal-backdrop"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-start justify-center pt-20 pb-20">
          <div
            className="relative bg-background border border-border rounded-lg shadow-lg w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="post-detail-modal"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-secondary hover:text-text transition-colors z-10"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Post Header */}
              <div className="mb-6 pr-8">
                <h1 className="text-2xl font-bold text-text mb-3">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                  <span className="font-medium text-primary">
                    r/{post.subreddit}
                  </span>
                  <span aria-hidden="true">•</span>
                  <span>by {post.author}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatScore(post.score)} points</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatTimestamp(post.created_utc)}</span>
                  <span aria-hidden="true">•</span>
                  <span>{post.num_comments} comments</span>
                </div>
              </div>

              {/* Post Content */}
              {post.selftext && (
                <div className="mb-6 p-4 bg-surface rounded-lg border border-border">
                  <p className="text-text whitespace-pre-wrap">{post.selftext}</p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border my-6" />

              {/* Comments Section */}
              <div>
                <h2 className="text-lg font-semibold text-text mb-4">
                  💬 {post.num_comments} Comments
                </h2>

                {/* Loading State */}
                {isLoading && (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 bg-surface rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-surface border border-error rounded-lg p-4 text-center">
                    <p className="text-error">Failed to load comments</p>
                  </div>
                )}

                {/* Comments List */}
                {commentsListing && !isLoading && !error && (
                  <CommentList commentsListing={commentsListing} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
