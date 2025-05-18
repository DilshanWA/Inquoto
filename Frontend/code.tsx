'use client';
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); 
  const userID = localStorage.getItem('uid'); 

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/vi/dashboard', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'userID': userID || '',
          },
        });
        const data = await response.json();
        console.log('Dashboard data:', data);
        setData(data.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {data && Object.entries(data).map(([key, value]) => (
          <div key={key} className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-2 capitalize">{key}</h2>
            <p>{JSON.stringify(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
