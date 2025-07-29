"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { PostCard } from "@/components/Postcard";
import { Post } from "@/types/post.types";
import { UserProfile } from "@/types/user.type";
import {
  getUserProfile,
  getUserPosts,
  followUser,
  unfollowUser,
} from "@/utils/userApi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, postsData] = await Promise.all([
          getUserProfile(username),
          getUserPosts(username),
        ]);
        setProfile(profileData);
        setPosts(postsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unexpected error occurred while loading profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const handleToggleFollow = async () => {
    if (!profile) return;

    const isCurrentlyFollowing = profile.is_following;
    const apiCall = isCurrentlyFollowing ? unfollowUser : followUser;

    const originalProfile = { ...profile };

    setProfile((prevProfile) => {
      if (!prevProfile) return null;
      return {
        ...prevProfile,
        is_following: !isCurrentlyFollowing,
        followers_count: isCurrentlyFollowing
          ? prevProfile.followers_count - 1
          : prevProfile.followers_count + 1,
      };
    });

    try {
      await apiCall(profile.id);
      toast.success(
        isCurrentlyFollowing
          ? `Unfollowed @${profile.username}`
          : `Followed @${profile.username}`,
      );
    } catch (err: unknown) {
      setProfile(originalProfile);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred while updating follow status.");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-20">User not found.</div>;
  }

  const isFollowing = profile.is_following;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="flex items-center">
            <Image
              src={profile.avatar_url || "/default-avatar.png"}
              alt={profile.name || profile.username}
              width={128}
              height={128}
              className="rounded-full mr-8 border-4 border-blue-500"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name || profile.username}
                  </h1>
                  <p className="text-md text-gray-500">@{profile.username}</p>
                </div>
                <button
                  onClick={handleToggleFollow}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                    isFollowing
                      ? "bg-white text-blue-600 border border-blue-600"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
              <p className="text-gray-700 mt-4">
                {profile.bio || "No bio available."}
              </p>
              <div className="flex space-x-6 mt-4 text-gray-600">
                <span>
                  <span className="font-bold text-gray-800">
                    {posts.length}
                  </span>{" "}
                  Posts
                </span>
                <span>
                  <span className="font-bold text-gray-800">
                    {profile.followers_count}
                  </span>{" "}
                  Followers
                </span>
                <span>
                  <span className="font-bold text-gray-800">
                    {profile.following_count}
                  </span>{" "}
                  Following
                </span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={() =>
                  toast.error("Liking from profile page not yet implemented.")
                }
                onDislikeToggle={() =>
                  toast.error(
                    "Disliking from profile page not yet implemented.",
                  )
                }
                onCommentClick={() => {
                  /* Open comment modal here */
                }}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">
                This user hasn&apos;t posted anything yet.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
