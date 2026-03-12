import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Bug,
  Flame,
  BarChart3,
  BookOpen,
  ShieldCheck,
  Activity,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/issues', icon: Bug, label: 'Issues' },
  { to: '/security-hotspots', icon: Flame, label: 'Security Hotspots' },
  { to: '/measures', icon: BarChart3, label: 'Measures' },
  { to: '/rules', icon: BookOpen, label: 'Rules' },
  { to: '/quality-gates', icon: ShieldCheck, label: 'Quality Gates' },
  { to: '/activity', icon: Activity, label: 'Activity' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#2d3436] text-white flex flex-col z-50">
      <div className="px-5 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4b9fd5] rounded flex items-center justify-center font-bold text-sm">
            SQ
          </div>
          <div>
            <div className="font-semibold text-sm">SonarQube</div>
            <div className="text-[10px] text-gray-400">Community Edition</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-[#4b9fd5]/20 text-[#4b9fd5] border-l-3 border-[#4b9fd5]'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-l-3 border-transparent'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-gray-700 text-xs text-gray-500">
        <div>SonarQube Demo v1.0</div>
        <div className="mt-1">10 Projects Analyzed</div>
      </div>
    </aside>
  );
}
