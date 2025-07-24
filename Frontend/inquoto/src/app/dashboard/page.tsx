'use client';
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface DashboardData {
  approvedInvoices?: number;
  pendingInvoices?: number;
  rejectedInvoices?: number;
  completeInvoices?: number;
  approvedQuotations?: number;
  pendingQuotations?: number;
  rejectedQuotations?: number;
  completeQuotations?: number;
  totalInvoices?: number;
  totalQuotations?: number;
  [key: string]: any;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<{ total: number; list?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePie, setActivePie] = useState<'Invoices' | 'Quotations'>('Invoices');
  const [dateTime, setDateTime] = useState(new Date());

  const userID = localStorage.getItem('uid');
  const userName = localStorage.getItem('name');

    useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // updates every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/vi/dashboard', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            userID: userID || '',
          },
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const result = await response.json();
        console.log(result);
        setData(result.stats.globalData || {});
        setUsers(result.stats.users || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userID]);

  const pieData = (type: 'Invoices' | 'Quotations') => {
    return [
      { name: 'Approved', value: data?.[`approved${type}`] || 0 },
      { name: 'Pending', value: data?.[`pending${type}`] || 0 },
      { name: 'Rejected', value: data?.[`rejected${type}`] || 0 },
      { name: 'Completed', value: data?.[`complete${type}`] || 0 },
    ];
  };

  const statusMap = [
  { label: 'Approved', key: 'approved' },
  { label: 'Pending', key: 'pending' },
  { label: 'Rejected', key: 'rejected' },
  { label: 'Completed', key: 'complete' }, // NOTE: not "completed"
];

const barChartData = data
  ? statusMap.map(({ label, key }) => ({
      name: label,
      Invoices: data?.[`${key}Invoices`] || 0,
      Quotations: data?.[`${key}Quotations`] || 0,
    }))
  : [];


  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-gray-600 animate-pulse">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-xl font-normal text-gray-800">Hi, {userName} 👋 Welcome back!</h1>
          <p className="text-sm text-gray-500">Here’s your dashboard overview</p>
        </div>
        <div className="text-right mt-2 md:mt-0">
          <p className="text-sm text-gray-500">📅 {dateTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-sm text-gray-500">⏰ {dateTime.toLocaleTimeString()}</p>
        </div>
      </div>


          {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <SummaryCard title="Total Invoices" value={data?.totalInvoices || 0} color="bg-blue-500" />
        <SummaryCard title="Total Quotations" value={data?.totalQuotations || 0} color="bg-green-500" />
        <SummaryCard title="Approved Invoices" value={data?.approvedInvoices || 0} color="bg-indigo-500" />
        <SummaryCard title="Approved Quotations" value={data?.approvedQuotations || 0} color="bg-yellow-500" />
        <SummaryCard title="Total Users" value={users?.total || 0} color="bg-red-500" />
      </div>


      {/* Main Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Status Distribution</h2>
            <div className="space-x-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${activePie === 'Invoices' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                onClick={() => setActivePie('Invoices')}
              >
                Invoices
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm ${activePie === 'Quotations' ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}
                onClick={() => setActivePie('Quotations')}
              >
                Quotations
              </button>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData(activePie)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData(activePie).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Invoices vs Quotations</h2>
          <div className="h-[350px]">
            <ResponsiveContainer>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Invoices" fill="#8884d8" />
                <Bar dataKey="Quotations" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};


const SummaryCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
  <div className={`rounded-2xl shadow p-4 ${color} text-white`}>
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
