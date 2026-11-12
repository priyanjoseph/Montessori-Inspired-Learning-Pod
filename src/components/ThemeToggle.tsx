import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface ThemeToggleProps {
  compact?: boolean;
  variant?: 'pill' | 'square';
  className?: string;
}

/**
 * Switches between warm cream light mode and deep forest dark mode.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  compact = false,
  variant = 'pill',
  className = '',
}) => {
  const { isDark, toggleTheme } = useSettings();

  const sizeAndShapeClasses =
    variant === 'square'
      ? compact
        ? 'w-10 h-10 rounded-xl shadow-sm'
        : 'px-3 h-10 rounded-xl shadow-sm'
      : compact
      ? 'w-9 h-9 rounded-full'
      : 'px-3 h-9 rounded-full';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 border box-border flex-shrink-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-400 ${sizeAndShapeClasses} ${
        isDark
          ? 'bg-forest-900 border-forest-700 text-sage-200 hover:bg-forest-800 hover:text-cream'
          : 'bg-white/90 border-beige-300 text-forest-700 hover:bg-beige-100 hover:text-forest-900'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-terracotta-300" />
      ) : (
        <Moon className="w-4 h-4 text-forest-700" />
      )}
      {!compact && (
        <span className="text-xs font-semibold leading-none">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

