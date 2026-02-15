/**
 * Mock Data for Tests
 *
 * Reusable mock data objects for testing components.
 */
import type { RedditPost, RedditComment, RedditListing } from '@/types/reddit';

/**
 * Mock Reddit Post
 */
export const mockPost: RedditPost = {
  id: 'test123',
  name: 't3_test123',
  title: 'Test Post Title',
  author: 'testuser',
  subreddit: 'reactjs',
  subreddit_name_prefixed: 'r/reactjs',
  score: 150,
  num_comments: 25,
  created_utc: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
  url: 'https://reddit.com/r/reactjs/comments/test123',
  permalink: '/r/reactjs/comments/test123',
  thumbnail: 'https://example.com/thumb.jpg',
  is_self: false,
  over_18: false,
};

/**
 * Mock Reddit Post (self/text post)
 */
export const mockSelfPost: RedditPost = {
  ...mockPost,
  id: 'self123',
  name: 't3_self123',
  title: 'Self Post Title',
  is_self: true,
  thumbnail: 'self',
  selftext: 'This is the body of a self post with some text content.',
};

/**
 * Mock Reddit Comment
 */
export const mockComment: RedditComment = {
  id: 'comment123',
  name: 't1_comment123',
  parent_id: 't3_test123',
  body: 'This is a test comment',
  body_html: '<p>This is a test comment</p>',
  author: 'commenter',
  subreddit: 'reactjs',
  score: 50,
  ups: 50,
  downs: 0,
  created_utc: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  replies: '',
  depth: 0,
  is_submitter: false,
  stickied: false,
  score_hidden: false,
  collapsed: false,
};

/**
 * Mock Reddit Comment (with nested replies)
 */
export const mockCommentWithReplies: RedditComment = {
  ...mockComment,
  id: 'comment_with_replies',
  replies: {
    kind: 'Listing',
    data: {
      after: null,
      before: null,
      children: [
        {
          kind: 't1',
          data: {
            ...mockComment,
            id: 'nested_comment',
            parent_id: 't1_comment_with_replies',
            body: 'This is a nested reply',
            depth: 1,
            replies: '',
          },
        },
      ],
    },
  } as RedditListing<RedditComment>,
};

/**
 * Mock OP Comment (comment from original poster)
 */
export const mockOPComment: RedditComment = {
  ...mockComment,
  id: 'op_comment',
  author: 'testuser', // Same as post author
  is_submitter: true,
};

/**
 * Mock Pinned Comment
 */
export const mockPinnedComment: RedditComment = {
  ...mockComment,
  id: 'pinned_comment',
  stickied: true,
};

/**
 * Mock Reddit Listing (posts)
 */
export const mockPostsListing: RedditListing = {
  kind: 'Listing',
  data: {
    after: 't3_next123',
    before: null,
    children: [
      { kind: 't3', data: mockPost },
      { kind: 't3', data: mockSelfPost },
    ],
  },
};

/**
 * Mock Empty Listing
 */
export const mockEmptyListing: RedditListing = {
  kind: 'Listing',
  data: {
    after: null,
    before: null,
    children: [],
  },
};
