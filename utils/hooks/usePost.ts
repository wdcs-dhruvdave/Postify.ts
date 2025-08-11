import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Post } from "@/types/post.types";
import {
  getFeed,
  likePost,
  unlikePost,
  dislikePost,
  undislikePost,
  getPosts,
} from "@/utils/postApi";
import { isAuthenticated } from "@/utils/auth";

export const usePosts = (isLoggedIn: boolean | null) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn === null) {
      return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const fetchedPosts = isLoggedIn
          ? await getFeed()
          : (await getPosts()).posts;
        setPosts(fetchedPosts);
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
        else toast.error("Could not fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [isLoggedIn]);

  const addPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const toggleLike = (postId: string) => {
    if (!isAuthenticated()) return toast.error("Please log in to like posts.");
    const originalPosts = [...posts];
    const post = originalPosts.find((p) => p.id === postId);
    if (!post) return;

    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes_count: p.user_has_liked
                ? p.likes_count - 1
                : p.likes_count + 1,
              dislikes_count: p.user_has_disliked
                ? p.dislikes_count - 1
                : p.dislikes_count,
              user_has_liked: !p.user_has_liked,
              user_has_disliked: false,
            }
          : p,
      ),
    );

    const apiCall = post.user_has_liked ? unlikePost : likePost;
    apiCall(postId).catch(() => {
      toast.error("Failed to update like.");
      setPosts(originalPosts);
    });
  };

  const toggleDislike = (postId: string) => {
    if (!isAuthenticated())
      return toast.error("Please log in to dislike posts.");
    const originalPosts = [...posts];
    const post = originalPosts.find((p) => p.id === postId);
    if (!post) return;

    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              dislikes_count: p.user_has_disliked
                ? p.dislikes_count - 1
                : p.dislikes_count + 1,
              likes_count: p.user_has_liked ? p.likes_count - 1 : p.likes_count,
              user_has_disliked: !p.user_has_disliked,
              user_has_liked: false,
            }
          : p,
      ),
    );

    const apiCall = post.user_has_disliked ? undislikePost : dislikePost;
    apiCall(postId).catch(() => {
      toast.error("Failed to update dislike.");
      setPosts(originalPosts);
    });
  };

  return { posts, loading, addPost, toggleLike, toggleDislike };
};
