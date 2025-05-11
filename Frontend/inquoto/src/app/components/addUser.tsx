'use client';

import { useState } from 'react';

interface UserFormProps {
  handleCloseForm: () => void;
}

export default function UserForm({ handleCloseForm }: UserFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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
        console.log(response)
        setEmail('');
        handleCloseForm();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user.');
    }
     finally {
      setLoading(false);
    }
  };

  return (
    
<div className="flex items-center justify-center fixed  h-screen inset-0 bg-black/60 transition-opacity">
  <div className="w-full max-w-md bg-white p-6 rounded shadow-md relative">
    {/* Close Button */}
    <button
      onClick={handleCloseForm}
        className="absolute top-4 right-4 z-10 rounded-md bg-gray-100 p-1 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Close</span>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
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
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          )}
          {loading ? "Adding..." : "Add User"}
        </button>

      </div>
    </form>
  </div>
</div>

  );
}
