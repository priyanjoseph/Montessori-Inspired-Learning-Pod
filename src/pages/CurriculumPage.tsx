import React, { useState } from 'react';
import { curriculumAreas } from '../data/curriculumData';
import { CurriculumCard } from '../components/CurriculumCard';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Compass, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const CurriculumPage: React.FC = () => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('all');
  const { openTourModal } = useSettings();

  const filteredAreas = selectedAreaId === 'all'
    ? curriculumAreas
    : curriculumAreas.filter(a => a.id === selectedAreaId);

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-cream dark:bg-forest-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-sage-200 dark:border-forest-700">
            Pedagogical Framework
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 dark:text-cream mt-4 mb-4">
            The Montessori Curriculum
          </h1>
          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
            Our curriculum unites tactile materials, sensory discovery, and rigorous cognitive exploration across seven interconnected domains of human knowledge.
          </p>

          {/* Quick Nav Area Jump Pill List */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setSelectedAreaId('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedAreaId === 'all'
                  ? 'bg-forest-600 dark:bg-sage-500 text-cream dark:text-forest-950 shadow-soft'
                  : 'bg-white dark:bg-forest-900 text-forest-700 dark:text-beige-200 hover:bg-beige-200 dark:hover:bg-forest-800 border border-beige-300 dark:border-forest-700'
              }`}
            >
              All 7 Areas
            </button>
            {curriculumAreas.map(area => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedAreaId === area.id
                    ? 'bg-forest-600 dark:bg-sage-500 text-cream dark:text-forest-950 shadow-soft'
                    : 'bg-white dark:bg-forest-900 text-forest-700 dark:text-beige-200 hover:bg-beige-200 dark:hover:bg-forest-800 border border-beige-300 dark:border-forest-700'
                }`}
              >
                {area.title}
              </button>
            ))}
          </div>
        </div>

        {/* Curriculum Cards List */}
        <div className="space-y-12">
          {filteredAreas.map(area => (
            <CurriculumCard key={area.id} area={area} expandedDefault={true} />
          ))}
        </div>

        {/* Cosmic Education Callout */}
        <div className="mt-20 p-8 sm:p-12 rounded-4xl bg-gradient-to-br from-forest-800 to-forest-900 text-cream relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-sage-300 bg-forest-700/80 px-3.5 py-1.5 rounded-full border border-forest-600">
              The Great Lessons
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Cosmic Education: An Integrated Worldview
            </h2>
            <p className="text-forest-200 text-xs sm:text-sm leading-relaxed">
              Dr. Montessori believed that subjects should not be isolated in vacuum silos. In our pod, biology flows naturally into geography, mathematics empowers physical sciences, and history connects all humanity.
            </p>
            <div className="pt-4">
              <button
                onClick={openTourModal}
                className="px-7 py-3.5 rounded-full bg-terracotta text-white font-semibold text-xs sm:text-sm hover:bg-terracotta-600 shadow-soft transition-all"
              >
                Experience the Curriculum on a Morning Tour
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

