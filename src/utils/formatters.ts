/**
 * Utility Functions to format Reddit data
 *
 * These functions are "pure" - they always return the same result
 * with the same input, without side effects.
 */

/**
 * Formats a score/points number to compact format
 *
 * Converts large numbers into readable format:
 * - Numbers less than 1,000 → shown as is
 * - Numbers between 1,000 and 999,999 → shown with "k" (thousands)
 * - Numbers of 1,000,000 or more → shown with "M" (millions)
 *
 * @param score - Number of points (upvotes - downvotes)
 * @returns Formatted string with k/M suffix
 *
 * @example
 * formatScore(42)       // → "42"
 * formatScore(1234)     // → "1.2k"
 * formatScore(1567890)  // → "1.6M"
 */
export function formatScore(score: number): string {
    // Numbers less than a thousand: show as is
    if (score < 1000){
        return score.toString();
    }
    // Numbers between 1k and 1M: divide by thousand and add "k"
    else if (score >= 1000 && score < 1000000) {
        return (score / 1000).toFixed(1) + 'k';  // .toFixed(1) rounds to 1 decimal
    }
    // Numbers of 1M or more: divide by million and add "M"
    else {
        return (score / 1000000).toFixed(1) + 'M';
    }
}

/**
 * Formats a Unix timestamp to relative time ("X time ago")
 *
 * IMPORTANT: Reddit returns timestamps in SECONDS, not milliseconds.
 * Date.now() returns milliseconds, that's why we divide by 1000.
 *
 * The function calculates how much time has passed and returns a readable string.
 * Handles singular/plural correctly (1 hour vs 2 hours).
 *
 * @param unixTimestamp - Unix timestamp in SECONDS (created_utc from Reddit)
 * @returns String with relative time (e.g.: "2 hours ago", "just now")
 *
 * @example
 * const now = Date.now() / 1000;
 * formatTimestamp(now - 120)     // → "2 minutes ago"
 * formatTimestamp(now - 7200)    // → "2 hours ago"
 * formatTimestamp(now - 86400)   // → "1 day ago"
 */
export function formatTimestamp(unixTimestamp: number): string {
    // 1. Get current timestamp in seconds (Date.now() gives milliseconds)
    const now = Math.floor(Date.now() / 1000);

    // 2. Calculate how many seconds have passed since the post
    const secondsAgo = now - unixTimestamp;

    // 3. Define time constants in seconds
    const MINUTE = 60;                      // 60 seconds
    const HOUR = 60 * 60;                   // 3,600 seconds
    const DAY = 60 * 60 * 24;              // 86,400 seconds
    const WEEK = 60 * 60 * 24 * 7;         // 604,800 seconds
    const MONTH = 60 * 60 * 24 * 30;       // 2,592,000 seconds
    const YEAR = 60 * 60 * 24 * 365;       // 31,536,000 seconds

    // 4. Check time ranges (from longest to shortest)
    // IMPORTANT: The order is crucial - we start with the longest time

    // Years (≥ 365 days)
    if (secondsAgo >= YEAR) {
        const years = Math.floor(secondsAgo / YEAR);
        const label = years === 1 ? 'year' : 'years';  // Singular/plural
        return `${years} ${label} ago`;
    }

    // Months (≥ 30 days)
    else if (secondsAgo >= MONTH) {
        const months = Math.floor(secondsAgo / MONTH);
        const label = months === 1 ? 'month' : 'months';
        return `${months} ${label} ago`;
    }

    // Weeks (≥ 7 days)
    else if (secondsAgo >= WEEK) {
        const weeks = Math.floor(secondsAgo / WEEK);
        const label = weeks === 1 ? 'week' : 'weeks';
        return `${weeks} ${label} ago`;
    }

    // Days (≥ 24 hours)
    else if (secondsAgo >= DAY) {
        const days = Math.floor(secondsAgo / DAY);
        const label = days === 1 ? 'day' : 'days';
        return `${days} ${label} ago`;
    }

    // Hours (≥ 60 minutes)
    else if (secondsAgo >= HOUR) {
        const hours = Math.floor(secondsAgo / HOUR);
        const label = hours === 1 ? 'hour' : 'hours';
        return `${hours} ${label} ago`;
    }

    // Minutes (≥ 60 seconds)
    else if (secondsAgo >= MINUTE) {
        const minutes = Math.floor(secondsAgo / MINUTE);
        const label = minutes === 1 ? 'minute' : 'minutes';
        return `${minutes} ${label} ago`;
    }

    // Less than 1 minute
    else {
        return 'just now';
    }
}

/**
 * KEY CONCEPTS used in this file:
 *
 * 1. PURE FUNCTIONS:
 *    - Same input = same output (deterministic)
 *    - No side effects (don't modify external variables)
 *    - Easy to test
 *
 * 2. UNIX TIMESTAMP:
 *    - Number of seconds since January 1, 1970 UTC
 *    - Reddit uses seconds, JavaScript uses milliseconds
 *    - That's why we divide Date.now() by 1000
 *
 * 3. MATH.FLOOR():
 *    - Rounds down to the nearest integer
 *    - Ex: Math.floor(2.9) → 2
 *    - We use this to get integer values (we don't want "2.5 hours ago")
 *
 * 4. TEMPLATE STRINGS:
 *    - Syntax: `text ${variable} more text`
 *    - More readable than concatenation with +
 *    - Allows variable interpolation
 *
 * 5. TERNARY OPERATOR:
 *    - Syntax: condition ? valueIfTrue : valueIfFalse
 *    - Used for singular/plural: value === 1 ? 'hour' : 'hours'
 */