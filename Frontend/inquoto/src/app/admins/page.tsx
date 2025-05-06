'use client';

import { useState } from 'react';
import ProtectedLayout from '../components/ProtectedLayout';
import UserForm from '../components/addUser';  // Correctly import UserForm

export default function AdminPage() {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  return (
    <ProtectedLayout>
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
            <UserForm handleCloseForm={closeModal} /> 
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
