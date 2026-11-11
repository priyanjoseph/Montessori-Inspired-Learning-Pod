import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  FileText,
  Globe,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  NotebookPen,
  Settings,
  Shield,
  Sprout,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { DirectionToggle } from '../components/DirectionToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { apiRequest } from '../lib/api';

export interface AdminOverviewData {
  metrics: {
    totalStudents: number;
    totalParents: number;
    totalStaff: number;
    activePrograms: number;
    attendanceRate: number;
    totalCollected: number;
    totalOutstanding: number;
    recentLogsCount: number;
  };
  students: any[];
  parents: any[];
  staff: any[];
  programs: any[];
  attendance: any[];
  logs: any[];
  reports: any[];
  events: any[];
  tuitionAccounts: any[];
  payments: any[];
  notifications: any[];
  cmsContent: any[];
  systemSettings: Record<string, string>;
}

export const ADMIN_NAV_ITEMS = [
  { name: 'Admin Dashboard Overview', to: '/admin', slug: 'overview', icon: LayoutDashboard, exact: true },
  { name: 'Student Management', to: '/admin/students', slug: 'students', icon: GraduationCap },
  { name: 'Parent Management', to: '/admin/parents', slug: 'parents', icon: Users },
  { name: 'Teacher & Staff Management', to: '/admin/staff', slug: 'staff', icon: UserCheck },
  { name: 'Programs & Curriculum Management', to: '/admin/programs', slug: 'programs', icon: BookOpen },
  { name: 'Attendance Management', to: '/admin/attendance', slug: 'attendance', icon: ClipboardCheck },
  { name: 'Daily Learning Logs Management', to: '/admin/logs', slug: 'logs', icon: NotebookPen },
  { name: 'Teacher Reports Management', to: '/admin/reports', slug: 'reports', icon: FileText },
  { name: 'Events Management', to: '/admin/events', slug: 'events', icon: Calendar },
  { name: 'Tuition & Payments Management', to: '/admin/tuition', slug: 'tuition', icon: CreditCard },
  { name: 'Notifications Management', to: '/admin/notifications', slug: 'notifications', icon: Megaphone },
  { name: 'Website Content Management', to: '/admin/cms', slug: 'cms', icon: Globe },
  { name: 'Administrative Reports', to: '/admin/analytics', slug: 'analytics', icon: BarChart3 },
  { name: 'System Settings', to: '/admin/settings', slug: 'settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, logout, isRtl } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const refreshAdminData = useCallback(async () => {
    try {
      setLoadError('');
      const data = await apiRequest<AdminOverviewData>('/api/admin/overview');
      setOverview(data);
    } catch (err: any) {
      setLoadError(err?.message || 'Unable to load administrative records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  useEffect(() => {
    setMobileSidebarOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getCurrentTitle = () => {
    const match = ADMIN_NAV_ITEMS.find((item) =>
      item.exact ? location.pathname === item.to : location.pathname === item.to
    );
    return match ? match.name : 'Admin Dashboard Overview';
  };

  const SidebarNavLinks = ({ closeMobile }: { closeMobile?: boolean }) => (
    <div className="space-y-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.slug}
            to={item.to}
            end={item.exact}
            onClick={() => closeMobile && setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-forest-700 text-cream font-semibold shadow-sm'
                  : 'text-forest-800 dark:text-beige-100 hover:bg-beige-100 dark:hover:bg-forest-800 font-medium'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 font-sans text-forest-950 dark:text-cream flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-72 bg-white dark:bg-forest-900 border-r rtl:border-r-0 rtl:border-l border-beige-300 dark:border-forest-800 shadow-sm flex-shrink-0">
        <div className="h-16 px-5 border-b border-beige-200 dark:border-forest-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-700 text-cream flex items-center justify-center shadow-soft flex-shrink-0">
            <Sprout className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold text-forest-900 dark:text-cream text-sm block truncate leading-tight">
              Montessori Learning Pod
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-forest-600 dark:text-sage-300 block leading-none mt-0.5">
              Admin Command Portal
            </span>
          </div>
        </div>

        {/* Admin Identity Card */}
        <div className="mx-3.5 mt-4 p-3 rounded-2xl bg-sage-100/80 dark:bg-forest-800/80 border border-sage-200 dark:border-forest-700 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-700 text-cream flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-serif font-bold text-xs text-forest-900 dark:text-cream truncate">
              {user?.name || 'Administrator'}
            </p>
            <span className="text-[11px] font-medium text-forest-700 dark:text-sage-300 block truncate">
              Campus Administrator
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin Portal Navigation">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-forest-500 dark:text-sage-400">
            Campus Administration (14)
          </p>
          <SidebarNavLinks />
        </nav>

        <div className="p-3.5 border-t border-beige-200 dark:border-forest-800 space-y-1.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-forest-700 dark:text-beige-100 hover:bg-beige-100 dark:hover:bg-forest-800 transition-colors"
          >
            <Home className="w-4 h-4 text-forest-500 dark:text-sage-300" />
            <span>Home</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-terracotta hover:bg-terracotta/10 transition-colors text-left rtl:text-right"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-forest-900 h-full shadow-soft-xl flex flex-col z-10">
            <div className="h-16 px-4 border-b border-beige-200 dark:border-forest-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-forest-700 dark:text-sage-300" />
                <span className="font-serif font-bold text-sm text-forest-900 dark:text-cream">
                  Admin Portal
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-xl text-forest-700 dark:text-cream hover:bg-beige-100 dark:hover:bg-forest-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 p-3 overflow-y-auto">
              <SidebarNavLinks closeMobile />
            </nav>

            <div className="p-3.5 border-t border-beige-200 dark:border-forest-800 space-y-1.5">
              <Link
                to="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-forest-700 dark:text-beige-100 hover:bg-beige-100"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-terracotta hover:bg-terracotta/10 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/90 dark:bg-forest-900/90 backdrop-blur-md border-b border-beige-300 dark:border-forest-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-beige-100 dark:bg-forest-800 text-forest-800 dark:text-cream"
              aria-label="Open admin sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-serif font-bold text-base sm:text-xl text-forest-900 dark:text-cream truncate">
                {getCurrentTitle()}
              </h1>
              <span className="text-[11px] text-forest-600 dark:text-sage-300 hidden sm:inline">
                Montessori Learning Pod • Role: Administrator ({isRtl ? 'RTL' : 'LTR'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 dark:text-beige-100 hover:bg-beige-100 dark:hover:bg-forest-800 px-3 py-1.5 rounded-full border border-beige-300 dark:border-forest-700 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-forest-600 dark:text-sage-300" />
              <span>Home</span>
            </Link>

            <DirectionToggle />
            <ThemeToggle compact />

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-cream-100 dark:bg-forest-800 border border-beige-300 dark:border-forest-700 text-xs font-semibold"
              >
                <Shield className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300" />
                <span className="hidden sm:inline max-w-[140px] truncate">{user?.name || 'Admin'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-52 bg-white dark:bg-forest-900 rounded-2xl border border-beige-300 dark:border-forest-700 shadow-soft-xl py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-beige-200 dark:border-forest-800">
                    <p className="text-xs font-bold truncate">{user?.name}</p>
                    <p className="text-[11px] text-forest-600 dark:text-sage-300 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs hover:bg-beige-100 dark:hover:bg-forest-800"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>System Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-terracotta hover:bg-terracotta/10 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold uppercase tracking-wider text-forest-700 dark:text-beige-200">
                Loading Administrative Records...
              </p>
            </div>
          ) : loadError ? (
            <div className="p-6 rounded-3xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-sm">
              {loadError}
            </div>
          ) : (
            <Outlet context={{ overview, refreshAdminData, setOverview }} />
          )}
        </main>
      </div>
    </div>
  );
};

