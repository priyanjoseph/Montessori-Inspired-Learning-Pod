import React from 'react';
import { Link } from 'react-router-dom';
import { philosophyPillars } from '../data/philosophyData';
import { HeartHandshake, Compass, HandMetal, Brain, Hourglass, UtensilsCrossed, Building2, Handshake, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  HeartHandshake,
  Compass,
  HandMetal,
  Brain,
  Hourglass,
  UtensilsCrossed,
  Building2,
  Handshake
};

export const PhilosophySection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-beige-50/60 dark:bg-forest-900/40 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-sage-200 dark:border-forest-700">
            Our Montessori Pedagogy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-900 dark:text-cream mt-4 mb-4">
            Education for Life, Not Just for School.
          </h2>
          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
            Dr. Maria Montessori discovered that children thrive when their intrinsic desire to know is respected. Our eight foundational pillars create a peaceful, empowering sanctuary.
          </p>
        </div>

        {/* 8 Pillars Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {philosophyPillars.map((pillar, idx) => {
            const Icon = iconMap[pillar.iconName] || Compass;
            return (
              <div
                key={pillar.id}
                className={`rounded-3xl p-6 sm:p-7 bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group ${
                  idx === 0 ? 'lg:col-span-2 bg-gradient-to-br from-white via-white to-sage-50/40 dark:from-forest-900 dark:via-forest-900 dark:to-forest-800/70' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-sage-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 flex items-center justify-center group-hover:bg-forest-600 group-hover:text-cream transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-terracotta dark:text-terracotta-300">
                      Pillar 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-900 dark:text-cream mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-terracotta dark:text-terracotta-300 mb-3">
                    {pillar.subtitle}
                  </p>

                  <p className="text-forest-700 dark:text-beige-200 text-xs sm:text-sm leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-1.5 mb-4">
                    {pillar.coreHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-forest-600 dark:text-beige-200/85">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-400 dark:bg-sage-400 mt-1.5 flex-shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-beige-200 dark:border-forest-800">
                  <p className="text-[11px] text-softbrown-400 dark:text-beige-300/80 italic">
                    <strong>In the classroom:</strong> {pillar.classroomApplication}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <Link
            to="/curriculum"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-700 dark:bg-sage-500 text-cream dark:text-forest-950 text-xs sm:text-sm font-semibold hover:bg-forest-800 dark:hover:bg-sage-400 shadow-soft transition-all"
          >
            <span>Explore Curriculum & Classroom Areas</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

      </div>
    </section>
  );
};

