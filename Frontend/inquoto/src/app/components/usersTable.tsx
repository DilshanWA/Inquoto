'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage (or wherever you stored it)
  
      const response = await fetch('http://localhost:5000/api/super-admin/super-dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 👈 Send token in header
        },
      });
  
      const data = await response .json();
      setUsers(data.data);
      console.log('data' ,data.data)
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
  

  const deleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const confirmed = window.confirm("Are you sure you want to delete this user?");
      if (!confirmed) return;

      const res = await fetch(`http://localhost:5000/api/super-admin/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (res.ok) {
        // Refresh list only if deletion was successful
        setUsers((prev) => prev.filter((user) => user.id !== id));
        console.log('User deleted successfully');
      } else {
        const errorData = await res.json();
        console.error('Failed to delete user:', errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  

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
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">{new Date(user.date).toLocaleDateString()}</td>
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
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
