'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Custom404() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black text-white"
      role="main"
    >
      <div className="text-center px-6 md:px-12">
        <h1
          className="text-9xl font-extrabold leading-tight tracking-tighter mb-4"
          aria-live="polite"
        >
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold mb-6" aria-live="polite">
          Oops! Page Not Found
        </h2>
        <p className="text-lg md:text-xl mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        {/* Optional: Add search bar, or links to popular pages */}
        <div>
          <button
            onClick={() => router.push('/')}
            className="text-lg font-medium bg-blue-600 hover:bg-purple-800 text-white py-2 px-6 rounded-lg shadow-lg transition ease-in-out duration-300 transform hover:scale-105"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
