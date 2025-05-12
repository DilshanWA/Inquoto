'use client';

import { useState } from 'react';

interface UserFormProps {
  handleCloseForm: () => void;
}

export default function UserForm({ handleCloseForm }: UserFormProps) {
  const [email, setEmail] = useState('');
  const [addsuccess, setAddSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        setAddSuccess(true); // Success
        setEmail('');
      } else {
        setAddSuccess(false); // Failure
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setAddSuccess(false); // Failure
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setAddSuccess(null);  // Close the popup
    handleCloseForm(); // Close the form as well
  };

  return (
    <div className="flex items-center justify-center fixed h-screen inset-0 bg-black/60 transition-opacity">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md relative">
        {/* Close Button */}
        <button
          onClick={handleCloseForm}
          className="absolute top-4 right-4  rounded-md bg-gray-100 p-1 text-gray-400 hover:text-gray-500"
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
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>

      {/* Success/Failure Popup */}
      {addsuccess !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white p-8 rounded shadow-md w-120">
            <div className="text-center">
              <h2
                className={`text-xl font-semibold ${
                  addsuccess ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {addsuccess ? 'User Added Successfully!' : 'Failed to Add User'}
              </h2>
              <p className="mt-2 text-gray-700">
                {addsuccess
                  ? 'The user has been added to the system.'
                  : 'There was an issue adding the user.'}
              </p>
              <div className="mt-4">
                {addsuccess ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-600 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-red-600 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <button
                onClick={handlePopupClose}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
