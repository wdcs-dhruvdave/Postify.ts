'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, MessageCircle, ThumbsDown } from 'lucide-react'
import { Post } from '@/types/post.types'

interface PostCardProps {
  post: Post;
  onLikeToggle: (postId: string) => void;
  onDislikeToggle: (postId: string) => void;
  onCommentClick: (postId: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const PostCard = ({ post, onLikeToggle, onDislikeToggle,onCommentClick }: PostCardProps) => {
  const likeColor = post.user_has_liked ? 'text-red-500' : 'text-gray-500';
  const dislikeColor = post.user_has_disliked ? 'text-blue-500' : 'text-gray-500';

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6"
    >
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <Image
          src={post.author.avatar_url || '/default-avatar.png'}
          alt={post.author.name}
          width={40}
          height={40}
          className="rounded-full mr-4"
        />
        <div>
          <p className="font-bold text-gray-800">{post.author.name}</p>
          <p className="text-sm text-gray-500">
            @{post.author.username} · {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
      <p className="text-gray-700 mb-4">{post.content_text}</p>
      
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

      {/* Post Footer */}
      <div className="flex items-center text-gray-500 space-x-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onLikeToggle(post.id)}
          className={`flex items-center space-x-2 ${likeColor} hover:text-red-500 transition-colors`}
        >
          {/* --- UPDATED --- */}
          <Heart 
            size={20} 
            fill={post.user_has_liked ? 'currentColor' : 'none'} 
          />
          <span>{post.likes_count}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDislikeToggle(post.id)}
          className={`flex items-center space-x-2 ${dislikeColor} hover:text-blue-500 transition-colors`}
        >
          {/* --- UPDATED --- */}
          <ThumbsDown 
            size={20} 
            fill={post.user_has_disliked ? 'currentColor' : 'none'}
          />
          <span>{post.dislikes_count}</span>
        </motion.button>

        <motion.button
          onClick={() => onCommentClick(post.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={20} />
          <span>{post.comments_count}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};