"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, MessageCircle, MoreHorizontal, ThumbsDown } from "lucide-react";
import { Post } from "@/types/post.types";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLikeToggle: (postId: string, isLiked: boolean, likesCount: number) => void;
  onDislikeToggle: (
    postId: string,
    isDisliked: boolean,
    dislikesCount: number,
  ) => void;
  onCommentClick: (postId: string) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const PostCard = ({
  post,
  currentUserId,
  onLikeToggle,
  onDislikeToggle,
  onCommentClick,
  onEdit,
  onDelete,
}: PostCardProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthor = !!currentUserId && currentUserId === post.author.id;

  console.log(post.created_at);

  const likeColor = post.user_has_liked ? "text-red-500" : "text-gray-500";
  const dislikeColor = post.user_has_disliked
    ? "text-blue-500"
    : "text-gray-500";

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6 relative"
    >
      {isAuthor && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <MoreHorizontal size={20} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10">
              <button
                onClick={() => {
                  onEdit(post);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(post.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center mb-4">
        <Image
          src={
            post.author.avatar_url ||
            "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          }
          alt={post.author.name || post.author.username}
          width={40}
          height={40}
          className="rounded-full mr-4"
        />
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => router.push(`/profile/${post.author.username}`)}
        >
          <p className="font-bold text-gray-800">
            {post?.author?.name?.trim() ||
              post?.author?.username ||
              "Anonymous User"}
          </p>
          <p className="text-sm text-gray-500">
            @{post.author.username} ·{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">
        {post.content_text}
      </p>

      {post.image_url && (
        <div className="relative w-full h-80 rounded-lg overflow-hidden mb-4">
          <Image
            src={post.image_url}
            alt="Post image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}

      <div className="flex items-center text-gray-500 space-x-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            onLikeToggle(post.id, post.user_has_liked, post.likes_count)
          }
          className={`flex items-center space-x-2 ${likeColor} hover:text-red-500 transition-colors`}
        >
          <Heart
            size={20}
            fill={post.user_has_liked ? "currentColor" : "none"}
          />
          <span>{post.likes_count}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            onDislikeToggle(
              post.id,
              post.user_has_disliked,
              post.dislikes_count,
            )
          }
          className={`flex items-center space-x-2 ${dislikeColor} hover:text-blue-500 transition-colors`}
        >
          <ThumbsDown
            size={20}
            fill={post.user_has_disliked ? "currentColor" : "none"}
          />
          <span>{post.dislikes_count}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onCommentClick(post.id)}
          className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={20} />
          <span>{post.comments_count}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
