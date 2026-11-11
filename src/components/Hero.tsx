import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Compass, GraduationCap, Sprout } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const HERO_FEATURES = [
  {
    icon: Sprout,
    iconBg: 'bg-sage-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300',
    title: 'Child-Centered Learning',
    description: "Learning designed around every child's individual needs.",
  },
  {
    icon: Compass,
    iconBg: 'bg-terracotta-50 dark:bg-forest-800 text-terracotta-600 dark:text-terracotta-300',
    title: 'Independent Exploration',
    description: 'Encouraging curiosity, confidence, and independence.',
  },
  {
    icon: GraduationCap,
    iconBg: 'bg-beige-200/85 dark:bg-forest-800 text-forest-800 dark:text-sage-200',
    title: 'Experienced Montessori Educators',
    description: 'Supporting children through thoughtful guidance.',
  },
];

export const Hero: React.FC = () => {
  const { openTourModal } = useSettings();

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] lg:min-h-[640px] xl:min-h-[720px] flex items-center overflow-hidden bg-cream dark:bg-forest-950">
      {/* Full-width photographic background */}
      <img
        src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=85&w=1920"
        alt="Children exploring a serene natural Montessori outdoor learning environment"
        className="absolute inset-0 w-full h-full object-cover object-center md:object-[72%_center] rtl:md:object-[28%_center] select-none"
      />

      {/* Soft cream/white gradient overlay for left-side readability while keeping right image crisp */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#FAF7F0] via-[#FAF7F0]/94 sm:via-[#FAF7F0]/88 lg:via-[#FAF7F0]/80 to-[#FAF7F0]/45 sm:to-[#FAF7F0]/25 lg:to-transparent dark:from-forest-950 dark:via-forest-950/94 sm:dark:via-forest-950/88 lg:dark:via-forest-950/82 dark:to-forest-950/45 lg:dark:to-forest-950/15 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0]/92 via-transparent to-[#FAF7F0]/30 dark:from-forest-950/92 dark:via-transparent dark:to-forest-950/30 pointer-events-none"
      />

      {/* Hero Foreground Content (Left-Aligned) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
        <div className="max-w-4xl text-left rtl:text-right">
          {/* Introductory Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-forest-900/85 backdrop-blur-sm border border-sage-300/80 dark:border-forest-700 shadow-sm text-[11px] sm:text-xs font-semibold text-forest-800 dark:text-sage-200 mb-6 animate-fadeIn whitespace-nowrap">
            <Sprout className="w-3.5 h-3.5 text-forest-600 dark:text-sage-300 flex-shrink-0" />
            <span>Authentic Montessori Pod</span>
            <span className="text-sage-500 dark:text-forest-500">•</span>
            <span className="text-forest-700 dark:text-beige-200 font-medium">Ages 18m – 9y</span>
          </div>

          {/* Two-Line Editorial Serif Heading */}
          <h1 className="font-serif text-[2rem] sm:text-4xl lg:text-[2.9rem] xl:text-[3.35rem] font-bold tracking-tight leading-[1.14] mb-5">
            <span className="block text-forest-900 dark:text-cream">
              Growing Curious Minds.
            </span>
            <span className="block italic font-semibold text-forest-600 dark:text-sage-300 mt-1">
              Embracing Independent Learning.
            </span>
          </h1>

          {/* Controlled-Width Description */}
          <p className="text-base sm:text-lg text-forest-700 dark:text-beige-200/95 leading-relaxed max-w-xl font-sans">
            Discover a nurturing Montessori-inspired learning environment where children explore, create, develop independence, and learn at their own pace.
          </p>

          {/* Horizontal Call-to-Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4">
            <Link
              to="/programs"
              className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-white dark:text-forest-950 font-semibold text-sm shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <span>Explore Our Programs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform duration-200" />
            </Link>

            <button
              type="button"
              onClick={openTourModal}
              className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full bg-cream/85 hover:bg-white dark:bg-forest-900/80 dark:hover:bg-forest-800 backdrop-blur-sm text-forest-800 dark:text-cream font-semibold text-sm border border-forest-700/75 dark:border-sage-400/70 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-forest-700 dark:text-sage-300 flex-shrink-0" />
              <span>Book an Observation Tour</span>
            </button>
          </div>
        </div>

        {/* Three Compact Feature Cards at Bottom-Left */}
        <div className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-3xl text-left rtl:text-right">
          {HERO_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-white/90 dark:bg-forest-900/85 backdrop-blur-md border border-beige-300/85 dark:border-forest-700/80 shadow-soft hover:shadow-soft-lg p-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3 sm:block">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 sm:mb-3 ${feature.iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-sans font-bold text-sm text-forest-900 dark:text-cream leading-snug">
                      {feature.title}
                    </h2>
                    <p className="text-xs text-forest-600 dark:text-beige-200/80 leading-relaxed mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
