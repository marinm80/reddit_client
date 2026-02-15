/**
 * useDebounce Hook Tests
 *
 * Tests for the useDebounce custom hook using real timers.
 */
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 100 },
      }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 100 });

    // Should still be old value immediately
    expect(result.current).toBe('initial');

    // Wait for debounce
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 }
    );
  });

  it('works with numbers', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 100 },
      }
    );

    rerender({ value: 42, delay: 100 });

    await waitFor(
      () => {
        expect(result.current).toBe(42);
      },
      { timeout: 200 }
    );
  });

  it('works with objects', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: { foo: 'bar' }, delay: 100 },
      }
    );

    const newObj = { foo: 'baz' };
    rerender({ value: newObj, delay: 100 });

    await waitFor(
      () => {
        expect(result.current).toEqual(newObj);
      },
      { timeout: 200 }
    );
  });
});
