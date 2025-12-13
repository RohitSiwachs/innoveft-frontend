"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../lib/api";
import TaskList from "./TaskList";
import SearchBar from "./SearchBar";
import TaskModal from "./TaskModal";
import AddTaskForm from "./AddTaskForm";

export default function Home() {
  const { isAuthenticated, loading: authLoading, logout, user } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getLoading, setGetLoading] = useState(true);
  const [getError, setGetError] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated && isMounted) {
      window.location.href = "/login";
    }
  }, [authLoading, isAuthenticated, isMounted]);

  // Fetch tasks on component mount
  useEffect(() => {
    if (!isMounted || !isAuthenticated) return;

    const fetchTasks = async () => {
      try {
        setGetLoading(true);
        setGetError(null);
        const result = await taskAPI.getAll();
        if (result.success) {
          setAllTasks(result.data);
          setFilteredTasks(result.data);
        } else {
          setGetError(result.error || "Failed to fetch tasks");
        }
      } catch (error) {
        setGetError(error.message || "Failed to fetch tasks. Please try again.");
        console.error("Error fetching tasks:", error);
      } finally {
        setGetLoading(false);
      }
    };

    fetchTasks();
  }, [isMounted, isAuthenticated]);

  // Handle search with debounce (filtering local data)
  const handleSearch = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) {
        setFilteredTasks(allTasks);
      } else {
        const filtered = allTasks.filter((task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTasks(filtered);
      }
    },
    [allTasks]
  );

  // Handle task click to open modal
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Handle new task added
  const handleTaskAdded = (newTask) => {
    setAllTasks((prev) => [newTask, ...prev]);
    setFilteredTasks((prev) => [newTask, ...prev]);
  };

  // Handle task updated
  const handleTaskUpdated = (updatedTask) => {
    setAllTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setFilteredTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setSelectedTask(updatedTask);
  };

  // Handle task deleted
  const handleTaskDeleted = (taskId) => {
    setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
    setFilteredTasks((prev) => prev.filter((t) => t.id !== taskId));
    handleCloseModal();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Show loading while checking auth
  if (authLoading || !isMounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-pink-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-pink-600 p-5"
    >
      <header className="text-center mb-10 animate-in slide-in-from-top duration-500 relative">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          Task Management System
        </h1>
        <p className="text-white/80 mt-2">
          Welcome, {user?.name || user?.email || "User"}
        </p>
        <button
          onClick={handleLogout}
          className="absolute top-0 right-0 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 font-medium"
        >
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-600">
        <div className="flex flex-col gap-5">
          <SearchBar onSearch={handleSearch} placeholder="Search tasks..." />
          <TaskList
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onTaskDeleted={handleTaskDeleted}
            loading={getLoading}
            error={getError}
          />
        </div>

        <div className="flex flex-col">
          <AddTaskForm onTaskAdded={handleTaskAdded} loading={postLoading} />
        </div>
      </main>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </div>
  );
}
