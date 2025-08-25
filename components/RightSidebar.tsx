"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  getFollowSuggestions,
  searchUsers,
  followUser,
  unfollowUser,
} from "@/utils/userApi";
import { PublicUser } from "@/types/user.type";
import toast from "react-hot-toast";

export const SuggestedUser = ({
  user,
  isFollowing,
}: {
  user: PublicUser;
  isFollowing?: boolean;
}) => {
  const [isFollowed, setIsFollowed] = useState(
    isFollowing || user.is_following || false,
  );

  useEffect(() => {
    setIsFollowed(isFollowing || user.is_following || false);
  }, [isFollowing, user.is_following]);

  const handleToggleFollow = async () => {
    const originalFollowState = isFollowed;
    const apiCall = originalFollowState ? unfollowUser : followUser;

    setIsFollowed(!originalFollowState);

    try {
      await apiCall(user.id);
      toast.success(
        originalFollowState
          ? `Unfollowed @${user.username}`
          : `Followed @${user.username}`,
      );
    } catch (error) {
      setIsFollowed(originalFollowState);
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const buttonText = isFollowed ? "Following" : "Follow";
  const buttonStyle = isFollowed
    ? "bg-white text-blue-600 border border-blue-600"
    : "bg-blue-100 text-blue-600";

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`/profile/${user.username}`}
        className="flex items-center space-x-3 group"
      >
        <Image
          src={
            user.avatar_url ||
            "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          }
          alt={user.name || user.username}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-bold text-sm text-gray-800 group-hover:underline">
            {user.name || user.username}
          </p>
          <p className="text-xs text-gray-500">@{user.username}</p>
        </div>
      </Link>
      <button
        onClick={handleToggleFollow}
        className={`px-3 py-1 text-xs font-bold rounded-full hover:opacity-80 transition ${buttonStyle}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export const RightSidebar = () => {
  const [suggestions, setSuggestions] = useState<PublicUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await getFollowSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      }
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const usersToShow = searchQuery.trim() ? searchResults : suggestions;

  return (
    <aside className="w-80 hidden lg:block space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
        <h3 className="font-bold text-gray-800">
          {searchQuery.trim() ? "Search Results" : "Who to Follow"}
        </h3>

        {isSearching && <p className="text-sm text-gray-500">Searching...</p>}

        {!isSearching && searchQuery.trim() && searchResults.length === 0 && (
          <p className="text-sm text-gray-500">No users found.</p>
        )}

        {usersToShow.map((user) => (
          <SuggestedUser key={user.id} user={user} />
        ))}
      </div>
    </aside>
  );
};
