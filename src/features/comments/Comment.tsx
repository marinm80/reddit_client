/**
 * Comment Component - Recursive
 *
 * Displays a single comment with its nested replies.
 * Uses recursion to render the entire comment tree.
 *
 * KEY CONCEPT - Recursion:
 * This component calls itself to render nested comments,
 * creating a tree structure of unlimited depth.
 */
import type { RedditComment, RedditListing, CommentChild } from '@/types/reddit';
import { isCommentChild } from '@/types/reddit';
import { formatScore, formatTimestamp } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface CommentProps {
  comment: RedditComment;
  depth?: number;
}

export function Comment({ comment, depth = 0 }: CommentProps) {
  // Parse replies if they exist
  const hasReplies = typeof comment.replies === 'object' && comment.replies !== null;
  const replies: CommentChild[] = hasReplies
    ? ((comment.replies as RedditListing<RedditComment>).data?.children as CommentChild[]) || []
    : [];

  // Color for depth indicator (cycles through colors)
  const depthColors = [
    'border-primary',
    'border-blue-500',
    'border-green-500',
    'border-yellow-500',
    'border-purple-500',
    'border-pink-500',
  ];
  const borderColor = depthColors[depth % depthColors.length];

  return (
    <div className={cn('comment-thread', depth > 0 && 'mt-3')}>
      {/* Comment Container */}
      <div
        className={cn(
          'relative pl-3 py-2',
          depth > 0 && `ml-4 border-l-2 ${borderColor}`
        )}
        data-testid="comment"
      >
        {/* Comment Header */}
        <div className="flex items-center gap-2 mb-1 text-xs">
          <span
            className={cn(
              'font-semibold',
              comment.is_submitter ? 'text-primary' : 'text-text'
            )}
          >
            {comment.author}
            {comment.is_submitter && (
              <span className="ml-1 text-xs bg-primary text-white px-1 rounded">
                OP
              </span>
            )}
          </span>
          <span className="text-text-secondary">•</span>
          <span className="text-text-secondary">
            {formatScore(comment.score)} points
          </span>
          <span className="text-text-secondary">•</span>
          <span className="text-text-secondary">
            {formatTimestamp(comment.created_utc)}
          </span>
          {comment.stickied && (
            <>
              <span className="text-text-secondary">•</span>
              <span className="text-success text-xs">📌 Pinned</span>
            </>
          )}
        </div>

        {/* Comment Body */}
        <div className="text-sm text-text leading-relaxed whitespace-pre-wrap break-words">
          {comment.body}
        </div>
      </div>

      {/* Nested Replies (Recursive) */}
      {hasReplies && (
        <div className="comment-replies">
          {replies.map((reply: CommentChild) => {
            // Check if this is a "more" placeholder using type guard
            if (!isCommentChild(reply)) {
              return (
                <div
                  key={reply.data.id}
                  className="ml-4 mt-2 text-xs text-primary cursor-pointer hover:underline"
                >
                  Load {reply.data.count || 0} more replies...
                </div>
              );
            }

            // Recursively render nested comments
            return (
              <Comment
                key={reply.data.id}
                comment={reply.data}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
