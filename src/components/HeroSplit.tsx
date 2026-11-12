import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Calendar, CheckCircle, Shield, Sprout } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const HERO2_HIGHLIGHTS = [
  'Uninterrupted 3-hour work periods',
  'Multi-age peer collaboration',
  'Sensory natural wooden apparatus',
  'Living garden & forest school curriculum',
];

export const HeroSplit: React.FC = () => {
  const { openTourModal, openEnrollModal } = useSettings();

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] lg:min-h-[640px] xl:min-h-[720px] flex items-center overflow-hidden bg-cream dark:bg-forest-950">
      {/* Full-width photographic background (preserving existing Home Page 2 image) */}
      <img
        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=85&w=1920"
        alt="Prepared Montessori classroom table and natural learning materials"
        className="absolute inset-0 w-full h-full object-cover object-center md:object-[75%_center] rtl:md:object-[25%_center] select-none"
      />

      {/* Soft directional cream/dark gradient overlay for left-side readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#FAF7F0] via-[#FAF7F0]/95 sm:via-[#FAF7F0]/92 lg:via-[#FAF7F0]/88 to-[#FAF7F0]/45 sm:to-[#FAF7F0]/25 lg:to-transparent dark:from-forest-950 dark:via-forest-950/95 sm:dark:via-forest-950/92 lg:dark:via-forest-950/88 dark:to-forest-950/45 lg:dark:to-forest-950/15 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0]/92 via-transparent to-[#FAF7F0]/30 dark:from-forest-950/92 dark:via-transparent dark:to-forest-950/30 pointer-events-none"
      />

      {/* Foreground Content Overlay (Left-Aligned, matching Home Page 1 structure) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
        <div className="max-w-4xl text-left rtl:text-right">
          {/* Introductory Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-forest-900/85 backdrop-blur-sm border border-sage-300/80 dark:border-forest-700 shadow-sm text-[11px] sm:text-xs font-semibold text-forest-800 dark:text-sage-200 mb-6 animate-fadeIn whitespace-nowrap">
            <Sprout className="w-3.5 h-3.5 text-forest-600 dark:text-sage-300 flex-shrink-0" />
            <span>Multi-Age Montessori Pod</span>
            <span className="text-sage-500 dark:text-forest-500">•</span>
            <span className="text-forest-700 dark:text-beige-200 font-medium">Ages 18m – 9y</span>
          </div>

          {/* Two-Line Editorial Serif Heading */}
          <h1 className="font-serif text-[2rem] sm:text-4xl lg:text-[2.9rem] xl:text-[3.35rem] font-bold tracking-tight leading-[1.14] mb-5">
            <span className="block text-forest-900 dark:text-cream">
              Fostering Natural Curiosity,
            </span>
            <span className="block text-forest-900 dark:text-cream mt-1">
              <span className="italic font-semibold text-forest-600 dark:text-sage-300">
                Independence
              </span>{' '}
              &amp; Joyful Mastery.
            </span>
          </h1>

          {/* Controlled-Width Description */}
          <p className="text-base sm:text-lg text-forest-700 dark:text-beige-200/95 leading-relaxed max-w-xl font-sans">
            Step into an unhurried, multi-age learning sanctuary crafted around Dr. Maria Montessori’s scientific pedagogy. Here, children build profound concentration, deep empathy, and genuine intellectual autonomy.
          </p>

          {/* Horizontal Call-to-Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={() => openEnrollModal()}
              className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-white dark:text-forest-950 font-semibold text-sm shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform duration-200" />
            </button>

            <button
              type="button"
              onClick={openTourModal}
              className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full bg-cream/85 hover:bg-white dark:bg-forest-900/80 dark:hover:bg-forest-800 backdrop-blur-sm text-forest-800 dark:text-cream font-semibold text-sm border border-forest-700/75 dark:border-sage-400/70 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-forest-700 dark:text-sage-300 flex-shrink-0" />
              <span>Schedule Classroom Tour</span>
            </button>

            <Link
              to="/programs"
              className="inline-flex items-center justify-center sm:justify-start text-xs font-bold text-forest-800 dark:text-sage-300 hover:text-forest-950 dark:hover:text-white underline underline-offset-4 py-2 sm:py-0"
            >
              View Age Levels (18m – 9y)
            </Link>
          </div>
        </div>

        {/* Bottom-Left Compact Highlights & Credibility Cards on Overlay */}
        <div className="mt-10 lg:mt-12 max-w-2xl text-left rtl:text-right space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HERO2_HIGHLIGHTS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 rounded-2xl bg-white/90 dark:bg-forest-900/85 backdrop-blur-md border border-beige-300/85 dark:border-forest-700/80 shadow-soft px-4 py-3 text-xs sm:text-sm font-medium text-forest-800 dark:text-beige-100"
              >
                <CheckCircle className="w-4 h-4 text-sage-600 dark:text-sage-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="inline-flex flex-wrap items-center gap-5 px-4 py-2.5 rounded-full bg-white/80 dark:bg-forest-900/80 backdrop-blur-md border border-beige-300/80 dark:border-forest-700/80 text-xs text-forest-700 dark:text-beige-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-forest-600 dark:text-sage-400" />
              <span>State Licensed &amp; AMI Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-forest-600 dark:text-sage-400" />
              <span>100% Organic Meals &amp; Snacks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
