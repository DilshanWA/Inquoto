// src/app/overview/page.tsx
import ProtectedLayout from '../components/ProtectedLayout';

export default function OverviewPage() {
  return (
    <ProtectedLayout>
      <h2 className="text-2xl font-bold">Overview</h2>
      <p>Welcome to the dashboard.</p>
    </ProtectedLayout>
  );
}
