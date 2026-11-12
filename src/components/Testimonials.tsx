import React, { useState } from 'react';
import { testimonialsData } from '../data/testimonialsData';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-cream dark:bg-forest-950 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-sage-200 dark:border-forest-700">
            Voices of Our Community
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-900 dark:text-cream mt-4 mb-4">
            Loved by Parents, Cherished by Children
          </h2>
          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
            Read heartfelt reflections from families who have seen their children flourish in our self-directed, nature-rich environment.
          </p>
        </div>

        {/* Featured Testimonial Highlight Card */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-forest-900 rounded-4xl p-8 sm:p-12 border border-beige-300 dark:border-forest-700 shadow-soft-xl relative mb-12">
          <Quote className="absolute top-6 right-8 rtl:right-auto rtl:left-8 w-16 h-16 text-beige-200 dark:text-forest-800 pointer-events-none" />

          {/* Star ratings */}
          <div className="flex items-center gap-1 mb-4 text-terracotta">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-terracotta" />
            ))}
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream leading-snug mb-4">
            "{testimonialsData[currentIndex].quote}"
          </h3>

          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed mb-8 font-sans">
            {testimonialsData[currentIndex].story}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-beige-200 dark:border-forest-800">
            <div className="flex items-center gap-4">
              <img
                src={testimonialsData[currentIndex].avatar}
                alt={testimonialsData[currentIndex].parentName}
                className="w-14 h-14 rounded-full object-cover object-top bg-beige-100 dark:bg-forest-800 border-2 border-forest-400"
              />
              <div>
                <p className="font-serif font-bold text-base text-forest-900 dark:text-cream">
                  {testimonialsData[currentIndex].parentName}
                </p>
                <p className="text-xs text-forest-600 dark:text-beige-200/80">
                  {testimonialsData[currentIndex].role} • <span className="font-semibold text-terracotta dark:text-terracotta-300">{testimonialsData[currentIndex].program}</span>
                </p>
                <p className="text-[11px] text-softbrown-400 dark:text-beige-300/75">
                  {testimonialsData[currentIndex].childInfo}
                </p>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handlePrev}
                type="button"
                className="p-2.5 rounded-full bg-cream dark:bg-forest-800 hover:bg-beige-200 dark:hover:bg-forest-700 text-forest-800 dark:text-cream border border-beige-300 dark:border-forest-600 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
              <span className="text-xs font-semibold text-forest-600 dark:text-beige-200 px-2">
                {currentIndex + 1} / {testimonialsData.length}
              </span>
              <button
                onClick={handleNext}
                type="button"
                className="p-2.5 rounded-full bg-cream dark:bg-forest-800 hover:bg-beige-200 dark:hover:bg-forest-700 text-forest-800 dark:text-cream border border-beige-300 dark:border-forest-600 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Supporting Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.filter((_, idx) => idx !== currentIndex).slice(0, 3).map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-beige-100/60 dark:bg-forest-900/80 border border-beige-300 dark:border-forest-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-2 text-terracotta">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-terracotta" />
                  ))}
                </div>
                <p className="font-serif font-bold text-forest-900 dark:text-cream text-sm mb-2">
                  "{t.quote}"
                </p>
                <p className="text-xs text-forest-700 dark:text-beige-200/90 leading-relaxed mb-4 line-clamp-3">
                  {t.story}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-beige-200/60 dark:border-forest-800">
                <img src={t.avatar} alt={t.parentName} className="w-9 h-9 rounded-full object-cover object-top bg-beige-100 dark:bg-forest-800" />
                <div>
                  <p className="text-xs font-bold text-forest-900 dark:text-cream">{t.parentName}</p>
                  <p className="text-[10px] text-forest-600 dark:text-sage-300">{t.program}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

