'use client';

import { useState } from 'react';

interface UserFormProps {
  handleCloseForm: () => void;
}

export default function UserForm({ handleCloseForm }: UserFormProps) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-4 overflow-y-auto">
      <div className="w-full max-w-10xl bg-white p-6 rounded shadow-md relative">
        {/* Close Button */}
        <button
          onClick={handleCloseForm}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          X
        </button>

        <form onSubmit={handleSubmit} className="space-y-10 mt-4">
          {/* User Details */}
          <div className="gap-4">
            <div>
              <label className="block text-black font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 text-gray-700 w-sm px-3 py-2 rounded"
                placeholder="User email"
              />
            </div>
            <div>
              <label className="block text-black font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 text-gray-700 w-sm px-3 py-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-black font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 text-gray-700 w-sm px-3 py-2 rounded"
                placeholder="User password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
