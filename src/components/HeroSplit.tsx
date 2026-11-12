import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Compass,
  Shield,
  Sprout,
  Trees,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const HERO2_FEATURES = [
  {
    icon: Sprout,
    text: 'Uninterrupted 3-hour work periods',
  },
  {
    icon: Compass,
    text: 'Multi-age peer collaboration',
  },
  {
    icon: CheckCircle2,
    text: 'Sensory natural wooden apparatus',
  },
  {
    icon: Trees,
    text: 'Living garden & forest school curriculum',
  },
];

export const HeroSplit: React.FC = () => {
  const { openTourModal, openEnrollModal } = useSettings();

  return (
    <section
      aria-labelledby="home2-hero-heading"
      className="relative w-full bg-[#FAF7F0] dark:bg-forest-950 overflow-hidden transition-colors"
    >
      {/* Subtle botanical ambient accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sage-200/35 dark:bg-forest-800/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-beige-300/40 dark:bg-forest-900/35 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Side: Hero Content */}
          <div className="lg:col-span-6 text-left rtl:text-right">
            {/* Introductory Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white dark:bg-forest-900 border border-sage-300/80 dark:border-forest-700 shadow-sm text-[11px] sm:text-xs font-semibold text-forest-800 dark:text-sage-200 mb-5 whitespace-nowrap">
              <Sprout className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300 flex-shrink-0" />
              <span>Multi-Age Montessori Pod</span>
              <span className="text-sage-500 dark:text-forest-500">•</span>
              <span className="text-forest-700 dark:text-beige-200 font-medium">Ages 18m – 9y</span>
            </div>

            {/* Heading */}
            <h1
              id="home2-hero-heading"
              className="font-serif text-[2rem] sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-bold tracking-tight leading-[1.13] mb-5 text-forest-950 dark:text-cream"
            >
              Fostering Natural Curiosity,{' '}
              <span className="italic font-semibold text-forest-700 dark:text-sage-300">
                Independence
              </span>{' '}
              &amp; Joyful Mastery.
            </h1>

            {/* Philosophy Description */}
            <p className="text-base sm:text-lg text-forest-700 dark:text-beige-200/95 leading-relaxed max-w-xl font-sans">
              Step into an unhurried, multi-age learning sanctuary crafted around Dr. Maria
              Montessori’s scientific pedagogy. Here, children build profound concentration, deep
              empathy, and genuine intellectual autonomy.
            </p>

            {/* Primary & Secondary CTA Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={() => openEnrollModal()}
                className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full bg-[#1D2B20] hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-white dark:text-forest-950 font-semibold text-sm shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform duration-200" />
              </button>

              <button
                type="button"
                onClick={openTourModal}
                className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full bg-white hover:bg-beige-50 dark:bg-forest-900 dark:hover:bg-forest-800 text-forest-900 dark:text-cream font-semibold text-sm border border-forest-700/40 dark:border-sage-400/60 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Calendar className="w-4 h-4 text-terracotta flex-shrink-0" />
                <span>Schedule a Classroom Tour</span>
              </button>
            </div>

            {/* Supporting Montessori Benefits Feature List */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HERO2_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.text}
                    className="flex items-center gap-2.5 rounded-2xl bg-white/95 dark:bg-forest-900/90 border border-beige-200 dark:border-forest-700 shadow-sm px-3.5 py-2.5 text-xs sm:text-[13px] font-medium text-forest-800 dark:text-beige-100"
                  >
                    <span className="w-7 h-7 rounded-lg bg-sage-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span>{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Secondary Age Levels Link & Accreditation Strip */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-forest-700 dark:text-beige-200">
              <div className="inline-flex items-center gap-1.5 font-medium">
                <Shield className="w-4 h-4 text-forest-700 dark:text-sage-300 flex-shrink-0" />
                <span>State Licensed &amp; AMI Aligned</span>
              </div>
              <div className="inline-flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-terracotta flex-shrink-0" />
                <span>100% Organic Meals &amp; Snacks</span>
              </div>
              <Link
                to="/programs"
                className="font-bold text-forest-800 dark:text-sage-300 hover:text-forest-950 dark:hover:text-white underline underline-offset-4"
              >
                View Age Levels (18m – 9y)
              </Link>
            </div>
          </div>

          {/* Right Side: Prominent Montessori Classroom Visual */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden bg-white dark:bg-forest-900 border-4 border-white dark:border-forest-800 shadow-soft-xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-beige-100 dark:bg-forest-800">
                  <img
                    src="https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&crop=entropy&q=85&w=1200&h=900"
                    alt="Children exploring hands-on natural Montessori materials in an organized sunlit classroom"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Crisp Editorial Caption Strip below Image (zero overlap on subjects) */}
                <div className="px-5 py-3.5 bg-white dark:bg-forest-900 border-t border-beige-200/80 dark:border-forest-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-forest-900 dark:text-cream font-semibold">
                    <span className="w-2 h-2 rounded-full bg-sage-600 dark:bg-sage-400" />
                    <span>Prepared Montessori Classroom</span>
                  </div>
                  <span className="text-forest-600 dark:text-sage-300 font-medium">
                    Hands-On Wooden Materials • Child-Led Exploration
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
