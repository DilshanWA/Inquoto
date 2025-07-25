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
    const role = localStorage.getItem('role');
    if (role === 'super_admin') {
      setIsSuperAdmin(true);
    }
  }, []);

  return (
    <div className="bg-black text-white h-screen w-70 flex flex-col justify-between">
      {/* Top: Logo and Nav */}
      <div>
        <div className="flex flex-col items-left px-4 mt-10">
          <img src="/images/systemLogo.png" alt="Logo" className="w-40 h-auto" />
        </div>

        <nav className="mt-20">
          <ul className="space-y-4 px-4 text-xl">
            {navItems.map(({ name, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-3 py-2 rounded ${
                    pathname === href
                      ? 'bg-teal-600 text-black'
                      : 'hover:bg-teal-500 hover:text-black'
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
                      ? 'bg-teal-600 text-black'
                      : 'hover:bg-teal-500 hover:text-black'
                  }`}
                >
                  {adminNavItem.name}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Bottom: Footer */}
      <div className="px-4 mb-4 text-center">
        <p className="text-xs mt-2">Powered by NeoMac Engineering</p>
      </div>
    </div>
  );
};

export default Sidebar;
