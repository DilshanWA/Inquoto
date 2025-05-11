'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  state:string
  role: string;
  signUpDate: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
  fetchUsers(); 
 }, []);
;

const [loading, setLoading] = useState(false);

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
    console.log('Fetched users:', data);
    setUsers(data.data);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    setLoading(false);
  }
};

<<<<<<< Updated upstream
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
=======
  
>>>>>>> Stashed changes

  const deleteUser = async (id: string) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this user?");
      if (!confirmed) return;

      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });

      // Refresh list
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
<<<<<<< Updated upstream

  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">System Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Signup Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">{new Date(user.signUpDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={5}>
                  No users found.
=======

  
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
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-t ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100`}
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
>>>>>>> Stashed changes
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                {loading ? 'Loading...' : 'No users found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

}
