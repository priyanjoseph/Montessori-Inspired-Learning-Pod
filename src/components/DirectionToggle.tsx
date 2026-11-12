import React from 'react';
import { AlignLeft, ArrowLeftRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface DirectionToggleProps {
  compact?: boolean;
  variant?: 'pill' | 'square' | 'orange-card';
  fullWidth?: boolean;
  tabIndex?: number;
  className?: string;
}

/**
 * Icon-only layout direction switcher (LTR <-> RTL).
 */
export const DirectionToggle: React.FC<DirectionToggleProps> = ({
  variant = 'pill',
  fullWidth = false,
  tabIndex,
  className = '',
}) => {
  const { isRtl, toggleRtl } = useSettings();

  if (variant === 'orange-card') {
    return (
      <button
        onClick={toggleRtl}
        type="button"
        tabIndex={tabIndex}
        className={`w-full h-11 rounded-xl inline-flex items-center justify-center border box-border flex-shrink-0 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8853D]/50 ${
          isRtl
            ? 'bg-[#FDF0E6] dark:bg-forest-800 border-[#E8853D] text-[#E8853D]'
            : 'bg-white dark:bg-forest-900 border-[#E5DDD1] dark:border-forest-700 text-[#E8853D] hover:bg-[#FFF8F2] hover:border-[#E8853D]/60 dark:hover:bg-forest-800'
        } ${className}`}
        title="Switch Layout"
        aria-label="Switch Layout"
        aria-pressed={isRtl}
      >
        <AlignLeft className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      </button>
    );
  }
  const shapeClasses = fullWidth
    ? variant === 'square'
      ? 'w-full h-11 rounded-xl shadow-sm'
      : 'w-full h-11 rounded-full'
    : variant === 'square'
    ? 'w-10 h-10 rounded-xl shadow-sm'
    : 'w-9 h-9 rounded-full';

  return (
    <button
      onClick={toggleRtl}
      type="button"
      tabIndex={tabIndex}
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
