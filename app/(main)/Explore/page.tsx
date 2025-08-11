"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { PublicUser } from "@/types/user.type";
import { getRandomUsers } from "@/utils/userApi";
import { AuthGuard } from "@/components/AuthGurd";
import { SuggestedUser } from "@/components/RightSidebar";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function ExplorePage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getRandomUsers();
        setUsers(fetchedUsers);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to load users.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">
              Discover New People
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Expand your feed by following other creators in the community.
            </p>
          </div>

          {loading ? (
            <p className="text-center">Loading suggestions...</p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <SuggestedUser user={user} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
