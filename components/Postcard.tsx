'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, MessageCircle, ThumbsDown } from 'lucide-react'
import { Post } from '@/types/post.types'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6"
    >
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

      <div className="flex items-center text-gray-500 space-x-6">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center space-x-2 hover:text-red-500 transition-colors">
          <Heart size={20} />
          <span>{post.likes_count}</span>
        </motion.button>
        
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center space-x-2 hover:text-gray-400 transition-colors">
          <ThumbsDown size={20} />
          <span>{post.dislikes_count}</span>
        </motion.button>
        
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
          <MessageCircle size={20} />
          <span>{post.comments_count}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};