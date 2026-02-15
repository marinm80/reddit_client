/**
 * Tests for formatter utility functions
 *
 * These are pure functions, so they're easy to test:
 * - No dependencies
 * - No side effects
 * - Predictable outputs
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatScore, formatTimestamp } from '../formatters';

describe('formatScore', () => {
  describe('Small numbers (< 1000)', () => {
    it('returns 0 as string', () => {
      expect(formatScore(0)).toBe('0');
    });

    it('returns positive numbers < 1000 as-is', () => {
      expect(formatScore(1)).toBe('1');
      expect(formatScore(42)).toBe('42');
      expect(formatScore(999)).toBe('999');
    });

    it('handles negative numbers < 1000', () => {
      expect(formatScore(-1)).toBe('-1');
      expect(formatScore(-42)).toBe('-42');
      expect(formatScore(-999)).toBe('-999');
    });
  });

  describe('Thousands (1k - 999k)', () => {
    it('formats 1000 as 1.0k', () => {
      expect(formatScore(1000)).toBe('1.0k');
    });

    it('formats numbers with one decimal place', () => {
      expect(formatScore(1234)).toBe('1.2k');
      expect(formatScore(1567)).toBe('1.6k');
      expect(formatScore(9999)).toBe('10.0k');
    });

    it('formats large thousands correctly', () => {
      expect(formatScore(42000)).toBe('42.0k');
      expect(formatScore(123456)).toBe('123.5k');
      expect(formatScore(999999)).toBe('1000.0k');
    });

    it('handles negative thousands', () => {
      // Note: formatScore doesn't specially handle negatives, Math.abs is needed
      // Negative numbers < -1000 still pass the first check (score < 1000)
      expect(formatScore(-1000)).toBe('-1000');
      expect(formatScore(-1234)).toBe('-1234');
      expect(formatScore(-999)).toBe('-999');
    });
  });

  describe('Millions (≥ 1M)', () => {
    it('formats 1 million as 1.0M', () => {
      expect(formatScore(1000000)).toBe('1.0M');
    });

    it('formats millions with one decimal place', () => {
      expect(formatScore(1234567)).toBe('1.2M');
      expect(formatScore(1567890)).toBe('1.6M');
      expect(formatScore(9999999)).toBe('10.0M');
    });

    it('formats large millions correctly', () => {
      expect(formatScore(42000000)).toBe('42.0M');
      expect(formatScore(123456789)).toBe('123.5M');
    });

    it('handles negative millions', () => {
      // Note: formatScore doesn't specially handle negatives
      // Negative numbers are always < 1000, so they're shown as-is
      expect(formatScore(-1000000)).toBe('-1000000');
      expect(formatScore(-1234567)).toBe('-1234567');
    });
  });

  describe('Edge cases', () => {
    it('handles boundary values correctly', () => {
      expect(formatScore(999)).toBe('999'); // Just below 1k
      expect(formatScore(1000)).toBe('1.0k'); // Exactly 1k
      expect(formatScore(999999)).toBe('1000.0k'); // Just below 1M
      expect(formatScore(1000000)).toBe('1.0M'); // Exactly 1M
    });
  });
});

describe('formatTimestamp', () => {
  // Fixed timestamp for consistent testing
  const mockNow = 1707840000; // February 13, 2024 16:00:00 UTC

  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp
    vi.spyOn(Date, 'now').mockReturnValue(mockNow * 1000); // milliseconds
  });

  afterEach(() => {
    // Restore original Date.now()
    vi.restoreAllMocks();
  });

  describe('Recent times (< 1 minute)', () => {
    it('shows "just now" for current timestamp', () => {
      expect(formatTimestamp(mockNow)).toBe('just now');
    });

    it('shows "just now" for timestamps within last 60 seconds', () => {
      expect(formatTimestamp(mockNow - 30)).toBe('just now');
      expect(formatTimestamp(mockNow - 59)).toBe('just now');
    });
  });

  describe('Minutes ago', () => {
    it('shows "1 minute ago" for singular', () => {
      expect(formatTimestamp(mockNow - 60)).toBe('1 minute ago');
      expect(formatTimestamp(mockNow - 119)).toBe('1 minute ago');
    });

    it('shows "X minutes ago" for plural', () => {
      expect(formatTimestamp(mockNow - 120)).toBe('2 minutes ago');
      expect(formatTimestamp(mockNow - 300)).toBe('5 minutes ago');
      expect(formatTimestamp(mockNow - 3599)).toBe('59 minutes ago');
    });
  });

  describe('Hours ago', () => {
    it('shows "1 hour ago" for singular', () => {
      expect(formatTimestamp(mockNow - 3600)).toBe('1 hour ago');
      expect(formatTimestamp(mockNow - 7199)).toBe('1 hour ago');
    });

    it('shows "X hours ago" for plural', () => {
      expect(formatTimestamp(mockNow - 7200)).toBe('2 hours ago');
      expect(formatTimestamp(mockNow - 18000)).toBe('5 hours ago');
      expect(formatTimestamp(mockNow - 86399)).toBe('23 hours ago');
    });
  });

  describe('Days ago', () => {
    it('shows "1 day ago" for singular', () => {
      expect(formatTimestamp(mockNow - 86400)).toBe('1 day ago');
      expect(formatTimestamp(mockNow - 172799)).toBe('1 day ago');
    });

    it('shows "X days ago" for plural', () => {
      expect(formatTimestamp(mockNow - 172800)).toBe('2 days ago');
      expect(formatTimestamp(mockNow - 432000)).toBe('5 days ago');
      expect(formatTimestamp(mockNow - 604799)).toBe('6 days ago');
    });
  });

  describe('Weeks ago', () => {
    it('shows "1 week ago" for singular', () => {
      expect(formatTimestamp(mockNow - 604800)).toBe('1 week ago');
      expect(formatTimestamp(mockNow - 1209599)).toBe('1 week ago');
    });

    it('shows "X weeks ago" for plural', () => {
      expect(formatTimestamp(mockNow - 1209600)).toBe('2 weeks ago');
      expect(formatTimestamp(mockNow - 1814400)).toBe('3 weeks ago');
      expect(formatTimestamp(mockNow - 2591999)).toBe('4 weeks ago');
    });
  });

  describe('Months ago', () => {
    it('shows "1 month ago" for singular', () => {
      expect(formatTimestamp(mockNow - 2592000)).toBe('1 month ago');
      expect(formatTimestamp(mockNow - 5183999)).toBe('1 month ago');
    });

    it('shows "X months ago" for plural', () => {
      expect(formatTimestamp(mockNow - 5184000)).toBe('2 months ago');
      expect(formatTimestamp(mockNow - 12960000)).toBe('5 months ago');
      expect(formatTimestamp(mockNow - 31535999)).toBe('12 months ago');
    });
  });

  describe('Years ago', () => {
    it('shows "1 year ago" for singular', () => {
      expect(formatTimestamp(mockNow - 31536000)).toBe('1 year ago');
      expect(formatTimestamp(mockNow - 63071999)).toBe('1 year ago');
    });

    it('shows "X years ago" for plural', () => {
      expect(formatTimestamp(mockNow - 63072000)).toBe('2 years ago');
      expect(formatTimestamp(mockNow - 157680000)).toBe('5 years ago');
      expect(formatTimestamp(mockNow - 315360000)).toBe('10 years ago');
    });
  });

  describe('Boundary cases', () => {
    it('handles exact boundaries correctly', () => {
      expect(formatTimestamp(mockNow - 59)).toBe('just now'); // Just below 1 minute
      expect(formatTimestamp(mockNow - 60)).toBe('1 minute ago'); // Exactly 1 minute
      expect(formatTimestamp(mockNow - 3599)).toBe('59 minutes ago'); // Just below 1 hour
      expect(formatTimestamp(mockNow - 3600)).toBe('1 hour ago'); // Exactly 1 hour
      expect(formatTimestamp(mockNow - 86399)).toBe('23 hours ago'); // Just below 1 day
      expect(formatTimestamp(mockNow - 86400)).toBe('1 day ago'); // Exactly 1 day
    });
  });
});
