// src/app/layout.tsx
import './globals.css'; 
import { NotificationProvider } from "@/app/context/NotificationContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-black">
        <NotificationProvider>
           {children}
        </NotificationProvider>
        
      </body>
    </html>
  );
}
