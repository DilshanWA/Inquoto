'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navItems = [
  { name: 'Overview', href: '/overview' },
  { name: 'Quotation', href: '/quotation' },
  { name: 'Invoice', href: '/invoice' },
  { name: 'Admins', href: '/admins' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-[#050A30] text-white h-screen w-64 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold p-4">Inquoto</h1>
        <p className="text-xs px-4">Smart Invoicing. Simple Quoting</p>
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
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
        <button className="w-full flex items-center bg-gray-700 rounded px-3 py-2">
          <span className="mr-2">🔒</span> Logout
        </button>
        <p className="text-xs mt-2">Powered by NeoMac Engineering</p>
      </div>
    </div>
  );
};

export default Sidebar;
