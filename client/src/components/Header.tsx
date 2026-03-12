import { Search, Bell, User, HelpCircle } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, issues..."
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:border-[#4b9fd5] focus:ring-1 focus:ring-[#4b9fd5]"
          />
        </div>

        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <HelpCircle size={18} />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded relative">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">
            3
          </span>
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <div className="w-7 h-7 bg-[#4b9fd5] rounded-full flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
}
