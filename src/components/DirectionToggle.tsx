import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface DirectionToggleProps {
  compact?: boolean;
  variant?: 'pill' | 'square';
  className?: string;
}

/**
 * Icon-only layout direction switcher (LTR <-> RTL).
 */
export const DirectionToggle: React.FC<DirectionToggleProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { isRtl, toggleRtl } = useSettings();
  const shapeClasses = variant === 'square' ? 'w-10 h-10 rounded-xl shadow-sm' : 'w-9 h-9 rounded-full';

  return (
    <button
      onClick={toggleRtl}
      type="button"
      className={`inline-flex items-center justify-center transition-all duration-200 border box-border flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-forest-400 ${shapeClasses} ${
        isRtl
          ? 'bg-terracotta text-white border-terracotta shadow-sm hover:bg-terracotta-600'
          : 'bg-white/90 dark:bg-forest-900 text-forest-800 dark:text-cream hover:bg-beige-100 dark:hover:bg-forest-800 border-beige-300 dark:border-forest-700'
      } ${className}`}
      title="Switch Layout"
      aria-label="Switch Layout"
      aria-pressed={isRtl}
    >
      <ArrowLeftRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
    </button>
  );
};
