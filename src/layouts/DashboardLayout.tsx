import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { DirectionToggle } from '../components/DirectionToggle';
import {
  LayoutDashboard,
  Baby,
  BookOpen,
  FileCheck2,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout, childProfile, unreadNotificationsCount, isRtl } = useSettings();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar and dropdown on navigation; protect route
  useEffect(() => {
    setMobileSidebarOpen(false);
    setProfileDropdownOpen(false);
    if (!user) {
      navigate('/login');
    }
  }, [location.pathname, user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine current page title
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/dashboard' || p === '/dashboard/') return 'Dashboard Overview';
    if (p.includes('/child')) return 'My Child Profile';
    if (p.includes('/logs')) return 'Daily Learning Logs';
    if (p.includes('/reports')) return 'Teacher Reports & Evaluations';
    if (p.includes('/tuition')) return 'Tuition & Payment Management';
    if (p.includes('/notifications')) return 'Parent Notifications';
    if (p.includes('/settings')) return 'Settings & Family Preferences';
    return 'Parent Portal';
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'My Child', path: '/dashboard/child', icon: Baby },
    { name: 'Daily Learning Logs', path: '/dashboard/logs', icon: BookOpen },
    { name: 'Teacher Reports', path: '/dashboard/reports', icon: FileCheck2 },
    { name: 'Tuition & Payments', path: '/dashboard/tuition', icon: CreditCard },
    {
      name: 'Notifications',
      path: '/dashboard/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream text-forest-900 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* ========================================================
          DESKTOP SIDEBAR (Visible on md and up)
         ======================================================== */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col justify-between bg-white border-r rtl:border-r-0 rtl:border-l border-beige-300 shadow-soft sticky top-0 h-screen z-30">
        
        {/* Sidebar Brand Header */}
        <div>
          <div className="p-5 border-b border-beige-200">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 rounded-2xl bg-forest-600 text-cream flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-sage-200" />
              </div>
              <div className="text-left rtl:text-right">
                <span className="font-serif text-base font-bold text-forest-900 block leading-tight">
                  Montessori Pod
                </span>
                <span className="text-[10px] text-forest-600 uppercase tracking-wider block font-medium">
                  Parent Community Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Child Snapshot Pill in Sidebar */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-beige-100/70 border border-beige-200">
            <div className="min-w-0 flex items-center justify-between gap-2 text-left rtl:text-right">
              <div className="min-w-0">
                <p className="font-serif font-bold text-xs text-forest-900 truncate">
                  {childProfile.name}
                </p>
                <p className="text-[10px] text-forest-600 truncate">
                  {childProfile.program.split('(')[0]}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-forest-700 bg-sage-100 px-2 py-0.5 rounded-full flex-shrink-0">
                Active
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-forest-600 text-cream shadow-soft'
                      : 'text-forest-700 hover:text-forest-900 hover:bg-beige-100/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-sage-200' : 'text-forest-500 group-hover:text-forest-700'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-terracotta text-white' : 'bg-terracotta text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom / Logout */}
        <div className="p-4 border-t border-beige-200">
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-terracotta hover:bg-terracotta-50 transition-colors text-left rtl:text-right"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          MOBILE SIDEBAR DRAWER (When mobileSidebarOpen is true)
         ======================================================== */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-forest-950/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`fixed top-0 bottom-0 ${
              isRtl ? 'right-0' : 'left-0'
            } w-72 bg-white shadow-soft-xl flex flex-col justify-between z-50`}
          >
            <div>
              <div className="p-4 border-b border-beige-200 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest-600 text-cream flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-sage-200" />
                  </div>
                  <span className="font-serif font-bold text-sm text-forest-900">
                    Montessori Pod
                  </span>
                </Link>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-forest-700 hover:bg-beige-100"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Child Info */}
              <div className="p-3 m-3 rounded-2xl bg-beige-100 flex items-center justify-between gap-2">
                <div className="text-left rtl:text-right min-w-0">
                  <p className="font-bold text-xs text-forest-900 truncate">{childProfile.name}</p>
                  <p className="text-[10px] text-forest-600 truncate">{childProfile.program}</p>
                </div>
                <span className="text-[10px] font-semibold text-forest-700 bg-sage-100 px-2 py-0.5 rounded-full flex-shrink-0">
                  Active
                </span>
              </div>

              {/* Navigation Items */}
              <nav className="p-3 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-forest-600 text-cream'
                          : 'text-forest-700 hover:bg-beige-100'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-beige-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-terracotta hover:bg-terracotta-50 text-left rtl:text-right"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN CONTENT AREA & TOP NAVIGATION
         ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-beige-300 shadow-soft h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Mobile ([☰] Montessori Pod) / Desktop (Dynamic page title) */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-forest-800 hover:bg-beige-100 md:hidden flex-shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="font-serif text-lg font-bold tracking-tight text-forest-900 whitespace-nowrap truncate md:hidden">
              Montessori Pod
            </span>

            <div className="hidden md:block">
              <h1 className="font-serif text-lg sm:text-xl font-bold text-forest-900 leading-tight">
                {getPageTitle()}
              </h1>
              <p className="text-[10px] text-forest-600">
                Montessori Pod • Family Portal
              </p>
            </div>
          </div>

          {/* Right: Notifications, Profile, RTL toggle (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3.5">
            <DirectionToggle compact />

            {/* Notifications Bell Icon */}
            <Link
              to="/dashboard/notifications"
              className="relative p-2 rounded-full text-forest-700 hover:text-forest-900 hover:bg-beige-100 transition-colors"
              title="View Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 rtl:right-auto rtl:left-1 w-2.5 h-2.5 rounded-full bg-terracotta ring-2 ring-white" />
              )}
            </Link>

            {/* Parent Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-beige-100 hover:bg-beige-200/80 transition-colors border border-beige-300 text-xs font-semibold text-forest-900"
                aria-expanded={profileDropdownOpen}
              >
                <span className="max-w-[140px] truncate">{user?.name || 'Sarah Jenkins'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-forest-600" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-xl border border-beige-300 py-2 z-50 animate-fadeIn text-left rtl:text-right">
                  <div className="px-3.5 py-2.5 border-b border-beige-100">
                    <p className="text-xs font-bold text-forest-900">{user?.name || 'Sarah Jenkins'}</p>
                    <p className="text-[11px] text-forest-600 truncate">{user?.email || 'parent@example.com'}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-forest-700 font-medium bg-sage-50 px-2 py-0.5 rounded-md border border-sage-200">
                      <Baby className="w-3 h-3 text-forest-600" />
                      <span>Child: {childProfile.name}</span>
                    </div>
                  </div>

                  <Link
                    to="/dashboard/child"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-forest-800 hover:bg-beige-100 hover:text-forest-900 transition-colors"
                  >
                    <Baby className="w-4 h-4 text-forest-600" />
                    <span>My Child Profile</span>
                  </Link>

                  <Link
                    to="/dashboard/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-forest-800 hover:bg-beige-100 hover:text-forest-900 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-forest-600" />
                    <span>Settings & Preferences</span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-beige-100">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-terracotta hover:bg-terracotta-50 transition-colors text-left rtl:text-right"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Dashboard Main View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Friendly Dashboard Footer */}
        <footer className="bg-white/80 border-t border-beige-300 py-5 text-center text-xs text-forest-600">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Montessori Pod • Nurturing Independent Curious Minds</p>
            <div className="flex items-center gap-3 text-[11px] text-softbrown-400">
              <span>Guide Email: amina@montessorilearningpod.edu</span>
              <span>•</span>
              <span>Office: +1 (555) 382-7190</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};
