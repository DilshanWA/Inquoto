// app/layout.tsx
import './globals.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Inquoto Dashboard',
  description: 'Smart Invoicing. Simple Quoting.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8 bg-gray-100 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
