export const postEndpoints = {
  list: "/posts",
  categories: "/posts/categories",
  feed: "/posts/feed",
  like: "/posts/:postId/like",
  dislike: "/posts/:postId/dislike",
  userPosts: "/posts/user/:username",
  likers: "/posts/:id/likers",
  dislikers: "/posts/:id/dislikers",
};
