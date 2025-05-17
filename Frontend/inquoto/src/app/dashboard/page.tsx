'use client';
import React from "react";
import StatCard from "@/app/components/StartCard"; // Make sure the path is correct

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: 120,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Pending Approvals",
      value: 8,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Invoices Created",
      value: 45,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Quotations Sent",
      value: 30,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
