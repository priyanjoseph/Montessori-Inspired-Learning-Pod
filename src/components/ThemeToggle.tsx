import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

/**
 * Switches between warm cream light mode and deep forest dark mode.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, className = '' }) => {
  const { isDark, toggleTheme } = useSettings();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-400 ${
        compact ? 'w-8 h-8' : 'px-2.5 h-8'
      } ${
        isDark
          ? 'bg-forest-900 border-forest-700 text-sage-200 hover:bg-forest-800 hover:text-cream'
          : 'bg-white/80 border-beige-300 text-forest-700 hover:bg-beige-100 hover:text-forest-900'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-terracotta-300" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-forest-700" />
      )}
      {!compact && (
        <span className="text-[11px] font-semibold">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

