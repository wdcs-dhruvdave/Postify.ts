"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PostCard } from "@/components/Postcard";
import { PostCardSkeleton } from "@/components/PostCardSkeleton";
import { CreatePostModal } from "@/components/CreatePostModal";
import { CommentModal } from "@/components/CommentModal";
import { isAuthenticated } from "@/utils/auth";
import { usePosts } from "@/utils/hooks/usePost";
import { RightSidebar } from "@/components/RightSidebar";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { CreatePostWidget } from "@/components/CreatePostWidget";
import { Post } from "@/types/post.types";
import { PublicUser } from "@/types/user.type";
import Sidebar from "@/components/Sidebar";
import { deletePost } from "@/utils/postApi";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function FeedPage() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const {
    posts,
    setPosts,
    loading,
    addPost,
    toggleLike,
    toggleDislike,
    loadMorePosts,
    hasNextPage,
  } = usePosts(loggedIn);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingCommentsOfPostId, setViewingCommentsOfPostId] = useState<
    string | null
  >(null);
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    const authStatus = isAuthenticated();
    setLoggedIn(authStatus);

    if (authStatus) {
      const userData = localStorage.getItem("user");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  useEffect(() => {
    if (inView && !loading && hasNextPage) {
      loadMorePosts();
    }
  }, [inView, loading, hasNextPage, loadMorePosts]);

  const handleDeletePost = useCallback(
    async (postId: string) => {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      try {
        await deletePost(postId);
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
        toast.success("Post deleted successfully.");
      } catch (error: unknown) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Failed to delete post.");
      }
    },
    [setPosts],
  );

  return (
    <>
      <CommentModal
        postId={viewingCommentsOfPostId}
        onClose={() => setViewingCommentsOfPostId(null)}
      />
      {loggedIn && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPostCreated={addPost}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block lg:col-span-1">
              <Sidebar />
            </aside>

            <main className="col-span-1 lg:col-span-2">
              {loggedIn === null ? (
                [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)
              ) : (
                <>
                  {loggedIn ? (
                    <CreatePostWidget
                      openFullModal={() => setIsCreateModalOpen(true)}
                      onPostCreated={addPost}
                      avatar_url={currentUser?.avatar_url}
                    />
                  ) : (
                    <WelcomeBanner />
                  )}

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={currentUser?.id}
                        onEdit={setPostToEdit}
                        onDelete={handleDeletePost}
                        onLikeToggle={toggleLike}
                        onDislikeToggle={toggleDislike}
                        onCommentClick={setViewingCommentsOfPostId}
                      />
                    ))}
                  </motion.div>

                  {hasNextPage && !loading && (
                    <div ref={ref} className="h-10" />
                  )}

                  {loading &&
                    posts.length > 0 &&
                    [...Array(3)].map((_, i) => (
                      <PostCardSkeleton key={`skeleton-${i}`} />
                    ))}

                  {!loading && !hasNextPage && posts.length > 0 && (
                    <div className="text-center py-10 text-gray-500">
                      You&#39;ve reached the end!
                    </div>
                  )}

                  {!loading && posts.length === 0 && (
                    <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Your Feed is Empty
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Follow some users to see their posts here!
                      </p>
                    </div>
                  )}
                </>
              )}
            </main>

            {loggedIn && (
              <div className="hidden lg:block lg:col-span-1">
                <RightSidebar />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
