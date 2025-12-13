"use client";

import React, { useState, useEffect } from "react";

export default function SearchBar({ onSearch, placeholder = "Search tasks..." }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for 300ms debounce
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg animate-in slide-in-from-left duration-500">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-lg text-base font-family-inherit transition-all duration-300 focus:outline-none focus:border-purple-600 focus:shadow-sm focus:shadow-purple-500/20 placeholder:text-gray-700"
      />
    </div>
  );
}
