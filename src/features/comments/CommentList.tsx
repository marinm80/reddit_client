/**
 * CommentList Component
 *
 * Container component that displays a list of top-level comments.
 * Each comment is rendered with the Comment component which handles nesting.
 */
import type { RedditListing, RedditComment, CommentChild } from '@/types/reddit';
import { isCommentChild } from '@/types/reddit';
import { Comment } from './Comment';

interface CommentListProps {
  commentsListing: RedditListing<RedditComment>;
}

export function CommentList({ commentsListing }: CommentListProps) {
  const comments = commentsListing.data.children as CommentChild[];

  // Filter out non-comment items (like "more" at top level) using type guard
  const topLevelComments = comments.filter(isCommentChild);

  if (topLevelComments.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topLevelComments.map((commentThing) => (
        <Comment key={commentThing.data.id} comment={commentThing.data} />
      ))}
    </div>
  );
}
