"use client";

import React, { useState } from "react";
import axios from "axios";

export default function AddUserForm({ onUserAdded, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d+$/.test(formData.phone.replace(/[\s\-()]/g, ""))) {
      newErrors.phone = "Phone must contain only numbers";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
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
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            city: formData.city,
          },
        }
      );

      // Call the callback with the new user
      onUserAdded({
        ...response.data,
        address: {
          city: formData.city,
        },
      });

      setSuccessMessage("User added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add user. Please try again."
      );
      console.error("Error adding user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-in slide-in-from-right duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New User
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-semibold text-gray-800">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter user name"
            className={` text-black px-4 py-3 border-2 rounded-lg text-base font-family-inherit transition-all duration-300 focus:outline-none ${
              errors.name
                ? "border-red-500 bg-red-50 focus:shadow-sm focus:shadow-red-500/20"
                : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
            } placeholder:text-gray-400`}
          />
          {errors.name && (
            <span className="text-sm text-red-600 font-medium animate-in slide-in-from-top">
              {errors.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-semibold text-gray-800">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`text-black px-4 py-3 border-2 rounded-lg text-base font-family-inherit transition-all duration-300 focus:outline-none ${
              errors.email
                ? "border-red-500 bg-red-50 focus:shadow-sm focus:shadow-red-500/20"
                : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
            } placeholder:text-gray-400`}
          />
          {errors.email && (
            <span className="text-sm text-red-600 font-medium animate-in slide-in-from-top">
              {errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="font-semibold text-gray-800">
            Phone *
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className={`text-black  px-4 py-3 border-2 rounded-lg text-base font-family-inherit transition-all duration-300 focus:outline-none ${
              errors.phone
                ? "border-red-500 bg-red-50 focus:shadow-sm focus:shadow-red-500/20"
                : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
            } placeholder:text-gray-400`}
          />
          {errors.phone && (
            <span className="text-sm text-red-600 font-medium animate-in slide-in-from-top">
              {errors.phone}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="font-semibold text-gray-800">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city name"
            className={`text-black  px-4 py-3 border-2 rounded-lg text-base font-family-inherit transition-all duration-300 focus:outline-none ${
              errors.city
                ? "border-red-500 bg-red-50 focus:shadow-sm focus:shadow-red-500/20"
                : "border-gray-300 focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20"
            } placeholder:text-gray-400`}
          />
          {errors.city && (
            <span className="   text-sm text-red-600 font-medium animate-in slide-in-from-top">
              {errors.city}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="mt-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-xl hover:enabled:shadow-purple-500/40 active:enabled:translate-y-0"
        >
          {isSubmitting ? "Adding User..." : "Add User"}
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
