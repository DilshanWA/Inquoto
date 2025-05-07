// app/dashboard/layout.tsx
import React from 'react';
import Sidebar from '@/app/components/Sidebar'; // adjust the path if needed
import Topbar from '../components/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <main className="flex-1 text-black overflow-y-auto pt-0 px-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
