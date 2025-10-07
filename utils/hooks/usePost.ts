"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Post } from "@/types/post.types";
import {
  getFeed,
  getRecommendedPosts,
  getPosts,
  likePost,
  unlikePost,
  dislikePost,
  undislikePost,
  deletePost,
} from "@/utils/Apis/postApi";
import { isAuthenticated } from "@/utils/auth";
import { MESSAGES } from "@/constants/index";

type Mode = "feed" | "recommended" | "public";

export const usePosts = (isLoggedIn: boolean | null, mode: Mode = "feed") => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchPosts = useCallback(
    async (pageNum: number) => {
      if (pageNum > 1 && !hasNextPage) return;

      setLoading(true);
      try {
        let apiCall;
        if (mode === "feed" && isLoggedIn) {
          apiCall = getFeed;
        } else if (mode === "recommended") {
          apiCall = getRecommendedPosts;
        } else {
          apiCall = getPosts;
        }

        const data = await apiCall(pageNum);

        if (data.posts.length === 0) {
          setHasNextPage(false);
        } else {
          setPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newUniquePosts = data.posts.filter(
              (p) => !existingIds.has(p.id),
            );
            return pageNum === 1 ? data.posts : [...prev, ...newUniquePosts];
          });
          setPage(pageNum);
        }
        setHasNextPage(data.pagination.hasNextPage);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error(MESSAGES.ERROR.FETCH_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, mode, hasNextPage],
  );

  useEffect(() => {
    if (isLoggedIn !== null || mode === "recommended") {
      setPosts([]);
      setPage(1);
      setHasNextPage(true);
      fetchPosts(1);
    }
  }, [isLoggedIn, mode, fetchPosts]);

  const loadMorePosts = useCallback(() => {
    if (!loading && hasNextPage) {
      fetchPosts(page + 1);
    }
  }, [loading, hasNextPage, page, fetchPosts]);

  const addPost = useCallback((newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, []);

  const updatePostInState = useCallback((updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
    );
  }, []);

  const removePost = useCallback(
    async (postId: string) => {
      if (!window.confirm(MESSAGES.CONFIRMATIONS.DELETE_POST)) return;
      const originalPosts = posts;
      setPosts((prev) => prev.filter((p) => p.id !== postId)); // Optimistic update
      try {
        await deletePost(postId);
        toast.success(MESSAGES.SUCCESS.POST_DELETED);
      } catch (error) {
        setPosts(originalPosts);
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [posts],
  );

  const toggleLike = useCallback((postId: string) => {
    if (!isAuthenticated())
      return toast.error(MESSAGES.ERROR.LOGIN_REQUIRED_LIKE);

    let originalPosts: Post[] = [];
    setPosts((currentPosts) => {
      originalPosts = [...currentPosts];
      const post = originalPosts.find((p) => p.id === postId);
      if (!post) return currentPosts;

      const apiCall = post.user_has_liked ? unlikePost : likePost;
      apiCall(postId).catch(() => {
        toast.error(MESSAGES.ERROR.LIKE_UPDATE_FAILED);
        setPosts(originalPosts);
      });

      return currentPosts.map((p) =>
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
      );
    });
  }, []);

  const toggleDislike = useCallback((postId: string) => {
    if (!isAuthenticated())
      return toast.error(MESSAGES.ERROR.LOGIN_REQUIRED_DISLIKE);
    let originalPosts: Post[] = [];
    setPosts((currentPosts) => {
      originalPosts = [...currentPosts];
      const post = originalPosts.find((p) => p.id === postId);
      if (!post) return currentPosts;

      const apiCall = post.user_has_disliked ? undislikePost : dislikePost;
      apiCall(postId).catch(() => {
        toast.error(MESSAGES.ERROR.DISLIKE_UPDATE_FAILED);
        setPosts(originalPosts);
      });

      return currentPosts.map((p) =>
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
      );
    });
  }, []);

  return {
    posts,
    loading,
    addPost,
    updatePostInState,
    removePost,
    toggleLike,
    toggleDislike,
    loadMorePosts,
    hasNextPage,
  };
};
