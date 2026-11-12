import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Check,
  ChevronDown,
  House,
  Layers,
  Menu,
  PhoneCall,
  Shield,
  Sprout,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { HomeLayoutType, useSettings } from '../context/SettingsContext';
import { DirectionToggle } from './DirectionToggle';
import { ThemeToggle } from './ThemeToggle';

type OpenDropdown = 'home' | 'dashboard' | null;

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
  const [mobileHomeOpen, setMobileHomeOpen] = useState(true);
  const [mobileDashboardOpen, setMobileDashboardOpen] = useState(true);

  const navBarRef = useRef<HTMLDivElement>(null);
  const homeMenuRef = useRef<HTMLDivElement>(null);
  const dashboardMenuRef = useRef<HTMLDivElement>(null);

  const { homeLayout, setHomeLayout } = useSettings();
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
  }, [location.pathname, location.search]);

  // Close dropdowns and mobile drawer when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (navBarRef.current && !navBarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
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
          ? 'bg-cream/95 dark:bg-forest-950/95 backdrop-blur-md shadow-soft border-b border-beige-300/80 dark:border-forest-800'
          : 'bg-cream/90 dark:bg-forest-950/90 backdrop-blur-sm border-b border-beige-200/70 dark:border-forest-800/70'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-6 xl:px-8 transition-all duration-300 ${
          isScrolled ? 'py-2.5' : 'py-3'
        }`}
      >
        <div className="flex items-center justify-between gap-2 xl:gap-4">
          {/* Left: Logo & Montessori Pod Brand */}
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 group focus:outline-none focus:ring-2 focus:ring-forest-400 rounded-xl py-0.5 pr-0.5 flex-shrink min-w-0"
            aria-label="Montessori Pod Homepage"
          >
            <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-xl bg-forest-700 dark:bg-sage-600 text-cream flex items-center justify-center shadow-soft group-hover:scale-105 group-hover:bg-forest-800 dark:group-hover:bg-sage-500 transition-all duration-300 flex-shrink-0">
              <Sprout className="w-4 h-4 xl:w-5 xl:h-5 text-cream" />
            </div>
            <div className="text-left rtl:text-right min-w-0">
              <span className="font-serif text-[14px] sm:text-base lg:text-[15px] xl:text-[18px] font-bold tracking-tight text-forest-900 dark:text-cream group-hover:text-forest-700 dark:group-hover:text-sage-200 transition-colors block leading-[1.15] whitespace-nowrap truncate">
                Montessori Pod
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

          {/* Right: Desktop Utility & Permanent Login + Mobile Hamburger (< lg) */}
          <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              <DirectionToggle />
              <ThemeToggle compact />

              <Link
                to="/login"
                className={`${NAV_BTN_BASE} border-forest-700 dark:border-sage-400 bg-white/90 dark:bg-forest-900/90 text-forest-900 dark:text-cream hover:bg-forest-700 hover:text-cream dark:hover:bg-sage-400 dark:hover:text-forest-950 shadow-sm`}
              >
                <span>Login</span>
              </Link>
            </div>

            {/* Mobile/Tablet Hamburger (top-right on < lg) */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                setMobileMenuOpen((prev) => !prev);
              }}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-forest-900 text-[#222723] dark:text-cream hover:bg-[#FFF8F2] dark:hover:bg-forest-800 border border-[#DFD6C8] dark:border-forest-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8853D]/50 flex-shrink-0"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Navigation Menu (< lg) matching Reference Design */}
      <div
        id="mobile-nav-drawer"
        aria-hidden={!mobileMenuOpen}
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? 'max-h-[calc(100dvh-4.5rem)] opacity-100 translate-y-0 visible'
            : 'max-h-0 opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
      >
        <div className="bg-[#FAF6F0]/98 dark:bg-forest-950/98 backdrop-blur-md border-t border-[#EAE2D7] dark:border-forest-800 px-4 pt-3.5 pb-4 max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2.5 max-w-7xl mx-auto">
            {/* 1. Expandable Home Accordion Card */}
            <div className="rounded-2xl bg-white dark:bg-forest-900 border border-[#EAE2D7] dark:border-forest-700 shadow-sm overflow-hidden">
              <button
                type="button"
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={() => setMobileHomeOpen((prev) => !prev)}
                aria-expanded={mobileHomeOpen}
                aria-controls="mobile-home-accordion"
                className="w-full min-h-[46px] flex items-center justify-between px-4 py-3 text-[15px] font-semibold text-[#1F2421] dark:text-cream hover:bg-[#FFF9F4] dark:hover:bg-forest-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#E8853D]/50"
              >
                <span>Home</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#4A504B] dark:text-sage-300 transition-transform duration-200 ${
                    mobileHomeOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id="mobile-home-accordion"
                role="menu"
                aria-label="Mobile Home Options"
                aria-hidden={!mobileMenuOpen || !mobileHomeOpen}
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  mobileHomeOpen
                    ? 'max-h-36 opacity-100'
                    : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="px-3 pb-3 pt-0.5 space-y-1">
                  {HOME_OPTIONS.map((option) => {
                    const isActive = homeLayout === option.id && isHomeActive;
                    const isSelectedLayout = homeLayout === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isSelectedLayout}
                        tabIndex={mobileMenuOpen && mobileHomeOpen ? 0 : -1}
                        onClick={() => handleSelectHomeOption(option.id, true)}
                        className={`w-full min-h-[40px] flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors text-left rtl:text-right ${
                          isActive || isSelectedLayout
                            ? 'text-[#E8853D] font-semibold bg-[#FFF8F2] dark:bg-forest-800/80'
                            : 'text-[#3A403C] dark:text-beige-200 font-medium hover:text-[#E8853D] hover:bg-[#FAF6F0] dark:hover:bg-forest-800/50'
                        }`}
                      >
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Vertical Navigation Links */}
            <div className="flex flex-col space-y-0.5 py-0.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `min-h-[44px] flex items-center px-4 py-2.5 rounded-xl text-[15px] transition-colors ${
                      isActive
                        ? 'text-[#E8853D] font-semibold bg-[#FFF8F2] dark:bg-forest-800/80'
                        : 'text-[#222723] dark:text-cream font-medium hover:text-[#E8853D] hover:bg-white/70 dark:hover:bg-forest-900'
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </div>

            {/* 3. Expandable Dashboard Accordion Card */}
            <div className="rounded-2xl bg-white dark:bg-forest-900 border border-[#EAE2D7] dark:border-forest-700 shadow-sm overflow-hidden">
              <button
                type="button"
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={() => setMobileDashboardOpen((prev) => !prev)}
                aria-expanded={mobileDashboardOpen}
                aria-controls="mobile-dashboard-accordion"
                className={`w-full min-h-[46px] flex items-center justify-between px-4 py-3 text-[15px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#E8853D]/50 ${
                  mobileDashboardOpen
                    ? 'bg-[#FDF0E6] dark:bg-forest-800 text-[#1F2421] dark:text-cream'
                    : 'bg-white dark:bg-forest-900 text-[#1F2421] dark:text-cream hover:bg-[#FFF8F2] dark:hover:bg-forest-800/70'
                }`}
              >
                <span>Dashboard</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#4A504B] dark:text-sage-300 transition-transform duration-200 ${
                    mobileDashboardOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id="mobile-dashboard-accordion"
                role="menu"
                aria-label="Mobile Dashboard Options"
                aria-hidden={!mobileMenuOpen || !mobileDashboardOpen}
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  mobileDashboardOpen
                    ? 'max-h-36 opacity-100'
                    : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="px-3 py-2 space-y-1 bg-white dark:bg-forest-900">
                  {[
                    { id: 'admin', label: 'Admin Dashboard', to: '/admin', icon: Shield, active: isAdminDashboardActive },
                    { id: 'user', label: 'User Dashboard', to: '/dashboard', icon: UserCheck, active: isUserDashboardActive },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        tabIndex={mobileMenuOpen && mobileDashboardOpen ? 0 : -1}
                        onClick={() => handleSelectDashboardOption(item.to, true)}
                        className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] transition-colors text-left rtl:text-right ${
                          item.active
                            ? 'bg-[#FFF8F2] dark:bg-forest-800 text-[#E8853D] font-semibold'
                            : 'text-[#3A403C] dark:text-beige-200 font-medium hover:bg-[#FAF6F0] dark:hover:bg-forest-800/60 hover:text-[#E8853D]'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#E8853D] flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Action Buttons Below Dashboard Accordion */}
            <div className="pt-2 space-y-2.5 border-t border-[#EAE2D7] dark:border-forest-800">
              <div className="grid grid-cols-2 gap-3">
                <DirectionToggle variant="orange-card" tabIndex={mobileMenuOpen ? 0 : -1} />
                <ThemeToggle variant="orange-card" tabIndex={mobileMenuOpen ? 0 : -1} />
              </div>

              <Link
                to="/login"
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-[50px] min-h-[48px] rounded-full bg-[#1D2B20] hover:bg-[#273829] active:bg-[#141E15] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-soft transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D2B20]/50 dark:focus:ring-sage-400"
              >
                <User className="w-4 h-4 text-white flex-shrink-0" />
                <span>Login</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
