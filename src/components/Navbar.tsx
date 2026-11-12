import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  House,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PhoneCall,
  Shield,
  Sprout,
  User,
  Users,
  X,
} from 'lucide-react';
import { HomeLayoutType, useSettings } from '../context/SettingsContext';
import { DirectionToggle } from './DirectionToggle';
import { ThemeToggle } from './ThemeToggle';

type OpenDropdown = 'home' | 'dashboard' | null;
type MobileSubmenu = 'home' | 'dashboard' | null;

/**
 * Clean outline house icon with a split layout grid for Home 2.
 */
const HomeGridIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5" />
    <path d="M5 14h14" />
    <path d="M12 14v7" />
  </svg>
);

const HOME_OPTIONS: { id: HomeLayoutType; label: string; icon: React.ElementType }[] = [
  { id: 'layout1', label: 'Home 1', icon: House },
  { id: 'layout2', label: 'Home 2', icon: HomeGridIcon },
];

const DASHBOARD_OPTIONS: {
  id: 'admin' | 'user';
  label: string;
  to: string;
  icon: React.ElementType;
}[] = [
  { id: 'admin', label: 'Admin', to: '/admin', icon: Shield },
  { id: 'user', label: 'User', to: '/dashboard', icon: User },
];

const NAV_BTN_BASE =
  'inline-flex items-center justify-center gap-1.5 h-9 px-2.5 xl:px-3.5 rounded-full text-xs xl:text-[13px] font-semibold leading-none whitespace-nowrap border box-border transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-forest-400';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<MobileSubmenu>(null);

  const navBarRef = useRef<HTMLDivElement>(null);
  const homeMenuRef = useRef<HTMLDivElement>(null);
  const dashboardMenuRef = useRef<HTMLDivElement>(null);

  const { homeLayout, setHomeLayout, openTourModal, user, logout } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomeActive = location.pathname === '/';
  const isDashboardActive =
    location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const isAdminDashboardActive = location.pathname.startsWith('/admin');
  const isUserDashboardActive = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route/query change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileSubmenu(null);
  }, [location.pathname, location.search]);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (navBarRef.current && !navBarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileSubmenu(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navLinks = [
    { name: 'Programs', path: '/programs', icon: Layers },
    { name: 'Curriculum', path: '/curriculum', icon: BookOpen },
    { name: 'About Us', path: '/about', icon: Users },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  const handleSelectHomeOption = (layout: HomeLayoutType, closeMobileDrawer = false) => {
    setHomeLayout(layout);
    setOpenDropdown(null);
    setMobileSubmenu(null);

    if (location.pathname !== '/') {
      navigate('/');
    } else if (window.scrollY > 120) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (closeMobileDrawer) {
      window.setTimeout(() => setMobileMenuOpen(false), 150);
    }
  };

  const handleSelectDashboardOption = (target: string, closeMobileDrawer = false) => {
    setOpenDropdown(null);
    setMobileSubmenu(null);
    navigate(target);

    if (closeMobileDrawer) {
      window.setTimeout(() => setMobileMenuOpen(false), 150);
    }
  };

  const handleMenuArrowKeys = (
    event: React.KeyboardEvent<HTMLDivElement>,
    containerRef: React.RefObject<HTMLDivElement>
  ) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const items = containerRef.current?.querySelectorAll<HTMLElement>(
      '[role="menuitem"], [role="menuitemradio"]'
    );
    if (!items || items.length === 0) return;

    event.preventDefault();
    const currentIndex = Array.from(items).indexOf(document.activeElement as HTMLElement);
    const nextIndex =
      event.key === 'ArrowDown'
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  return (
    <header
      ref={navBarRef}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream/95 dark:bg-forest-950/95 backdrop-blur-md shadow-soft py-2.5 border-b border-beige-300/80 dark:border-forest-800'
          : 'bg-cream/90 dark:bg-forest-950/90 backdrop-blur-sm py-3 border-b border-beige-200/70 dark:border-forest-800/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 xl:gap-4">
          {/* Left: Logo & Montessori Learning Pod Brand */}
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 group focus:outline-none focus:ring-2 focus:ring-forest-400 rounded-xl py-0.5 pr-0.5 flex-shrink min-w-0"
            aria-label="Montessori Learning Pod Homepage"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 rounded-xl bg-forest-700 dark:bg-sage-600 text-cream flex items-center justify-center shadow-soft group-hover:scale-105 group-hover:bg-forest-800 dark:group-hover:bg-sage-500 transition-all duration-300 flex-shrink-0">
              <Sprout className="w-4 h-4 xl:w-5 xl:h-5 text-cream" />
            </div>
            <div className="text-left rtl:text-right min-w-0">
              <span className="font-serif text-[12.5px] sm:text-base lg:text-[15px] xl:text-lg font-bold tracking-tight text-forest-900 dark:text-cream group-hover:text-forest-700 dark:group-hover:text-sage-200 transition-colors block leading-tight whitespace-nowrap truncate">
                Montessori Learning Pod
              </span>
              <span className="hidden xl:block text-[10px] font-medium text-forest-600 dark:text-sage-300 tracking-wider uppercase leading-tight">
                Curiosity • Autonomy • Grace
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links (Home ▼ | Programs | Curriculum | About Us | Contact | Dashboard ▼) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center justify-center gap-1.5 xl:gap-2"
          >
            {/* Outlined Pill Home Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === 'home' ? null : 'home'))}
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'home'}
                aria-controls="desktop-home-menu"
                className={`${NAV_BTN_BASE} ${
                  isHomeActive || openDropdown === 'home'
                    ? 'bg-beige-200/85 dark:bg-forest-800 border-forest-700/75 dark:border-sage-400/75 text-forest-900 dark:text-cream shadow-sm'
                    : 'bg-beige-100/85 dark:bg-forest-900/90 border-forest-700/55 dark:border-sage-400/55 text-forest-800 dark:text-cream hover:bg-beige-200/75 dark:hover:bg-forest-800 hover:border-forest-800 dark:hover:border-sage-300'
                }`}
              >
                <span>Home</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-forest-700 dark:text-sage-300 transition-transform duration-200 ${
                    openDropdown === 'home' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id="desktop-home-menu"
                ref={homeMenuRef}
                role="menu"
                aria-label="Home Options"
                aria-hidden={openDropdown !== 'home'}
                onKeyDown={(e) => handleMenuArrowKeys(e, homeMenuRef)}
                className={`absolute left-0 rtl:left-auto rtl:right-0 mt-2 w-44 max-w-[calc(100vw-2rem)] z-50 transition-all duration-200 ease-out origin-top-left rtl:origin-top-right ${
                  openDropdown === 'home'
                    ? 'visible opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'invisible opacity-0 scale-95 -translate-y-1.5 pointer-events-none'
                }`}
              >
                <div className="rounded-2xl bg-white dark:bg-forest-900 border border-beige-300/90 dark:border-forest-700 shadow-soft-xl p-1.5 space-y-1">
                  {HOME_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isActive = homeLayout === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isActive}
                        tabIndex={openDropdown === 'home' ? 0 : -1}
                        onClick={() => handleSelectHomeOption(option.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-forest-400 ${
                          isActive
                            ? 'bg-sage-100/95 dark:bg-forest-800 text-forest-900 dark:text-cream font-semibold border border-sage-300/80 dark:border-forest-600 shadow-sm'
                            : 'text-forest-700 dark:text-beige-200 hover:bg-beige-100/80 dark:hover:bg-forest-800/70 hover:text-forest-900 dark:hover:text-white border border-transparent font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 ${
                              isActive
                                ? 'text-forest-700 dark:text-sage-300'
                                : 'text-forest-600 dark:text-sage-400'
                            }`}
                          />
                          <span>{option.label}</span>
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Standard Nav Links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `${NAV_BTN_BASE} ${
                    isActive
                      ? 'text-forest-900 dark:text-cream bg-beige-200/75 dark:bg-forest-800/90 border-beige-300/80 dark:border-forest-700'
                      : 'text-forest-700 dark:text-beige-200 border-transparent hover:text-forest-950 dark:hover:text-white hover:bg-beige-100/80 dark:hover:bg-forest-800/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-forest-700 dark:bg-sage-300 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Dashboard Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === 'dashboard' ? null : 'dashboard'))}
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'dashboard'}
                aria-controls="desktop-dashboard-menu"
                className={`${NAV_BTN_BASE} ${
                  isDashboardActive || openDropdown === 'dashboard'
                    ? 'text-forest-900 dark:text-cream bg-beige-200/75 dark:bg-forest-800/90 border-beige-300/80 dark:border-forest-700'
                    : 'text-forest-700 dark:text-beige-200 border-transparent hover:text-forest-950 dark:hover:text-white hover:bg-beige-100/80 dark:hover:bg-forest-800/50'
                }`}
              >
                <span>Dashboard</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === 'dashboard' ? 'rotate-180' : ''
                  }`}
                />
                {isDashboardActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-forest-700 dark:bg-sage-300 rounded-full" />
                )}
              </button>

              <div
                id="desktop-dashboard-menu"
                ref={dashboardMenuRef}
                role="menu"
                aria-label="Dashboard Options"
                aria-hidden={openDropdown !== 'dashboard'}
                onKeyDown={(e) => handleMenuArrowKeys(e, dashboardMenuRef)}
                className={`absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 max-w-[calc(100vw-2rem)] z-50 transition-all duration-200 ease-out origin-top-right rtl:origin-top-left ${
                  openDropdown === 'dashboard'
                    ? 'visible opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'invisible opacity-0 scale-95 -translate-y-1.5 pointer-events-none'
                }`}
              >
                <div className="rounded-2xl bg-white dark:bg-forest-900 border border-beige-300/90 dark:border-forest-700 shadow-soft-xl p-1.5 space-y-1">
                  {DASHBOARD_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isActive =
                      option.id === 'admin' ? isAdminDashboardActive : isUserDashboardActive;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitem"
                        tabIndex={openDropdown === 'dashboard' ? 0 : -1}
                        onClick={() => handleSelectDashboardOption(option.to)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-forest-400 ${
                          isActive
                            ? 'bg-sage-100/95 dark:bg-forest-800 text-forest-900 dark:text-cream font-semibold border border-sage-300/80 dark:border-forest-600 shadow-sm'
                            : 'text-forest-700 dark:text-beige-200 hover:bg-beige-100/80 dark:hover:bg-forest-800/70 hover:text-forest-900 dark:hover:text-white border border-transparent font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 flex-shrink-0 text-forest-600 dark:text-sage-300" />
                          <span>{option.label}</span>
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Right: Swap Icon | Theme Toggle | Schedule a Tour | Login */}
          <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            <DirectionToggle />
            <ThemeToggle compact />

            <button
              onClick={openTourModal}
              type="button"
              className={`hidden lg:inline-flex ${NAV_BTN_BASE} border-forest-700 dark:border-sage-500 bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-cream dark:text-forest-950 shadow-soft hover:shadow-soft-lg`}
            >
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Schedule a Tour</span>
            </button>

            {user ? (
              <div className="flex items-center gap-1.5 xl:gap-2">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className={`${NAV_BTN_BASE} border-forest-700/80 dark:border-sage-400/80 bg-cream/95 dark:bg-forest-900 text-forest-900 dark:text-cream hover:bg-forest-700 hover:text-cream dark:hover:bg-sage-400 dark:hover:text-forest-950`}
                >
                  {user.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                  <span className="hidden sm:inline">
                    {user.role === 'admin' ? 'Admin' : 'Portal'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  title="Sign Out"
                  className={`hidden sm:inline-flex ${NAV_BTN_BASE} border-beige-400 dark:border-forest-600 text-forest-800 dark:text-beige-100 hover:bg-terracotta/15 hover:border-terracotta/50 hover:text-terracotta`}
                >
                  <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="sr-only xl:not-sr-only">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`${NAV_BTN_BASE} border-forest-700 dark:border-sage-400 bg-white/90 dark:bg-forest-900/90 text-forest-900 dark:text-cream hover:bg-forest-700 hover:text-cream dark:hover:bg-sage-400 dark:hover:text-forest-950 shadow-sm`}
              >
                <span>Login</span>
              </Link>
            )}

            {/* Mobile/Tablet Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-forest-800 dark:text-cream hover:text-forest-950 hover:bg-beige-200/80 dark:hover:bg-forest-800 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-400 flex-shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream/98 dark:bg-forest-950/98 backdrop-blur-md border-t border-beige-200 dark:border-forest-800 shadow-soft-xl animate-fadeIn px-4 pt-3 pb-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1.5 max-w-7xl mx-auto">
            {/* Mobile Home Dropdown */}
            <div>
              <button
                type="button"
                onClick={() => setMobileSubmenu((prev) => (prev === 'home' ? null : 'home'))}
                aria-expanded={mobileSubmenu === 'home'}
                aria-haspopup="menu"
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm transition-colors border ${
                  isHomeActive || mobileSubmenu === 'home'
                    ? 'bg-beige-200/85 dark:bg-forest-800 border-forest-700/75 dark:border-sage-400/75 text-forest-900 dark:text-cream font-semibold'
                    : 'bg-beige-100/85 dark:bg-forest-900 border-forest-700/55 dark:border-sage-400/55 text-forest-800 dark:text-cream font-medium hover:bg-beige-200/70 dark:hover:bg-forest-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  <House className="w-4 h-4 text-forest-700 dark:text-sage-300" />
                  <span>Home</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-forest-700 dark:text-sage-300 transition-transform duration-200 ${
                    mobileSubmenu === 'home' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                role="menu"
                aria-label="Mobile Home Options"
                aria-hidden={mobileSubmenu !== 'home'}
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  mobileSubmenu === 'home'
                    ? 'max-h-36 opacity-100 mt-1.5'
                    : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="rounded-2xl bg-white dark:bg-forest-900 border border-beige-300/90 dark:border-forest-700 shadow-soft p-1.5 space-y-1">
                  {HOME_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isActive = homeLayout === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isActive}
                        tabIndex={mobileSubmenu === 'home' ? 0 : -1}
                        onClick={() => handleSelectHomeOption(option.id, true)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                          isActive
                            ? 'bg-sage-100/95 dark:bg-forest-800 text-forest-900 dark:text-cream font-semibold border border-sage-300/80 dark:border-forest-600'
                            : 'text-forest-700 dark:text-beige-200 hover:bg-beige-100 dark:hover:bg-forest-800/70 border border-transparent font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-forest-600 dark:text-sage-300 flex-shrink-0" />
                          <span>{option.label}</span>
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Standard Nav Links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-beige-200 dark:bg-forest-800 text-forest-900 dark:text-cream font-semibold'
                      : 'text-forest-700 dark:text-beige-200 hover:bg-beige-100 dark:hover:bg-forest-900 hover:text-forest-900 dark:hover:text-white'
                  }`
                }
              >
                <link.icon className="w-4 h-4 text-forest-600 dark:text-sage-300" />
                <span>{link.name}</span>
              </NavLink>
            ))}

            {/* Mobile Dashboard Dropdown */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setMobileSubmenu((prev) => (prev === 'dashboard' ? null : 'dashboard'))
                }
                aria-expanded={mobileSubmenu === 'dashboard'}
                aria-haspopup="menu"
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isDashboardActive || mobileSubmenu === 'dashboard'
                    ? 'bg-beige-200 dark:bg-forest-800 text-forest-900 dark:text-cream font-semibold'
                    : 'text-forest-700 dark:text-beige-200 hover:bg-beige-100 dark:hover:bg-forest-900 hover:text-forest-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-forest-600 dark:text-sage-300" />
                  <span>Dashboard</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-forest-600 dark:text-sage-300 transition-transform duration-200 ${
                    mobileSubmenu === 'dashboard' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                role="menu"
                aria-label="Mobile Dashboard Options"
                aria-hidden={mobileSubmenu !== 'dashboard'}
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  mobileSubmenu === 'dashboard'
                    ? 'max-h-36 opacity-100 mt-1.5'
                    : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="rounded-2xl bg-white dark:bg-forest-900 border border-beige-300/90 dark:border-forest-700 shadow-soft p-1.5 space-y-1">
                  {DASHBOARD_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isActive =
                      option.id === 'admin' ? isAdminDashboardActive : isUserDashboardActive;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitem"
                        tabIndex={mobileSubmenu === 'dashboard' ? 0 : -1}
                        onClick={() => handleSelectDashboardOption(option.to, true)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                          isActive
                            ? 'bg-sage-100/95 dark:bg-forest-800 text-forest-900 dark:text-cream font-semibold border border-sage-300/80 dark:border-forest-600'
                            : 'text-forest-700 dark:text-beige-200 hover:bg-beige-100 dark:hover:bg-forest-800/70 border border-transparent font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-forest-600 dark:text-sage-300 flex-shrink-0" />
                          <span>{option.label}</span>
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Schedule a Tour & Login CTA */}
            <div className="pt-3 mt-2 border-t border-beige-200 dark:border-forest-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openTourModal();
                }}
                className="w-full py-2.5 rounded-full bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-cream dark:text-forest-950 font-semibold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule a Tour</span>
              </button>

              {user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl border-2 border-forest-700 dark:border-sage-400 text-forest-900 dark:text-cream font-semibold text-sm flex items-center justify-center gap-1.5"
                  >
                    {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    <span>{user.role === 'admin' ? 'Admin' : 'My Portal'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                      navigate('/');
                    }}
                    className="py-2.5 rounded-xl border border-beige-400 dark:border-forest-600 text-terracotta font-semibold text-sm flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 rounded-full border border-forest-700 dark:border-sage-400 bg-white dark:bg-forest-900 text-forest-900 dark:text-cream font-semibold text-sm flex items-center justify-center"
                >
                  <span>Login</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
