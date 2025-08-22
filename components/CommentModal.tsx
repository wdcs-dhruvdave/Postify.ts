"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Comment } from "@/types/comment.type";
import { getComments, createComment } from "../utils/postApi";
import Image from "next/image";

interface CommentModalProps {
  postId: string | null;
  onClose: () => void;
}

export const CommentModal = ({ postId, onClose }: CommentModalProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      const fetchComments = async () => {
        try {
          setLoading(true);
          const fetchedComments = await getComments(postId);
          setComments(fetchedComments);
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message || "Failed to fetch post.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchComments();
    }
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !postId) return;

    try {
      const createdComment = await createComment(postId, newComment);
      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to fetch feed.");
      }
    }
  };

  return (
    <AnimatePresence>
      {postId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg h-[70vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-blue-700">Comments</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <p>Loading...</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Image
                      src={
                        comment.author.avatar_url ||
                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                      }
                      alt={
                        comment.author.name ||
                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                      }
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                      <p className="font-semibold text-sm text-gray-800">
                        {comment.author.username}
                      </p>
                      <p className="text-gray-700">{comment.content_text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSubmitComment}
              className="p-4 border-t flex items-center space-x-2"
            >
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
