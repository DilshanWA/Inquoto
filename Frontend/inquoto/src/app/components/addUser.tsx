'use client';

import { useState } from 'react';

interface UserFormProps {
  handleCloseForm: () => void;
}

export default function UserForm({ handleCloseForm }: UserFormProps) {
  const [email, setEmail] = useState('');
  const token = localStorage.getItem('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/super-admin/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('User added successfully!');
        setEmail('');
        handleCloseForm();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user.');
    }
  };

  return (
    <div className="w-max h-full flex justify-center items-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md relative">
        {/* Close Button */}
        <button
          onClick={handleCloseForm}
          className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          X
        </button>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="block text-black font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 text-gray-700 w-full px-3 py-2 rounded"
              placeholder="User email"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
