"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-pink-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-pink-600 flex items-center justify-center p-5">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom duration-500">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Login to manage your tasks
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-semibold text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="text-black px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20 placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="text-black px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20 placeholder:text-gray-400"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-100 text-red-800 border border-red-300 rounded-lg font-medium text-center animate-in slide-in-from-top">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-xl hover:enabled:shadow-purple-500/40 active:enabled:translate-y-0"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
