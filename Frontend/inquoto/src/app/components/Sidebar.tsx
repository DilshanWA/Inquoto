'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Quotation', href: '/dashboard/quotation' },
  { name: 'Invoice', href: '/dashboard/invoice' },
];

const adminNavItem = { name: 'Admins', href: '/dashboard/admins' };

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role'); // or use role
    // Check email (hardcoded)
    if (role === 'super_admin') {
      setIsSuperAdmin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('role');
    router.push('/');
  };

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
            {isSuperAdmin && (
              <li key={adminNavItem.href}>
                <Link
                  href={adminNavItem.href}
                  className={`block px-3 py-2 rounded ${
                    pathname === adminNavItem.href
                      ? 'bg-blue-100 text-black'
                      : 'hover:bg-blue-100 hover:text-black'
                  }`}
                >
                  {adminNavItem.name}
                </Link>
              </li>
            )}
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
