'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useRouter } from 'next/navigation';


const navItems = [
  { name: 'Overview', href: '/overview' },
  { name: 'Quotation', href: '/quotation' },
  { name: 'Invoice', href: '/invoice' },
  { name: 'Admins', href: '/admins' },
];

const Sidebar = () => {

  const router = useRouter();

  const handleLogout = () => {
    // Clear token (or any auth state)
    localStorage.removeItem('token');

    // Optional: call logout API if using sessions/cookies
    // await fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' });

    // Redirect to login page
    router.push('/');
  };


  const pathname = usePathname();

  return (
    <div className="bg-[#050A30] text-white h-screen w-64 flex flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold p-4">Inquoto</h1>
        <nav className="mt-8">
          <ul className="space-y-4 px-4 text-xl">
            {navItems.map(({ name, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-3 py-2 rounded ${
                    pathname === href
                      ? 'bg-blue-100 text-black'
                      : 'hover:bg-blue-100 hover:text-black'
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="px-4 mb-4">
      <button
        onClick={handleLogout}
        className="w-full flex items-center bg-gray-700 rounded px-3 py-2 hover:bg-gray-600"
      >
        <span className="mr-2">🔒</span> Logout
      </button>

        <p className="text-xs mt-2">Powered by NeoMac Engineering</p>
      </div>
    </div>
  );
};

export default Sidebar;
