// src/app/layout.tsx
import './globals.css'; // 👈 Add this line

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-black">
        {children}
      </body>
    </html>
  );
}
