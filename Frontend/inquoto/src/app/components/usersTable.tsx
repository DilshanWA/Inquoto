'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  state: string;
  role: string;
  date: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/super-admin/super-dashboard', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/super-admin/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        const errorData = await res.json();
        console.error('Failed to delete user:', errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="mt-10 w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">System Users</h2>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="w-full table-fixed text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="w-1/5 px-4 py-3">Name</th>
              <th className="w-1/4 px-4 py-3">Email</th>
              <th className="w-1/6 px-4 py-3">Role</th>
              <th className="w-1/6 px-4 py-3">State</th>
              <th className="w-1/5 px-4 py-3">Signup Date</th>
              <th className="w-1/6 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 break-words">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        user.state.toLowerCase() === 'pending'
                          ? 'bg-red-100 text-red-600'
                          : user.state.toLowerCase() === 'accepted'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {user.state}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(user.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded shadow-sm transition duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
