import Sidebar from "@/app/components/Sidebar";
import Topbar from '@/app/components/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar/>
       <main className="flex-1 p-6 bg-gray-300 text-black">{children}</main>
      </div>
    </div>
  );
}
