/**
 * CommentList Component
 *
 * Container component that displays a list of top-level comments.
 * Each comment is rendered with the Comment component which handles nesting.
 */
import type { RedditListing } from '@/types/reddit';
import { Comment } from './Comment';

interface CommentListProps {
  commentsListing: RedditListing;
}

export function CommentList({ commentsListing }: CommentListProps) {
  const comments = commentsListing.data.children as any[];

  // Filter out non-comment items (like "more" at top level)
  const topLevelComments = comments.filter(
    (item: any) => item.kind === 't1'
  );

  if (topLevelComments.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topLevelComments.map((commentThing: any) => (
        <Comment key={commentThing.data.id} comment={commentThing.data} />
      ))}
    </div>
  );
}
