import { motion } from "framer-motion";
import { useState } from "react";

export const FollowButton = ({
  authorId,
  currentUserId,
}: {
  authorId: string;
  currentUserId?: string;
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleToggleFollow = () => {
    // TODO: connect with backend API
    console.log(
      "Toggle follow for author:",
      authorId,
      "by user:",
      currentUserId,
    );
    setIsFollowing((prev) => !prev);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggleFollow}
      className={`px-4 py-1 rounded-full text-sm font-medium border transition
        ${isFollowing ? "bg-gray-200 text-gray-700 border-gray-300" : "bg-blue-500 text-white border-blue-500"}
      `}
    >
      {isFollowing ? "Following" : "Follow"}
    </motion.button>
  );
};
