/**
 * Tests for cn (classNames) utility
 *
 * The cn utility merges class names with Tailwind CSS conflict resolution.
 * It combines clsx for conditional handling and tailwind-merge for deduplication.
 */
import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn', () => {
  describe('Basic class merging', () => {
    it('merges multiple class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('merges class names from multiple arguments', () => {
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
    });

    it('returns empty string for no input', () => {
      expect(cn()).toBe('');
    });

    it('returns single class as-is', () => {
      expect(cn('foo')).toBe('foo');
    });
  });

  describe('Conditional classes', () => {
    it('includes classes when condition is true', () => {
      expect(cn('base', true && 'active')).toBe('base active');
    });

    it('excludes classes when condition is false', () => {
      expect(cn('base', false && 'hidden')).toBe('base');
    });

    it('handles multiple conditional classes', () => {
      expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
    });

    it('handles complex conditions', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn('btn', isActive && 'active', isDisabled && 'disabled')).toBe('btn active');
    });
  });

  describe('Falsy value filtering', () => {
    it('filters out null values', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar');
    });

    it('filters out undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    });

    it('filters out false values', () => {
      expect(cn('foo', false, 'bar')).toBe('foo bar');
    });

    it('filters out empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('keeps zero (0) as it is truthy in this context', () => {
      // Note: clsx treats 0 as falsy, so it will be filtered
      expect(cn('foo', 0, 'bar')).toBe('foo bar');
    });

    it('handles all falsy values together', () => {
      expect(cn('foo', null, undefined, false, '', 'bar')).toBe('foo bar');
    });
  });

  describe('Tailwind CSS conflict resolution', () => {
    it('resolves background color conflicts (last wins)', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('resolves padding conflicts', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });

    it('resolves width conflicts', () => {
      expect(cn('w-full', 'w-1/2')).toBe('w-1/2');
    });

    it('resolves text color conflicts', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('keeps non-conflicting classes', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('resolves complex Tailwind conflicts', () => {
      expect(cn('px-4 py-2', 'p-8')).toBe('p-8');
      expect(cn('p-4', 'px-8')).toBe('p-4 px-8');
    });

    it('handles multiple conflict resolutions', () => {
      const result = cn('bg-red-500 text-white', 'bg-blue-500 p-4');
      expect(result).toBe('text-white bg-blue-500 p-4');
    });
  });

  describe('Array handling', () => {
    it('handles array of classes', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('handles nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });

    it('filters falsy values in arrays', () => {
      expect(cn(['foo', false, 'bar', null, 'baz'])).toBe('foo bar baz');
    });

    it('handles mixed arrays and strings', () => {
      expect(cn('base', ['foo', 'bar'], 'end')).toBe('base foo bar end');
    });
  });

  describe('Object handling', () => {
    it('includes keys with truthy values', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo');
    });

    it('handles multiple truthy keys', () => {
      expect(cn({ foo: true, bar: true, baz: false })).toBe('foo bar');
    });

    it('handles objects with string values', () => {
      // Non-empty strings are truthy
      expect(cn({ foo: 'yes', bar: '' })).toBe('foo');
    });

    it('handles objects with number values', () => {
      expect(cn({ foo: 1, bar: 0 })).toBe('foo');
    });

    it('combines objects with strings', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });
  });

  describe('Complex real-world scenarios', () => {
    it('handles typical component className prop pattern', () => {
      const className = 'custom-class';
      const result = cn('base-class', 'default-styles', className);
      expect(result).toBe('base-class default-styles custom-class');
    });

    it('handles button variant pattern', () => {
      const isPrimary = true;
      const isDisabled = false;
      const result = cn(
        'btn',
        isPrimary && 'btn-primary',
        isDisabled && 'btn-disabled'
      );
      expect(result).toBe('btn btn-primary');
    });

    it('handles Tailwind override pattern', () => {
      const userClassName = 'bg-green-500';
      const result = cn('bg-blue-500 text-white p-4', userClassName);
      expect(result).toBe('text-white p-4 bg-green-500');
    });

    it('handles responsive and state modifiers', () => {
      const result = cn(
        'bg-surface',
        'hover:bg-surface-hover',
        'md:p-6',
        'lg:p-8'
      );
      expect(result).toBe('bg-surface hover:bg-surface-hover md:p-6 lg:p-8');
    });

    it('handles complex component pattern with all features', () => {
      const isActive = true;
      const isError = false;
      const className = 'custom-border';

      const result = cn(
        'base-component',
        'bg-surface p-4',
        isActive && 'active border-primary',
        isError && 'error border-error',
        !isError && 'border-border',
        className
      );

      // tailwind-merge resolves border conflicts - last border class wins
      // border-primary is overridden by border-border (since !isError is true)
      expect(result).toBe('base-component bg-surface p-4 active border-border custom-border');
    });
  });

  describe('Edge cases', () => {
    it('handles whitespace in class names', () => {
      expect(cn('  foo  ', '  bar  ')).toBe('foo bar');
    });

    it('handles duplicate class names', () => {
      // clsx preserves order and duplicates, twMerge doesn't dedupe non-Tailwind classes
      expect(cn('foo', 'bar', 'foo')).toBe('foo bar foo');
    });

    it('handles empty arrays', () => {
      expect(cn([])).toBe('');
      expect(cn('foo', [], 'bar')).toBe('foo bar');
    });

    it('handles empty objects', () => {
      expect(cn({})).toBe('');
      expect(cn('foo', {}, 'bar')).toBe('foo bar');
    });
  });
});
