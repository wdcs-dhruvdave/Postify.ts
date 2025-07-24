'use client'

import { PostFormData } from '@/types/post.types';
import { createPost } from '@/utils/postApi';
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => Promise<void>; 
};

export const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {

    const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>(); 

  const onSubmit = async (data: PostFormData) => {
    try{
        await createPost(data);        
        toast.success('Post created successfully!');
        reset();
        onClose();
    }
    catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message)
      reset()
    } else {
      toast.error('An unexpected error occurred.')
      reset()
    }
  }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b">
              <h3 className="text-xl font-bold text-blue-700">Create a New Post</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="An interesting title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={5}
                  {...register('content_text', { required: 'Content is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What's on your mind?"
                />
                {errors.content_text && <p className="text-red-500 text-sm mt-1">{errors.content_text.message}</p>}
              </div>


              <div className="flex justify-end items-center pt-6 border-t mt-6 space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};