/**
 * SubredditFilter Component
 *
 * Sidebar component that allows users to:
 * - Select from popular subreddits
 * - Enter a custom subreddit
 * - Persist selection in URL params
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setSubreddit } from '@/features/posts/postsSlice';
import { POPULAR_SUBREDDITS } from './constants';
import { cn } from '@/utils/cn';

export function SubredditFilter() {
  const dispatch = useAppDispatch();
  const selectedSubreddit = useAppSelector((state) => state.posts.selectedSubreddit);
  const [, setSearchParams] = useSearchParams();
  const [customSubreddit, setCustomSubreddit] = useState('');

  /**
   * Handles subreddit selection
   * Updates Redux state and URL params
   */
  const handleSubredditClick = (subreddit: string) => {
    dispatch(setSubreddit(subreddit));
    setSearchParams({ subreddit });
  };

  /**
   * Handles custom subreddit form submission
   */
  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Trim and remove leading "r/" if present
    const cleanedSubreddit = customSubreddit
      .trim()
      .toLowerCase()
      .replace(/^r\//, '');

    // Validate input
    if (cleanedSubreddit.length === 0) {
      return;
    }

    // Basic validation: only alphanumeric and underscores
    const isValid = /^[a-z0-9_]+$/i.test(cleanedSubreddit);
    if (!isValid) {
      alert('Invalid subreddit name. Use only letters, numbers, and underscores.');
      return;
    }

    // Update state and URL
    dispatch(setSubreddit(cleanedSubreddit));
    setSearchParams({ subreddit: cleanedSubreddit });
    setCustomSubreddit(''); // Clear input
  };

  return (
    <aside className="w-64 bg-surface rounded-lg p-4 h-fit sticky top-4">
      {/* Header */}
      <h2 className="text-lg font-semibold text-text mb-4 border-b border-border pb-2">
        Subreddits
      </h2>

      {/* Popular Subreddits List */}
      <ul className="space-y-1">
        {POPULAR_SUBREDDITS.map((subreddit) => (
          <li key={subreddit.name}>
            <button
              onClick={() => handleSubredditClick(subreddit.name)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-md cursor-pointer transition-colors flex items-center gap-2',
                selectedSubreddit === subreddit.name
                  ? 'bg-primary text-white font-medium'
                  : 'text-text hover:bg-surface-hover'
              )}
              title={subreddit.description}
              data-testid={`subreddit-${subreddit.name}`}
            >
              <span className="text-lg" aria-hidden="true">
                {subreddit.icon}
              </span>
              <span className="flex-1">{subreddit.label}</span>
              {selectedSubreddit === subreddit.name && (
                <span className="text-xs" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div className="my-4 border-t border-border" />

      {/* Custom Subreddit Input */}
      <form onSubmit={handleCustomSubmit} className="space-y-2">
        <label
          htmlFor="custom-subreddit"
          className="block text-sm font-medium text-text-secondary"
        >
          Custom Subreddit
        </label>
        <div className="flex gap-2">
          <input
            id="custom-subreddit"
            type="text"
            value={customSubreddit}
            onChange={(e) => setCustomSubreddit(e.target.value)}
            placeholder="e.g. webdev"
            className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-text text-sm placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            data-testid="custom-subreddit-input"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            data-testid="custom-subreddit-submit"
          >
            Go
          </button>
        </div>
        <p className="text-xs text-text-secondary">
          Enter any subreddit name (without "r/")
        </p>
      </form>
    </aside>
  );
}
