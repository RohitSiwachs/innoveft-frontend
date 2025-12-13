"use client";

import React from "react";

export default function UserList({ users, onUserClick, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white p-10 rounded-xl shadow-lg text-center text-purple-600 font-medium animate-pulse">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-lg text-red-600 border-l-4 border-red-600 animate-in slide-in-from-left">
        Error: {error}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white p-10 rounded-xl shadow-lg text-center text-gray-500 font-medium">
        coud't fetch user
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg animate-in slide-in-from-left duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">Users</h2>
      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg cursor-pointer transition-all duration-300 border-l-4 border-purple-600 hover:translate-x-1 hover:shadow-md hover:bg-linear-to-r hover:from-purple-500 hover:to-pink-500 group"
            onClick={() => onUserClick(user)}
          >
            <div className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-white transition-colors">
              {user.name}
            </div>
            <div className="text-sm text-gray-600 mb-1 group-hover:text-white transition-colors">
              {user.email}
            </div>
            <div className="text-xs text-gray-500 group-hover:text-white transition-colors">
              {user.address?.city || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
