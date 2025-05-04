export default function Topbar() {
    return (
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <input
          type="text"
          placeholder="Search anything"
          className="bg-gray-100 px-4 py-2 rounded w-1/2"
        />
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">2</span>
            🔔
          </div>
          <img
            src="/profile.jpg"
            className="w-8 h-8 rounded-full"
            alt="User Avatar"
          />
        </div>
      </div>
    );
  }
  