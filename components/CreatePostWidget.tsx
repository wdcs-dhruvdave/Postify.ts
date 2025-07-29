"use client";
import { Plus } from "lucide-react";

export const CreatePostWidget = ({ onClick }: { onClick: () => void }) => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center">
    <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
    <button
      onClick={onClick}
      className="w-full text-left text-gray-500 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition"
    >
      What&apos;s on your mind?
    </button>
    <button
      onClick={onClick}
      className="ml-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
    >
      <Plus size={20} />
    </button>
  </div>
);
