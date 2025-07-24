"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PostCard } from "@/components/Postcard";
import { PostCardSkeleton } from "@/components/PostCardSkeleton";
import { Post } from "@/types/post.types";
import { CreatePostModal } from "@/components/CreatePostModal";
import { getPosts } from "@/utils/postApi";
import toast from "react-hot-toast";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  console.log("🚀 ~ FeedPage ~ posts:", posts);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts.posts);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Colud not Fetch Posts.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  console.log("test");

  return (
    <>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={fetchPosts}
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

          <motion.div>
            {loading
              ? [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)
              : posts.map((post) => <PostCard key={post.id} post={post} />)}
          </motion.div>
        </main>
      </div>
    </>
  );
}
