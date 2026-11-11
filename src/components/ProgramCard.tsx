import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Users, Sparkles } from 'lucide-react';
import { ProgramItem } from '../data/programsData';
import { useSettings } from '../context/SettingsContext';

interface ProgramCardProps {
  program: ProgramItem;
  onSelectMore?: (program: ProgramItem) => void;
  featured?: boolean;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onSelectMore, featured = false }) => {
  const { openEnrollModal } = useSettings();

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col group ${
        featured ? 'ring-2 ring-forest-500/30 dark:ring-sage-400/30' : ''
      }`}
    >
      {/* Program Image with Overlays */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-beige-100 dark:bg-forest-800">
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Age badge */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-cream/95 dark:bg-forest-900/95 backdrop-blur-md text-forest-800 dark:text-cream border border-beige-200 dark:border-forest-700 shadow-sm inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            {program.ageGroup}
          </span>
        </div>

        {/* Ratio badge */}
        <div className="absolute bottom-3 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2 text-white text-xs font-medium">
          <Users className="w-3.5 h-3.5 text-sage-300" />
          <span>{program.ratio}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-900 dark:text-cream group-hover:text-forest-700 dark:group-hover:text-sage-200 transition-colors">
              {program.title}
            </h3>
          </div>

          <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed mb-5">
            {program.description}
          </p>

          {/* Key Learning Activities */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-forest-800 dark:text-sage-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Key Learning Activities</span>
            </h4>
            <ul className="space-y-2">
              {program.keyActivities.slice(0, 3).map((activity, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-forest-700 dark:text-beige-200/85">
                  <CheckCircle2 className="w-4 h-4 text-sage-500 dark:text-sage-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 border-t border-beige-200 dark:border-forest-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (onSelectMore) {
                onSelectMore(program);
              } else {
                openEnrollModal(program.title);
              }
            }}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-sage-200 hover:text-forest-950 dark:hover:text-white transition-colors py-2 group/btn"
          >
            <span>Learn More & Schedule</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => openEnrollModal(program.title)}
            type="button"
            className="px-4 py-2 rounded-full bg-beige-200 dark:bg-forest-800 hover:bg-forest-700 dark:hover:bg-sage-500 hover:text-cream dark:hover:text-forest-950 text-forest-800 dark:text-cream text-xs font-semibold transition-all shadow-sm"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

