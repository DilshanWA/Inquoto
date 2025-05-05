import ProtectedLayout from '../components/ProtectedLayout';

export default function AdminPage() {
    return (
        <ProtectedLayout>
            <div className="p-6">
                {/* Admin page content goes here */}
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="mt-4">Welcome to the admin dashboard. Here you can manage users, settings, and more.</p>
            </div>
        </ProtectedLayout>
    )
  }
  