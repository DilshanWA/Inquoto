'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const router = useRouter();


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    router.push('/');
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 cursor-pointer rounded-full overflow-hidden border border-gray-300"
      >
        <img src="/images/user.png" alt="Profile" className="w-full h-full object-cover" />
      </button>

      {open && (
        <div className="absolute cursor-pointer right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          <button className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
            My Account
          </button>
          <button className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
            Settings
          </button>
          <button 
          onClick={handleLogout}
          className="block w-full cursor-pointer text-left px-4 py-2 hover:bg-red-100 text-red-600 text-sm">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
