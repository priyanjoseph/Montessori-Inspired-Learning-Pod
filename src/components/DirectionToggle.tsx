import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface DirectionToggleProps {
  compact?: boolean;
  className?: string;
}

/**
 * Icon-only layout direction switcher (LTR <-> RTL).
 */
export const DirectionToggle: React.FC<DirectionToggleProps> = ({ className = '' }) => {
  const { isRtl, toggleRtl } = useSettings();

  return (
    <button
      onClick={toggleRtl}
      type="button"
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-forest-400 ${
        isRtl
          ? 'bg-terracotta text-white border-terracotta shadow-sm hover:bg-terracotta-600'
          : 'bg-white/85 dark:bg-forest-900 text-forest-800 dark:text-cream hover:bg-beige-100 dark:hover:bg-forest-800 border-beige-300 dark:border-forest-700'
      } ${className}`}
      title="Switch Layout"
      aria-label="Switch Layout"
      aria-pressed={isRtl}
    >
      <ArrowLeftRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
    </button>
  );
};
