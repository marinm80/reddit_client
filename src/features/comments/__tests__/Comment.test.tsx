/**
 * Tests for Comment Component
 *
 * Tests the recursive comment rendering with nested replies,
 * OP badges, pinned comments, and depth-based styling.
 */
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { Comment } from '../Comment';
import {
  mockComment,
  mockCommentWithReplies,
  mockOPComment,
  mockPinnedComment,
} from '@/test/mocks';
import type { RedditComment, RedditListing } from '@/types/reddit';

describe('Comment', () => {
  describe('Basic Rendering', () => {
    it('renders comment body', () => {
      renderWithProviders(<Comment comment={mockComment} />);
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    it('renders author name', () => {
      renderWithProviders(<Comment comment={mockComment} />);
      expect(screen.getByText(/commenter/i)).toBeInTheDocument();
    });

    it('renders score with formatted value', () => {
      renderWithProviders(<Comment comment={mockComment} />);
      expect(screen.getByText(/50 points/i)).toBeInTheDocument();
    });

    it('renders timestamp', () => {
      renderWithProviders(<Comment comment={mockComment} />);
      // formatTimestamp should show relative time
      expect(screen.getByText(/ago/i)).toBeInTheDocument();
    });

    it('has correct test-id', () => {
      renderWithProviders(<Comment comment={mockComment} />);
      expect(screen.getByTestId('comment')).toBeInTheDocument();
    });
  });

  describe('OP Badge', () => {
    it('shows OP badge when is_submitter is true', () => {
      renderWithProviders(<Comment comment={mockOPComment} />);
      expect(screen.getByText('OP')).toBeInTheDocument();
    });

    it('does not show OP badge for regular comments', () => {
      renderWithProviders(<Comment comment={mockComment} />);
      expect(screen.queryByText('OP')).not.toBeInTheDocument();
    });

    it('applies text-primary class to OP author', () => {
      renderWithProviders(<Comment comment={mockOPComment} />);
      const authorElement = screen.getByText(/testuser/i).closest('span');
      expect(authorElement).toHaveClass('text-primary');
    });

    it('applies text-text class to non-OP author', () => {
      renderWithProviders(<Comment comment={mockComment} />);
      const authorElement = screen.getByText(/commenter/i).closest('span');
      expect(authorElement).toHaveClass('text-text');
    });
  });

  describe('Pinned Comments', () => {
    it('shows pinned indicator for stickied comments', () => {
      renderWithProviders(<Comment comment={mockPinnedComment} />);
      expect(screen.getByText(/📌 Pinned/i)).toBeInTheDocument();
    });

    it('does not show pinned indicator for regular comments', () => {
      renderWithProviders(<Comment comment={mockComment} />);
      expect(screen.queryByText(/📌 Pinned/i)).not.toBeInTheDocument();
    });
  });

  describe('Depth-Based Styling', () => {
    it('applies correct border color for depth 0', () => {
      renderWithProviders(<Comment comment={mockComment} depth={0} />);
      const commentDiv = screen.getByTestId('comment');
      // Depth 0 has no border (top-level comments)
      expect(commentDiv).not.toHaveClass('border-l-2');
      expect(commentDiv).not.toHaveClass('ml-4');
    });

    it('applies correct border color for depth 1', () => {
      renderWithProviders(<Comment comment={mockComment} depth={1} />);
      const commentDiv = screen.getByTestId('comment');

      // depth > 0 should have ml-4 and border-l-2
      expect(commentDiv.className).toMatch(/ml-4/);
      expect(commentDiv.className).toMatch(/border-l-2/);
      expect(commentDiv.className).toMatch(/border-blue-500/); // depth 1 color
    });

    it('applies correct border color for depth 2', () => {
      renderWithProviders(<Comment comment={mockComment} depth={2} />);
      const commentDiv = screen.getByTestId('comment');

      // depth > 0 should have border-l-2
      expect(commentDiv.className).toMatch(/border-l-2/);
      expect(commentDiv.className).toMatch(/border-green-500/); // depth 2 color
    });

    it('cycles border colors after 6 depth levels', () => {
      // depth 0 -> border-primary (index 0)
      // depth 6 -> border-primary again (6 % 6 = 0)
      // Both should use the same color in the cycle
      renderWithProviders(<Comment comment={mockComment} depth={6} />);
      const commentDiv = screen.getByTestId('comment');
      // depth 6 % 6 = 0, so should use border-primary (same as depth 0)
      expect(commentDiv.className).toMatch(/border-primary/);
    });
  });

  describe('Nested Replies', () => {
    it('renders nested comments recursively', () => {
      renderWithProviders(<Comment comment={mockCommentWithReplies} />);

      // Original comment
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();

      // Nested reply
      expect(screen.getByText('This is a nested reply')).toBeInTheDocument();
    });

    it('increments depth for child comments', () => {
      renderWithProviders(<Comment comment={mockCommentWithReplies} depth={0} />);

      // Both comments should be visible
      const comments = screen.getAllByTestId('comment');
      expect(comments.length).toBeGreaterThanOrEqual(2);
    });

    it('handles empty replies string', () => {
      const commentNoReplies: RedditComment = { ...mockComment, replies: '' };
      renderWithProviders(<Comment comment={commentNoReplies} />);

      // Only the main comment, no nested ones
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getAllByTestId('comment')).toHaveLength(1);
    });

    it('handles comments with "more" placeholder', () => {
      const commentWithMore: RedditComment = {
        ...mockComment,
        replies: {
          kind: 'Listing',
          data: {
            after: null,
            before: null,
            children: [
              {
                kind: 'more',
                data: {
                  count: 5,
                  children: ['id1', 'id2'],
                  id: 'more123',
                  name: 't1_more123',
                  parent_id: 't1_comment123',
                },
              },
            ],
          },
        } as RedditListing<RedditComment>,
      };

      renderWithProviders(<Comment comment={commentWithMore} />);

      // Should show "Load more" message
      expect(screen.getByText(/Load 5 more replies/i)).toBeInTheDocument();
    });

    it('handles "more" placeholder with zero count', () => {
      const commentWithMore: RedditComment = {
        ...mockComment,
        replies: {
          kind: 'Listing',
          data: {
            after: null,
            before: null,
            children: [
              {
                kind: 'more',
                data: {
                  count: 0,
                  children: [],
                  id: 'more123',
                  name: 't1_more123',
                  parent_id: 't1_comment123',
                },
              },
            ],
          },
        } as RedditListing<RedditComment>,
      };

      renderWithProviders(<Comment comment={commentWithMore} />);

      // Should show "Load 0 more replies"
      expect(screen.getByText(/Load 0 more replies/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long comment body', () => {
      const longComment: RedditComment = {
        ...mockComment,
        body: 'A'.repeat(1000),
      };
      renderWithProviders(<Comment comment={longComment} />);
      expect(screen.getByTestId('comment')).toBeInTheDocument();
    });

    it('handles comment with special characters', () => {
      const specialComment: RedditComment = {
        ...mockComment,
        body: 'Test <script>alert("XSS")</script> & special chars: @#$%',
      };
      renderWithProviders(<Comment comment={specialComment} />);
      // Should render as text, not execute script
      expect(screen.getByText(/Test.*script.*alert/i)).toBeInTheDocument();
    });

    it('handles comment with newlines', () => {
      const multilineComment: RedditComment = {
        ...mockComment,
        body: 'Line 1\nLine 2\nLine 3',
      };
      renderWithProviders(<Comment comment={multilineComment} />);
      expect(screen.getByText(/Line 1.*Line 2.*Line 3/s)).toBeInTheDocument();
    });

    it('handles deeply nested comments (depth > 6)', () => {
      renderWithProviders(<Comment comment={mockComment} depth={10} />);
      // Should still render without errors
      expect(screen.getByTestId('comment')).toBeInTheDocument();
    });

    it('handles high score numbers', () => {
      const highScoreComment: RedditComment = {
        ...mockComment,
        score: 123456,
      };
      renderWithProviders(<Comment comment={highScoreComment} />);
      // formatScore should show as "123.5k"
      expect(screen.getByText(/123\.5k points/i)).toBeInTheDocument();
    });

    it('handles negative scores', () => {
      const negativeComment: RedditComment = {
        ...mockComment,
        score: -42,
      };
      renderWithProviders(<Comment comment={negativeComment} />);
      expect(screen.getByText(/-42 points/i)).toBeInTheDocument();
    });
  });
});
