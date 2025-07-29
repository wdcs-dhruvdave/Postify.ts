"use client";

import { useState, useEffect } from "react";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function FeedPage() {
  const { posts, loading, addPost, toggleLike, toggleDislike } = usePosts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingCommentsOfPostId, setViewingCommentsOfPostId] = useState<
    string | null
  >(null);

  // State to manage login status, avoids hydration errors
  const [loggedIn, setLoggedIn] = useState(false);

  // This effect runs only on the client-side after the component has mounted
  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

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
            {/* --- Left Sidebar (Placeholder) --- */}
            <aside className="hidden lg:block lg:col-span-1">
              {/* You can place your LeftSidebar component here */}
            </aside>

            {/* --- Main Feed Content (Center Column) --- */}
            <main className="col-span-1 lg:col-span-2">
              {loggedIn ? (
                <CreatePostWidget onClick={() => setIsCreateModalOpen(true)} />
              ) : (
                <WelcomeBanner />
              )}

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {loading ? (
                  [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)
                ) : posts.length > 0 ? (
                  posts.map((post: Post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLikeToggle={toggleLike}
                      onDislikeToggle={toggleDislike}
                      onCommentClick={setViewingCommentsOfPostId}
                    />
                  ))
                ) : (
                  // Empty State for logged-in users with no posts in their feed
                  <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Your Feed is Empty
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Follow some users to see their posts here!
                    </p>
                  </div>
                )}
              </motion.div>
            </main>

            {/* --- Right Sidebar --- */}
            <div className="hidden lg:block lg:col-span-1">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
