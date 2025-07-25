'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { PostCard } from "@/components/Postcard";
import { PostCardSkeleton } from "@/components/PostCardSkeleton";
import { Post } from "@/types/post.types";
import { CreatePostModal } from "@/components/CreatePostModal";
import { getFeed, likePost, unlikePost, dislikePost, undislikePost } from "@/utils/postApi";
import { CommentModal } from "@/components/CommentModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCommentsOfPostId, setViewingCommentsOfPostId] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      const fetchedPosts = await getFeed();
      setPosts(fetchedPosts);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Could not fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleLikeToggle = (postId: string) => {
    const originalPosts = [...posts];
    const post = originalPosts.find(p => p.id === postId);
    if (!post) return;

    setPosts(posts.map(p =>
      p.id === postId ? {
        ...p,
        likes_count: p.user_has_liked ? p.likes_count - 1 : p.likes_count + 1,
        dislikes_count: p.user_has_disliked ? p.dislikes_count - 1 : p.dislikes_count,
        user_has_liked: !p.user_has_liked,
        user_has_disliked: false,
      } : p
    ));

    const apiCall = post.user_has_liked ? unlikePost : likePost;
    apiCall(postId).catch(() => {
      toast.error("Failed to update like.");
      setPosts(originalPosts);
    });
  };
  
  const handleDislikeToggle = (postId: string) => {
    const originalPosts = [...posts];
    const post = originalPosts.find(p => p.id === postId);
    if (!post) return;

    setPosts(posts.map(p =>
      p.id === postId ? {
        ...p,
        dislikes_count: p.user_has_disliked ? p.dislikes_count - 1 : p.dislikes_count + 1,
        likes_count: p.user_has_liked ? p.likes_count - 1 : p.likes_count,
        user_has_disliked: !p.user_has_disliked,
        user_has_liked: false,
      } : p
    ));

    const apiCall = post.user_has_disliked ? undislikePost : dislikePost;
    apiCall(postId).catch(() => {
      toast.error("Failed to update dislike.");
      setPosts(originalPosts);
    });
  };

  return (
    <>
    <CommentModal 
        postId={viewingCommentsOfPostId}
        onClose={() => setViewingCommentsOfPostId(null)} 
      />
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
        <main className="max-w-2xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700">Home Feed</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
            >
              Create Post
            </button>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading
              ? [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)
              : posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLikeToggle={handleLikeToggle}
                    onDislikeToggle={handleDislikeToggle}
                    onCommentClick={setViewingCommentsOfPostId}
                  />
                ))}
          </motion.div>
        </main>
      </div>
    </>
  );
}