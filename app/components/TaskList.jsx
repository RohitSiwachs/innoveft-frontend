"use client";

import React, { useState } from "react";
import { taskAPI } from "../lib/api";

export default function TaskList({ tasks, onTaskClick, onTaskDeleted, loading, error }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (e, taskId) => {
    e.stopPropagation();
    if (deletingId) return;
    
    setDeletingId(taskId);
    const result = await taskAPI.delete(taskId);
    if (result.success) {
      onTaskDeleted(taskId);
    } else {
      alert(result.error || "Failed to delete task");
    }
    setDeletingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-800 border-green-300";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "DONE":
        return "Done";
      case "IN_PROGRESS":
        return "In Progress";
      default:
        return "Open";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-10 rounded-xl shadow-lg text-center text-purple-600 font-medium animate-pulse">
        Loading tasks...
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

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-10 rounded-xl shadow-lg text-center text-gray-500 font-medium">
        No tasks found. Add a new task to get started!
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg animate-in slide-in-from-left duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">Tasks</h2>
      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg cursor-pointer transition-all duration-300 border-l-4 border-purple-600 hover:translate-x-1 hover:shadow-md hover:bg-linear-to-r hover:from-purple-500 hover:to-pink-500 group relative"
            onClick={() => onTaskClick(task)}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-white transition-colors">
                  {task.title}
                </div>
                {task.description && (
                  <div className="text-sm text-gray-600 mb-2 group-hover:text-white/80 transition-colors line-clamp-2">
                    {task.description}
                  </div>
                )}
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                    task.status
                  )}`}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>
              <button
                onClick={(e) => handleDelete(e, task.id)}
                disabled={deletingId === task.id}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 group-hover:text-white/70 group-hover:hover:text-red-300 group-hover:hover:bg-white/10 disabled:opacity-50"
                title="Delete task"
              >
                {deletingId === task.id ? (
                  <span className="text-xs">...</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
