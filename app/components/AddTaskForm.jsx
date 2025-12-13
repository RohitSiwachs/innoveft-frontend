"use client";

import React, { useState } from "react";
import { taskAPI } from "../lib/api";

export default function AddTaskForm({ onTaskAdded, loading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "OPEN",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await taskAPI.create({
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
      });

      if (result.success) {
        onTaskAdded(result.data);
        setSuccessMessage("Task added successfully!");
        setFormData({
          title: "",
          description: "",
          status: "OPEN",
        });

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(result.error || "Failed to add task. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add task. Please try again."
      );
      console.error("Error adding task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-in slide-in-from-right duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New Task
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="font-semibold text-gray-800">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className={`text-black px-4 py-3 border-2 rounded-lg text-base font-family-inherit transition-all duration-300 focus:outline-none ${
              errors.title
                ? "border-red-500 bg-red-50 focus:shadow-sm focus:shadow-red-500/20"
                : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
            } placeholder:text-gray-400`}
          />
          {errors.title && (
            <span className="text-sm text-red-600 font-medium animate-in slide-in-from-top">
              {errors.title}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="font-semibold text-gray-800">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description (optional)"
            rows={3}
            className="text-black px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-family-inherit transition-all duration-300 focus:outline-none focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20 placeholder:text-gray-400 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="font-semibold text-gray-800">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="text-black px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-family-inherit transition-all duration-300 focus:outline-none focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20 bg-white"
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="mt-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-xl hover:enabled:shadow-purple-500/40 active:enabled:translate-y-0"
        >
          {isSubmitting ? "Adding Task..." : "Add Task"}
        </button>

        {successMessage && (
          <div className="px-4 py-3 bg-green-100 text-green-800 border border-green-300 rounded-lg font-medium text-center animate-in slide-in-from-top">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="px-4 py-3 bg-red-100 text-red-800 border border-red-300 rounded-lg font-medium text-center animate-in slide-in-from-top">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}
