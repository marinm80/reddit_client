import { useState, useEffect } from "react";

/**
 * Custom hook to apply debouncing to a value.
 *
 * @template T - Type of the value to debounce (can be string, number, object, etc.)
 * @param value - The value that changes frequently (e.g.: user input)
 * @param delay - Wait time in milliseconds before updating (default: 500ms)
 * @returns The debounced value that only updates after the delay
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * // debouncedSearch only updates 500ms after the user stops typing
 * useSearchPostsQuery(debouncedSearch, { skip: debouncedSearch.length < 3 });
 * ```
 *
 * **Key concept: "Traffic Officer"**
 * - Imagine that each key pressed is a car passing by
 * - The officer (this hook) waits for no more cars to pass for X time
 * - Only when the time passes without traffic, allows to continue
 * - If another car passes before the time, resets the timer
 *
 * **Why it's important:**
 * - Avoids making API calls for each key pressed
 * - Improves performance by reducing unnecessary re-renders
 * - Respects API rate limits (Reddit: ~10 req/min)
 * - Better UX: results don't change constantly while typing
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    // Local state that will store the debounced value
    // This value only changes after the delay, not on every 'value' change
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Create a timer that will update debouncedValue after the delay
        // This is like the "officer" waiting for no more traffic
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: Executes when:
        // 1. The component unmounts, OR
        // 2. 'value' or 'delay' change (before executing the new effect)
        //
        // If 'value' changes before the delay finishes, we cancel the previous
        // timer and create a new one. This resets the timer.
        // It's like when another car passes and the officer resets his count.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Re-execute when value or delay change

    return debouncedValue;
}