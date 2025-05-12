'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ensure we're only using `localStorage` on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token'); // Get the token from localStorage

      if (!token) {
        // Redirect to errors page if token is missing
        router.push('/errors');
      } else {
        setAuthorized(true); // If token exists, user is authorized
      }

      setLoading(false); // Set loading state to false after checking
    }
  }, [router]);

  if (loading) return <div>Loading...</div>; // Optionally show loading spinner or message
  if (!authorized) return null; // If not authorized, show nothing or redirect

  return (
    <div className="flex h-screen">
      {/* Sidebar (fixed on the left) */}
      <div className="w-64 fixed top-0 left-0 bottom-0 bg-white shadow-md z-40">
        <Sidebar />
      </div>

      {/* Main content area with fixed Topbar and scrollable page content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Topbar (fixed on the top) */}
        <Topbar />

        {/* Scrollable page content */}
        <main className="flex-1 text-black overflow-y-auto pt-0 px-10 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
