/**
 * Subreddit constants
 *
 * Popular subreddits list for the sidebar filter
 */

export interface Subreddit {
  name: string;
  icon: string;
  label: string;
  description?: string;
}

/**
 * List of popular subreddits
 */
export const POPULAR_SUBREDDITS: Subreddit[] = [
  {
    name: 'popular',
    icon: '🔥',
    label: 'Popular',
    description: 'Most popular posts across Reddit',
  },
  {
    name: 'all',
    icon: '🌍',
    label: 'All',
    description: 'All posts from all subreddits',
  },
  {
    name: 'reactjs',
    icon: '⚛️',
    label: 'ReactJS',
    description: 'A community for learning and developing React',
  },
  {
    name: 'programming',
    icon: '💻',
    label: 'Programming',
    description: 'Computer Programming',
  },
  {
    name: 'javascript',
    icon: '🟨',
    label: 'JavaScript',
    description: 'All about JavaScript',
  },
  {
    name: 'typescript',
    icon: '🔷',
    label: 'TypeScript',
    description: 'TypeScript community',
  },
  {
    name: 'webdev',
    icon: '🌐',
    label: 'Web Dev',
    description: 'A community for web developers',
  },
  {
    name: 'gaming',
    icon: '🎮',
    label: 'Gaming',
    description: 'A subreddit for gaming news and discussion',
  },
  {
    name: 'news',
    icon: '📰',
    label: 'News',
    description: 'The latest news from around the world',
  },
  {
    name: 'videos',
    icon: '🎥',
    label: 'Videos',
    description: 'The best videos from around the web',
  },
  {
    name: 'funny',
    icon: '😂',
    label: 'Funny',
    description: 'Reddit\'s largest humor depository',
  },
  {
    name: 'askreddit',
    icon: '❓',
    label: 'Ask Reddit',
    description: 'Ask and answer thought-provoking questions',
  },
];
