'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserForm from '@/app/components/addUser';
import UserTable from '@/app/components/usersTable';

export default function AdminPage() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const router = useRouter();

  const closeModal = () => setShowModal(false);
  const handleRefreshTable = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'super_admin') {
      localStorage.removeItem('role');
      router.push('/');
    } else {
      setLoading(false); // ✅ only show page when authorized
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-4">Welcome to the admin dashboard. Here you can manage users, settings, and more.</p>

        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowModal(true)}
        >
          Add New User
        </button>

        {showModal && (
          <div>
            <UserForm handleCloseForm={closeModal} refreshTable={handleRefreshTable} />
          </div>
        )}

        <UserTable refreshKey={refreshKey} />
      </div>
    </div>
  );
}
