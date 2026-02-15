/**
 * Tests for CommentList Component
 *
 * Tests the container component that displays a list of top-level comments.
 */
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { CommentList } from '../CommentList';
import type { RedditListing, RedditComment } from '@/types/reddit';

// Mock empty comment listing
const mockEmptyCommentListing: RedditListing<RedditComment> = {
  kind: 'Listing',
  data: {
    after: null,
    before: null,
    children: [],
  },
};

// Helper to create a mock comment
const createMockComment = (id: string, body: string): RedditComment => ({
  id,
  name: `t1_${id}`,
  parent_id: 't3_post123',
  body,
  body_html: `<p>${body}</p>`,
  author: 'testuser',
  subreddit: 'reactjs',
  score: 10,
  ups: 10,
  downs: 0,
  created_utc: Math.floor(Date.now() / 1000) - 3600,
  replies: '',
  depth: 0,
  is_submitter: false,
  stickied: false,
  score_hidden: false,
  collapsed: false,
});

// Helper to create a comment listing
const createCommentListing = (comments: RedditComment[]): RedditListing<RedditComment> => ({
  kind: 'Listing',
  data: {
    after: null,
    before: null,
    children: comments.map((comment) => ({
      kind: 't1' as const,
      data: comment,
    })),
  },
});

describe('CommentList', () => {
  describe('Rendering', () => {
    it('renders all top-level comments', () => {
      const comment1 = createMockComment('comment1', 'First comment');
      const comment2 = createMockComment('comment2', 'Second comment');
      const comment3 = createMockComment('comment3', 'Third comment');

      const listing = createCommentListing([comment1, comment2, comment3]);

      renderWithProviders(<CommentList commentsListing={listing} />);

      expect(screen.getByText('First comment')).toBeInTheDocument();
      expect(screen.getByText('Second comment')).toBeInTheDocument();
      expect(screen.getByText('Third comment')).toBeInTheDocument();
    });

    it('renders correct number of comment elements', () => {
      const comments = [
        createMockComment('c1', 'Comment 1'),
        createMockComment('c2', 'Comment 2'),
        createMockComment('c3', 'Comment 3'),
      ];

      const listing = createCommentListing(comments);

      renderWithProviders(<CommentList commentsListing={listing} />);

      const commentElements = screen.getAllByTestId('comment');
      expect(commentElements).toHaveLength(3);
    });

    it('passes correct props to Comment components', () => {
      const comment = createMockComment('test1', 'Test comment body');
      const listing = createCommentListing([comment]);

      renderWithProviders(<CommentList commentsListing={listing} />);

      // Verify comment is rendered with correct data
      expect(screen.getByText('Test comment body')).toBeInTheDocument();
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('filters out "more" placeholders from top level', () => {
      const listing: RedditListing<RedditComment> = {
        kind: 'Listing',
        data: {
          after: null,
          before: null,
          children: [
            {
              kind: 't1' as const,
              data: createMockComment('comment1', 'Valid comment'),
            },
            {
              kind: 'more' as const,
              data: {
                count: 5,
                children: ['id1', 'id2'],
                id: 'more123',
                name: 't1_more123',
                parent_id: 't3_post123',
              },
            },
          ],
        },
      };

      renderWithProviders(<CommentList commentsListing={listing} />);

      // Should only render the actual comment, not the "more" placeholder
      expect(screen.getByText('Valid comment')).toBeInTheDocument();
      expect(screen.queryByText(/Load.*more replies/i)).not.toBeInTheDocument();

      // Should have exactly 1 comment element
      const commentElements = screen.getAllByTestId('comment');
      expect(commentElements).toHaveLength(1);
    });

    it('handles listing with only "more" items', () => {
      const listing: RedditListing<RedditComment> = {
        kind: 'Listing',
        data: {
          after: null,
          before: null,
          children: [
            {
              kind: 'more' as const,
              data: {
                count: 10,
                children: ['id1', 'id2', 'id3'],
                id: 'more456',
                name: 't1_more456',
                parent_id: 't3_post123',
              },
            },
          ],
        },
      };

      renderWithProviders(<CommentList commentsListing={listing} />);

      // Should show empty state since no actual comments
      expect(screen.getByText(/No comments yet/i)).toBeInTheDocument();
    });

    it('handles mixed t1 and more items correctly', () => {
      const listing: RedditListing<RedditComment> = {
        kind: 'Listing',
        data: {
          after: null,
          before: null,
          children: [
            {
              kind: 't1' as const,
              data: createMockComment('c1', 'Comment 1'),
            },
            {
              kind: 'more' as const,
              data: {
                count: 3,
                children: [],
                id: 'more1',
                name: 't1_more1',
                parent_id: 't3_post123',
              },
            },
            {
              kind: 't1' as const,
              data: createMockComment('c2', 'Comment 2'),
            },
          ],
        },
      };

      renderWithProviders(<CommentList commentsListing={listing} />);

      // Should render both comments
      expect(screen.getByText('Comment 1')).toBeInTheDocument();
      expect(screen.getByText('Comment 2')).toBeInTheDocument();

      // Should have exactly 2 comment elements
      const commentElements = screen.getAllByTestId('comment');
      expect(commentElements).toHaveLength(2);
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no comments', () => {
      renderWithProviders(<CommentList commentsListing={mockEmptyCommentListing} />);

      expect(screen.getByText(/No comments yet/i)).toBeInTheDocument();
      expect(screen.getByText(/Be the first to comment!/i)).toBeInTheDocument();
    });

    it('does not show empty state when comments exist', () => {
      const comment = createMockComment('c1', 'Test comment');
      const listing = createCommentListing([comment]);

      renderWithProviders(<CommentList commentsListing={listing} />);

      expect(screen.queryByText(/No comments yet/i)).not.toBeInTheDocument();
    });

    it('shows empty state message with correct styling', () => {
      renderWithProviders(<CommentList commentsListing={mockEmptyCommentListing} />);

      const emptyState = screen.getByText(/No comments yet/i);
      expect(emptyState).toHaveClass('text-center');
      expect(emptyState).toHaveClass('py-8');
      expect(emptyState).toHaveClass('text-text-secondary');
    });
  });

  describe('Edge Cases', () => {
    it('handles large number of comments', () => {
      const manyComments = Array.from({ length: 100 }, (_, i) =>
        createMockComment(`c${i}`, `Comment number ${i}`)
      );

      const listing = createCommentListing(manyComments);

      renderWithProviders(<CommentList commentsListing={listing} />);

      // Should render all comments
      const commentElements = screen.getAllByTestId('comment');
      expect(commentElements).toHaveLength(100);
    });

    it('handles listing with null children', () => {
      const listing: RedditListing<RedditComment> = {
        kind: 'Listing',
        data: {
          after: null,
          before: null,
          children: [],
        },
      };

      renderWithProviders(<CommentList commentsListing={listing} />);

      // Should show empty state
      expect(screen.getByText(/No comments yet/i)).toBeInTheDocument();
    });

    it('renders comments with unique keys', () => {
      const comments = [
        createMockComment('unique1', 'Comment 1'),
        createMockComment('unique2', 'Comment 2'),
        createMockComment('unique3', 'Comment 3'),
      ];

      const listing = createCommentListing(comments);

      renderWithProviders(<CommentList commentsListing={listing} />);

      // All comments should be rendered (no key conflicts)
      expect(screen.getAllByTestId('comment')).toHaveLength(3);
    });

    it('handles comments with same body but different IDs', () => {
      const comments = [
        createMockComment('id1', 'Same text'),
        createMockComment('id2', 'Same text'),
        createMockComment('id3', 'Same text'),
      ];

      const listing = createCommentListing(comments);

      renderWithProviders(<CommentList commentsListing={listing} />);

      // Should render all 3 comments even though they have same text
      const sameTextElements = screen.getAllByText('Same text');
      expect(sameTextElements).toHaveLength(3);
    });
  });

  describe('Layout', () => {
    it('applies correct spacing between comments', () => {
      const comments = [
        createMockComment('c1', 'Comment 1'),
        createMockComment('c2', 'Comment 2'),
      ];

      const listing = createCommentListing(comments);

      const { container } = renderWithProviders(
        <CommentList commentsListing={listing} />
      );

      // Container should have space-y-4 class
      const commentContainer = container.querySelector('.space-y-4');
      expect(commentContainer).toBeInTheDocument();
    });
  });
});
