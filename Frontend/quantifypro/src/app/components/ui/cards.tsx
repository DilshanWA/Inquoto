// src/components/ui/card.tsx
export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white shadow rounded-md p-4">{children}</div>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="text-gray-800">{children}</div>
);
