"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { PostCard } from "@/components/post/Postcard";
import { PostCardSkeleton } from "@/components/post/PostCardSkeleton";
import { CreatePostModal } from "@/components/post/CreatePostModal";
import { CommentModal } from "@/components/comment/CommentModal";
import { usePosts } from "@/utils/hooks/usePost";
import { isAuthenticated } from "@/utils/auth";
import { useInView } from "react-intersection-observer";
import { PublicUser } from "@/types/user.type";
import Sidebar from "@/components/layout/Sidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { RightSidebarSkeleton } from "@/components/layout/RightSidebarSkeleton";
import { CreatePostWidget } from "@/components/post/CreatePostWidget";
import { WelcomeBanner } from "@/components/layout/WelcomeBanner";

const postVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ForYouPage() {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: false });

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCommentsOfPostId, setViewingCommentsOfPostId] = useState<
    string | null
  >(null);

  const {
    posts,
    loading,
    addPost,
    updatePostInState,
    toggleLike,
    toggleDislike,
    loadMorePosts,
    hasNextPage,
  } = usePosts(loggedIn, "recommended");

  useEffect(() => {
    const authStatus = isAuthenticated();
    setLoggedIn(authStatus);

    if (authStatus) {
      const userData = localStorage.getItem("user");
      if (userData) setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (inView && !loading && hasNextPage) loadMorePosts();
  }, [inView, loading, hasNextPage, loadMorePosts]);

  const handleOpenCreateModal = () => {
    setPostToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setPostToEdit(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPostToEdit(null);
  };

  const handlePostUpdated = (updatedPost) => {
    updatePostInState(updatedPost);
  };

  const renderSkeletons = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <CommentModal
        postId={viewingCommentsOfPostId}
        onClose={() => setViewingCommentsOfPostId(null)}
      />

      {loggedIn && (
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onPostCreated={postToEdit ? handlePostUpdated : addPost}
          postToEdit={postToEdit}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block lg:col-span-1">
              <Sidebar />
            </aside>

            <main className="col-span-1 lg:col-span-2">
              {loggedIn === null || (loading && posts.length === 0) ? (
                renderSkeletons()
              ) : (
                <>
                  {loggedIn ? (
                    <CreatePostWidget
                      openFullModal={handleOpenCreateModal}
                      onPostCreated={addPost}
                      avatar_url={currentUser?.avatar_url}
                    />
                  ) : (
                    <WelcomeBanner />
                  )}

                  {posts.length > 0 ? (
                    <div className="mt-6 space-y-6">
                      <AnimatePresence>
                        {posts.map((post) => (
                          <motion.div
                            key={post.id}
                            variants={postVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                          >
                            <PostCard
                              post={post}
                              currentUserId={currentUser?.id}
                              onEdit={handleOpenEditModal}
                              onDelete={() =>
                                toast.error("Cannot delete recommended posts.")
                              }
                              onLikeToggle={toggleLike}
                              onDislikeToggle={toggleDislike}
                              onCommentClick={setViewingCommentsOfPostId}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {loading && hasNextPage && (
                        <div className="space-y-4">
                          {[...Array(2)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <PostCardSkeleton />
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {hasNextPage && !loading && (
                        <div ref={ref} className="h-10" />
                      )}
                    </div>
                  ) : (
                    !loading && (
                      <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Not Enough Data Yet
                        </h3>
                        <p className="text-gray-500 mt-2">
                          Like, follow, and comment on a few more posts to help
                          us build your personalized feed!
                        </p>
                      </div>
                    )
                  )}
                </>
              )}
            </main>

            <div className="hidden lg:block lg:col-span-1">
              {loggedIn === null ? <RightSidebarSkeleton /> : <RightSidebar />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
