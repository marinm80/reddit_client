/**
 * PostCard Component Tests
 *
 * Tests for the PostCard presentation component.
 */
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, userEvent } from '@/test/test-utils';
import { mockPost, mockSelfPost } from '@/test/mocks';
import { PostCard } from '../PostCard';

describe('PostCard', () => {
  describe('Rendering', () => {
    it('renders post title', () => {
      renderWithProviders(<PostCard post={mockPost} />);

      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    });

    it('renders post author', () => {
      renderWithProviders(<PostCard post={mockPost} />);

      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });

    it('renders post subreddit', () => {
      renderWithProviders(<PostCard post={mockPost} />);

      expect(screen.getByText(`r/${mockPost.subreddit}`)).toBeInTheDocument();
    });

    it('renders post score', () => {
      renderWithProviders(<PostCard post={mockPost} />);

      // formatScore(150) should return "150"
      expect(screen.getByText(/150/)).toBeInTheDocument();
    });

    it('renders comment count', () => {
      renderWithProviders(<PostCard post={mockPost} />);

      expect(screen.getByText(mockPost.num_comments.toString())).toBeInTheDocument();
    });
  });

  describe('Thumbnail', () => {
    it('renders thumbnail image when valid URL exists', () => {
      const { container } = renderWithProviders(<PostCard post={mockPost} />);

      // Image has alt="" so it's presentation role, not img
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockPost.thumbnail);
    });

    it('renders text placeholder for self posts', () => {
      renderWithProviders(<PostCard post={mockSelfPost} />);

      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    it('does not render image for self posts', () => {
      renderWithProviders(<PostCard post={mockSelfPost} />);

      const images = screen.queryAllByRole('img');
      expect(images).toHaveLength(0);
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      renderWithProviders(<PostCard post={mockPost} onClick={handleClick} />);

      const card = screen.getByTestId('post-card');
      await user.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not crash when onClick is not provided', async () => {
      const user = userEvent.setup();

      renderWithProviders(<PostCard post={mockPost} />);

      const card = screen.getByTestId('post-card');
      await user.click(card);

      // Should not throw
      expect(card).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper article structure', () => {
      renderWithProviders(<PostCard post={mockPost} />);

      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
    });

    it('has cursor pointer for clickability', () => {
      renderWithProviders(<PostCard post={mockPost} />);

      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing thumbnail gracefully', () => {
      const postWithoutThumbnail = {
        ...mockPost,
        thumbnail: 'default',
      };

      renderWithProviders(<PostCard post={postWithoutThumbnail} />);

      // Should show link placeholder
      expect(screen.getByText('🔗')).toBeInTheDocument();
    });

    it('handles very long titles', () => {
      const postWithLongTitle = {
        ...mockPost,
        title: 'A'.repeat(200),
      };

      renderWithProviders(<PostCard post={postWithLongTitle} />);

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('line-clamp-2');
    });

    it('handles zero score', () => {
      const postWithZeroScore = {
        ...mockPost,
        score: 0,
      };

      renderWithProviders(<PostCard post={postWithZeroScore} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles zero comments', () => {
      const postWithNoComments = {
        ...mockPost,
        num_comments: 0,
      };

      renderWithProviders(<PostCard post={postWithNoComments} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
