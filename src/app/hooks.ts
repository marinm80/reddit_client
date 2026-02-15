import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed version of Redux useDispatch hook.
 *
 * Returns a dispatch function that knows about all available actions
 * and provides TypeScript auto-complete for action creators.
 *
 * CRITICAL: Always use this instead of plain useDispatch to get type safety.
 *
 * @returns Typed dispatch function for the app store
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(setSubreddit('reactjs')); // TypeScript knows this action exists
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of Redux useSelector hook.
 *
 * Provides TypeScript auto-complete for the entire Redux state tree.
 * The selector function receives RootState with full type information.
 *
 * CRITICAL: Always use this instead of plain useSelector to get type safety.
 *
 * @example
 * const selectedSubreddit = useAppSelector((state) => state.posts.selectedSubreddit);
 * // TypeScript knows state.posts.selectedSubreddit is a string
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
