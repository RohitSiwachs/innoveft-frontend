"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const result = await register(formData.email, formData.password, formData.name);
    
    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error || "Registration failed. Please try again.");
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
          Create Account
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Register to start managing your tasks
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-semibold text-gray-800">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`text-black px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 focus:outline-none ${
                errors.name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
              } placeholder:text-gray-400`}
            />
            {errors.name && (
              <span className="text-sm text-red-600 font-medium">{errors.name}</span>
            )}
          </div>

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
              className={`text-black px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 focus:outline-none ${
                errors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
              } placeholder:text-gray-400`}
            />
            {errors.email && (
              <span className="text-sm text-red-600 font-medium">{errors.email}</span>
            )}
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
              className={`text-black px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 focus:outline-none ${
                errors.password
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
              } placeholder:text-gray-400`}
            />
            {errors.password && (
              <span className="text-sm text-red-600 font-medium">{errors.password}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="font-semibold text-gray-800">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`text-black px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 focus:outline-none ${
                errors.confirmPassword
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
              } placeholder:text-gray-400`}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-600 font-medium">{errors.confirmPassword}</span>
            )}
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
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
