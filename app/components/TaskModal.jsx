"use client";

import React, { useState } from "react";
import { taskAPI } from "../lib/api";

export default function TaskModal({ task, isOpen, onClose, onTaskUpdated, onTaskDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !task) return null;

  const handleEditClick = () => {
    setEditData({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
    setIsEditing(true);
    setError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editData.title.trim()) {
      setError("Title is required");
      return;
    }

    setIsUpdating(true);
    setError("");

    const result = await taskAPI.update(task.id, {
      title: editData.title,
      description: editData.description || undefined,
      status: editData.status,
    });

    if (result.success) {
      onTaskUpdated(result.data);
      setIsEditing(false);
    } else {
      setError(result.error || "Failed to update task");
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);
    const result = await taskAPI.delete(task.id);
    if (result.success) {
      onTaskDeleted(task.id);
    } else {
      setError(result.error || "Failed to delete task");
    }
    setIsDeleting(false);
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
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Edit Task" : "Task Details"}
          </h2>
          <button
            className="bg-none border-none text-2xl cursor-pointer text-gray-500 transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 hover:text-gray-800 hover:rotate-90"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-100 text-red-800 border border-red-300 rounded-lg font-medium text-center">
              {error}
            </div>
          )}

          {isEditing ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  className="text-black px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  rows={3}
                  className="text-black px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
                  Status
                </label>
                <select
                  name="status"
                  value={editData.status}
                  onChange={handleChange}
                  className="text-black px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 bg-white"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1 mb-4">
                <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
                  Title:
                </label>
                <span className="text-gray-800 text-base bg-gray-50 rounded px-3 py-2">
                  {task.title}
                </span>
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
                  Description:
                </label>
                <span className="text-gray-800 text-base bg-gray-50 rounded px-3 py-2">
                  {task.description || "No description"}
                </span>
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
                  Status:
                </label>
                <span
                  className={`inline-block w-fit px-3 py-1 text-sm font-medium rounded border ${getStatusColor(
                    task.status
                  )}`}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <label className="font-semibold text-purple-600 text-sm uppercase tracking-wide">
                  Created:
                </label>
                <span className="text-gray-800 text-base bg-gray-50 rounded px-3 py-2">
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleEditClick}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
