'use client';
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            userID: userID || '',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Dashboard data:', result.stats);
        const data = result.stats.globalData;
        setData(data|| {});
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userID]);

  // Invoice data for pie chart
  const invoiceChartData = data
    ? [
        { name: 'Approved', value: data.approvedInvoices || 0 },
        { name: 'Pending', value: data.pendingInvoices || 0 },
        { name: 'Rejected', value: data.rejectedInvoices || 0 },
        { name: 'Completed', value: data.completeInvoices || 0 },
      ]
    : [];

  // Quotation data for pie chart
  const quotationChartData = data
    ? [
        { name: 'Approved', value: data.approvedQuotations || 0 },
        { name: 'Pending', value: data.pendingQuotations || 0 },
        { name: 'Rejected', value: data.rejectedQuotations || 0 },
        { name: 'Completed', value: data.completeQuotations || 0 },
      ]
    : [];

  // Combined data for bar chart
  const barChartData = data
    ? [
        {
          name: 'Approved',
          Invoices: data.approvedInvoices || 0,
          Quotations: data.approvedQuotations || 0,
        },
        {
          name: 'Pending',
          Invoices: data.pendingInvoices || 0,
          Quotations: data.pendingQuotations || 0,
        },
        {
          name: 'Rejected',
          Invoices: data.rejectedInvoices || 0,
          Quotations: data.rejectedQuotations || 0,
        },
        {
          name: 'Completed',
          Invoices: data.completeInvoices || 0,
          Quotations: data.completeQuotations || 0,
        },
      ]
    : [];

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Invoice Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Invoice Distribution</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoiceChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {invoiceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} invoices`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quotation Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quotation Distribution</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={quotationChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {quotationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} quotations`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Invoice vs Quotation Status</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
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

      {/* Summary Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Invoices Summary</h3>
            <p>Total: {data.totalInvoices || 0}</p>
            <p>Pending: {data.pendingInvoices || 0}</p>
            <p>Approved: {data.approvedInvoices || 0}</p>
            <p>Rejected: {data.rejectedInvoices || 0}</p>
            <p>Completed: {data.completeInvoices || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Quotations Summary</h3>
            <p>Total: {data.totalQuotations || 0}</p>
            <p>Pending: {data.pendingQuotations || 0}</p>
            <p>Approved: {data.approvedQuotations || 0}</p>
            <p>Rejected: {data.rejectedQuotations || 0}</p>
            <p>Completed: {data.completeQuotations || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;