import React, { useState } from 'react';
import { CurriculumArea } from '../data/curriculumData';
import { Sparkles, Eye, BookOpen, Binary, Globe, Palette, Sprout, ChevronDown, ChevronUp, Check, Layers } from 'lucide-react';

interface CurriculumCardProps {
  area: CurriculumArea;
  expandedDefault?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Eye,
  BookOpen,
  Binary,
  Globe,
  Palette,
  Sprout,
  Layers
};

export const CurriculumCard: React.FC<CurriculumCardProps> = ({ area, expandedDefault = false }) => {
  const [isExpanded, setIsExpanded] = useState(expandedDefault);
  const IconComponent = iconMap[area.iconName] || Sparkles;

  return (
    <div
      id={area.id}
      className="rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft overflow-hidden hover:shadow-soft-lg transition-all duration-300 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Visual column (compact proportional image + quote) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-beige-50/75 dark:bg-forest-900/70 border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-beige-200 dark:border-forest-800 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] max-h-48 w-full rounded-2xl overflow-hidden bg-beige-100 dark:bg-forest-800 shadow-soft">
              <img
                src={area.image}
                alt={area.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 p-2 rounded-xl bg-white/92 dark:bg-forest-900/92 backdrop-blur-md shadow-soft border border-beige-200 dark:border-forest-700">
                <IconComponent className="w-5 h-5 text-terracotta" />
              </div>
            </div>

            <div className="lg:hidden">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600 dark:text-sage-300">
                Curriculum Pillar
              </span>
              <h3 className="font-serif text-xl font-bold text-forest-900 dark:text-cream mt-0.5">
                {area.title}
              </h3>
            </div>

            {area.quote && (
              <blockquote className="p-3.5 rounded-2xl bg-white dark:bg-forest-800/70 border-l-4 rtl:border-l-0 rtl:border-r-4 border-terracotta text-xs italic text-forest-800 dark:text-beige-100">
                "{area.quote}"
              </blockquote>
            )}
          </div>

          <div className="hidden lg:flex items-center justify-between pt-3 border-t border-beige-200/80 dark:border-forest-800 text-[11px] text-forest-600 dark:text-beige-300/80 font-medium">
            <span>Montessori Area</span>
            <span>Ages 18m – 9y</span>
          </div>
        </div>

        {/* Content column (lg:col-span-8) */}
        <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="hidden lg:flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sage-100 dark:bg-forest-800 text-forest-700 dark:text-sage-200 text-xs font-semibold border border-sage-200 dark:border-forest-700">
                Montessori Area of Study
              </span>
            </div>

            <h3 className="hidden lg:block font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream mb-1">
              {area.title}
            </h3>

            <p className="text-xs sm:text-sm font-medium text-terracotta dark:text-terracotta-300 mb-4 italic">
              {area.subtitle}
            </p>

            <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed mb-6">
              {area.explanation}
            </p>

            {/* Learning Objectives */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-sage-200 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                <span>Core Developmental Objectives</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {area.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-forest-700 dark:text-beige-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collapsible Example Activities */}
            {isExpanded && (
              <div className="pt-4 border-t border-beige-200 dark:border-forest-800 space-y-3 animate-fadeIn">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-sage-200 mb-2">
                  Example Classroom Works & Apparatus
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {area.exampleActivities.map((act, index) => (
                    <div key={index} className="p-3.5 rounded-2xl bg-cream dark:bg-forest-950/60 border border-beige-200 dark:border-forest-800">
                      <p className="font-serif font-bold text-xs text-forest-900 dark:text-cream mb-1">{act.name}</p>
                      <p className="text-[11px] text-forest-600 dark:text-beige-200/85 leading-snug mb-2">{act.description}</p>
                      <span className="text-[10px] text-softbrown-400 dark:text-beige-300/75 block font-medium">
                        <strong>Materials:</strong> {act.materials}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-beige-100 dark:border-forest-800 flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 dark:text-sage-300 hover:text-forest-900 dark:hover:text-white transition-colors"
            >
              <span>{isExpanded ? 'Hide Classroom Activities' : 'Show Classroom Activities & Apparatus'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <span className="text-xs text-forest-500 dark:text-sage-300 font-medium">
              Ages 18m – 9y
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

