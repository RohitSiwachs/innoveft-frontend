"use client";

import React from "react";

export default function UserModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-11/12 animate-in slide-in-from-bottom duration-400"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">User Details</h2>
          <button
            className="bg-none border-none text-2xl cursor-pointer text-gray-500 transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 hover:text-gray-800 hover:rotate-90"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-1 mb-4">
            <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
              Name:
            </label>
            <span className="text-gray-800 text-base bg-gray-50 rounded px-3 py-2">
              {user.name}
            </span>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
              Email:
            </label>
            <span className="text-gray-800 text-base bg-gray-50 rounded px-3 py-2 break-all">
              {user.email}
            </span>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
              Phone:
            </label>
            <span className="text-gray-800 text-base bg-gray-50 rounded px-3 py-2">
              {user.phone || "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
              Website:
            </label>
            <span className="text-gray-800 text-base bg-gray-50 rounded px-3 py-2">
              {user.website || "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
              Company:
            </label>
            <span className="text-gray-800 text-base bg-gray-50 rounded px-3 py-2">
              {user.company?.name || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
