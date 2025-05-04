import StatCard from '../components/StartCard'

export default function OverviewPage() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatCard title="Total Quotations" value="500+" color="bg-rose-200" />
      <StatCard title="Total Invoices" value="200+" color="bg-blue-200" />
      <StatCard title="Pending Quotations" value="50" color="bg-gray-200" />
      <StatCard title="Recently Created" value="15+" color="bg-green-100" />
      <StatCard title="Paid Invoices" value="32" color="bg-orange-200" />
    </div>
    );
  }
  