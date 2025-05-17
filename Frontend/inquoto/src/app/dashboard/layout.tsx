'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import { SearchProvider } from "@/app/context/SearchContext";
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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token'); 

      if (!token) {
        router.push('/errors');
      } else {
        setAuthorized(true); 
      }

      setLoading(false); 
    }
  }, [router]);

  if (loading) return <div>Loading...</div>; 
  if (!authorized) return null; 

  return (
    <SearchProvider>
        <div className="flex h-screen">
        <div className="w-64 fixed top-0 left-0 bottom-0 bg-white shadow-md z-40">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col ml-64">
          <Topbar />
          <main className="flex-1 text-black overflow-y-auto pt-0 px-10 bg-gray-100">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
    
  );
}
