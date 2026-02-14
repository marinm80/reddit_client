/**
 * PostCard Component
 *
 * Presentation component that displays a single Reddit post.
 * Receives data via props and renders UI with Tailwind classes.
 *
 * This is a PRESENTATION component:
 * - No data fetching
 * - No business logic
 * - Just rendering based on props
 */
import type { RedditPost } from '@/types/reddit';
import { formatScore, formatTimestamp } from '@/utils/formatters';

interface PostCardProps {
  post: RedditPost;
  onClick?: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  // Determine if we should show a thumbnail
  const hasValidThumbnail =
    post.thumbnail &&
    post.thumbnail !== 'self' &&
    post.thumbnail !== 'default' &&
    post.thumbnail !== 'nsfw' &&
    post.thumbnail !== 'spoiler' &&
    post.thumbnail !== 'image' &&
    post.thumbnail.startsWith('http');

  return (
    <article
      className="flex gap-3 rounded-lg bg-surface p-4 transition-all hover:bg-surface-hover hover:shadow-md cursor-pointer border border-border"
      onClick={onClick}
      data-testid="post-card"
    >
      {/* Thumbnail or Placeholder */}
      <div className="flex-shrink-0 w-20 h-20 bg-background rounded border border-border flex items-center justify-center overflow-hidden">
        {hasValidThumbnail ? (
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span className="text-2xl text-text-secondary" aria-hidden="true">
            {post.is_self ? '📝' : '🔗'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h2 className="text-lg font-semibold text-text line-clamp-2 mb-1 hover:text-primary transition-colors">
          {post.title}
        </h2>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary mb-2">
          <span className="font-medium text-primary">
            r/{post.subreddit}
          </span>
          <span aria-hidden="true">•</span>
          <span>by {post.author}</span>
          <span aria-hidden="true">•</span>
          <span>{formatTimestamp(post.created_utc)}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <span aria-hidden="true">⬆</span>
            <span className="font-medium">{formatScore(post.score)}</span>
            <span className="sr-only">upvotes</span>
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">💬</span>
            <span className="font-medium">{post.num_comments}</span>
            <span className="sr-only">comments</span>
          </span>
        </div>
      </div>
    </article>
  );
}
