import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with Tailwind CSS conflict resolution.
 *
 * Uses clsx for conditional class handling and tailwind-merge
 * to resolve conflicting Tailwind utilities (e.g., bg-red-500 overrides bg-blue-500).
 *
 * This utility is CRITICAL for proper Tailwind class composition - always use this
 * instead of template literals or manual string concatenation.
 *
 * @param inputs - Class values (strings, objects, arrays, conditionals)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * // Basic usage
 * cn('px-4 py-2', 'rounded-md')
 * // → 'px-4 py-2 rounded-md'
 *
 * @example
 * // Conflict resolution (last class wins)
 * cn('bg-red-500', 'bg-blue-500')
 * // → 'bg-blue-500'
 *
 * @example
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', className)
 * // → 'base-class active-class' (if isActive is true)
 *
 * @example
 * // Object syntax
 * cn({ 'text-primary': isPrimary, 'text-secondary': !isPrimary })
 * // → 'text-primary' (if isPrimary is true)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
