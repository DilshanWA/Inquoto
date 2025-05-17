"use client";
import React, { useState, useEffect, useRef } from "react";
import ProfileDropdown from "../profile/page";
import { useSearch } from "@/app/context/SearchContext";
import { useNotification } from "@/app/context/NotificationContext";

export default function Topbar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { notifications, clearNotifications } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center px-18 py-4 bg-white shadow">
      <input
        type="text"
        placeholder="Search anything"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="text-black placeholder:text-gray-400 bg-gray-100 px-4 py-3 rounded w-1/2"
      />

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        {/* Bell Icon */}
        <div
          className="relative cursor-pointer text-xl"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
          🔔
        </div>

        {/* Notification Dropdown */}
        {showDropdown && (
          <div className="absolute top-12 right-10 w-72 bg-white shadow-lg rounded p-4 z-10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Notifications</span>
              <button
                className="text-xs text-blue-500 hover:underline"
                onClick={clearNotifications}
              >
                Clear All
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400">No new notifications</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700 bg-gray-100 rounded p-2">
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <ProfileDropdown />
      </div>
    </div>
  );
}
