'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserForm from '@/app/components/addUser';  // Import the CreateUser component

export default function AdminPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter(); // ✅ Call useRouter at the top

  const closeModal = () => setShowModal(false);

  const handleNavigate = () => {
    router.push('/Create_user'); // ✅ Navigate using a string route
  };

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

        <button
          className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleNavigate}
        >
          Create User
        </button>

        {showModal && (
          <div>
            <UserForm handleCloseForm={closeModal} /> 
          </div>
        )}
      </div>
    </div>
  );
}
