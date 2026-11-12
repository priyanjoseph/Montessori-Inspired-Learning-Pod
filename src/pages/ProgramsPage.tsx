import React, { useState } from 'react';
import { programsData, ProgramItem } from '../data/programsData';
import { ProgramCard } from '../components/ProgramCard';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Clock, Users, Calendar, ArrowRight, CheckCircle2, Shield, HeartHandshake, X } from 'lucide-react';

export const ProgramsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'toddler' | 'primary' | 'elementary'>('all');
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);
  const { openTourModal, openEnrollModal } = useSettings();

  const filteredPrograms = programsData.filter(p => {
    if (activeFilter === 'toddler') return p.id === 'toddler-program';
    if (activeFilter === 'primary') return p.id === 'primary-program';
    if (activeFilter === 'elementary') return p.id === 'early-elementary';
    return true;
  });

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-cream dark:bg-forest-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-sage-200 dark:border-forest-700">
            Montessori Age Levels
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 dark:text-cream mt-4 mb-4">
            Age-Based Learning Programs
          </h1>
          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
            From the sensory dawn of toddlerhood to the expansive cosmic inquiries of early elementary, each environment is uniquely prepared for the child's developmental milestones.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'toddler', label: 'Toddler (18m – 3y)' },
              { id: 'primary', label: 'Primary / Casa (3 – 6y)' },
              { id: 'elementary', label: 'Early Elementary (6 – 9y)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-forest-600 dark:bg-sage-500 text-cream dark:text-forest-950 shadow-soft'
                    : 'bg-white dark:bg-forest-900 text-forest-800 dark:text-beige-200 hover:bg-beige-200 dark:hover:bg-forest-800 border border-beige-300 dark:border-forest-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Program Deep-Dives */}
        <div className="space-y-12">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              id={prog.id}
              className="rounded-4xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft-lg overflow-hidden transition-all duration-300 scroll-mt-28"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Visual side (compact proportional image + key details) */}
                <div className="lg:col-span-4 p-5 sm:p-6 bg-beige-50/75 dark:bg-forest-900/70 border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-beige-200 dark:border-forest-800 flex flex-col justify-between gap-4">
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] max-h-52 w-full rounded-2xl overflow-hidden bg-beige-100 dark:bg-forest-800 shadow-soft">
                      <img
                        src={prog.image}
                        alt={prog.title}
                        className="w-full h-full object-contain object-center"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-forest-800 text-forest-900 dark:text-cream border border-beige-200 dark:border-forest-700 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-terracotta" />
                        {prog.ageGroup}
                      </span>

                      <div className="p-3.5 rounded-2xl bg-white dark:bg-forest-800/80 border border-beige-200 dark:border-forest-700 space-y-1.5 text-xs">
                        <p className="font-semibold text-forest-800 dark:text-sage-200 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-forest-600 dark:text-sage-300 flex-shrink-0" />
                          <span>Guide Ratio: {prog.ratio}</span>
                        </p>
                        <p className="text-forest-600 dark:text-beige-200/85 leading-relaxed">
                          <strong className="text-forest-800 dark:text-cream">Schedule:</strong> {prog.hours}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block pt-3 border-t border-beige-200/80 dark:border-forest-800 text-[11px] text-forest-600 dark:text-beige-300/80">
                    Prepared environment with natural wooden materials and daily outdoor learning.
                  </div>
                </div>

                {/* Content side (lg:col-span-8) */}
                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-beige-100 dark:bg-forest-800 text-forest-800 dark:text-sage-200 border border-beige-200 dark:border-forest-700">
                        Montessori Pod Community
                      </span>
                      <span className="text-xs font-bold text-terracotta dark:text-terracotta-300">
                        {prog.tuition}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream mb-2">
                      {prog.title}
                    </h2>

                    <p className="text-xs sm:text-sm font-medium text-forest-700 dark:text-sage-200 italic mb-4">
                      "{prog.tagline}"
                    </p>

                    <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed mb-6">
                      {prog.detailedOverview}
                    </p>

                    {/* Key Activities List */}
                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-sage-200 mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                        <span>Core Developmental Activities</span>
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {prog.keyActivities.map((act, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-forest-700 dark:text-beige-200 bg-beige-50/70 dark:bg-forest-800/60 p-2.5 rounded-xl border border-beige-200 dark:border-forest-700">
                            <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 flex-shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sample Daily Rhythm */}
                    <div className="p-4 rounded-2xl bg-cream dark:bg-forest-950/60 border border-beige-200 dark:border-forest-800 mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-sage-200 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-forest-600 dark:text-sage-300" />
                        <span>Sample Daily Rhythm</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-forest-700 dark:text-beige-200">
                        {prog.sampleSchedule.map((item, idx) => (
                          <div key={idx} className="flex items-baseline gap-2">
                            <span className="font-semibold text-forest-900 dark:text-cream min-w-[70px]">{item.time}:</span>
                            <span className="text-forest-600 dark:text-beige-200/85">{item.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-beige-200 dark:border-forest-800 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedProgram(prog)}
                      className="text-xs font-bold text-forest-800 dark:text-sage-300 hover:text-forest-950 dark:hover:text-white underline underline-offset-4"
                    >
                      View Comprehensive Syllabus & Ratios →
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={openTourModal}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-forest-800 text-forest-800 dark:text-cream border border-beige-300 dark:border-forest-600 hover:bg-beige-100 dark:hover:bg-forest-700"
                      >
                        Book Observation
                      </button>
                      <button
                        onClick={() => openEnrollModal(prog.title)}
                        className="px-5 py-2 rounded-full text-xs font-semibold bg-forest-600 dark:bg-sage-500 text-cream dark:text-forest-950 hover:bg-forest-700 dark:hover:bg-sage-400 shadow-soft"
                      >
                        Apply for {prog.title.split(' ')[0]}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Observation invitation callout */}
        <div className="mt-16 p-8 rounded-3xl bg-forest-800 text-cream text-center max-w-4xl mx-auto shadow-soft-lg">
          <h3 className="font-serif text-2xl font-bold mb-2">Unsure which program fits your child?</h3>
          <p className="text-forest-200 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            We offer gentle developmental consultations to help evaluate sensitive periods and recommend the optimal placement for your child.
          </p>
          <button
            onClick={openTourModal}
            className="px-6 py-3 rounded-full bg-terracotta text-white font-semibold text-xs sm:text-sm hover:bg-terracotta-600 shadow-soft transition-all"
          >
            Speak with our Pedagogical Director
          </button>
        </div>

      </div>

      {/* Program Detailed Modal */}
      {selectedProgram && (
        <div
          onClick={() => setSelectedProgram(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-cream rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-beige-300 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-beige-100 hover:bg-beige-200 text-forest-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-terracotta uppercase tracking-wider">{selectedProgram.ageGroup}</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-1 mb-2">
              {selectedProgram.title} Syllabus
            </h2>
            <p className="text-forest-700 text-xs sm:text-sm mb-6 leading-relaxed">
              {selectedProgram.detailedOverview}
            </p>

            <h3 className="font-bold text-xs uppercase tracking-wider text-forest-900 mb-3">Four Pedagogical Pillars</h3>
            <div className="space-y-3 mb-6">
              {selectedProgram.learningPillars.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-beige-200">
                  <h4 className="font-serif font-bold text-sm text-forest-900 mb-1">{p.title}</h4>
                  <p className="text-xs text-forest-600">{p.description}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige-200">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 text-xs font-semibold text-forest-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const title = selectedProgram.title;
                  setSelectedProgram(null);
                  openEnrollModal(title);
                }}
                className="px-6 py-2.5 rounded-full bg-forest-600 text-cream text-xs font-semibold hover:bg-forest-700"
              >
                Enroll in {selectedProgram.title}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

