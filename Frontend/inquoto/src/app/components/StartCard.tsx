'use client';
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <div className={`p-6 rounded-xl ${color} min-w-[200px]`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
