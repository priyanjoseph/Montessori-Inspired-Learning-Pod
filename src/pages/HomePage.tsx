import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Hero } from '../components/Hero';
import { HeroSplit } from '../components/HeroSplit';
import { PhilosophySection } from '../components/PhilosophySection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { EnvironmentGallery } from '../components/EnvironmentGallery';
import { Testimonials } from '../components/Testimonials';
import { ProgramCard } from '../components/ProgramCard';
import { programsData } from '../data/programsData';
import { ArrowRight, HeartHandshake, Trees } from 'lucide-react';

const HOME_STATS = [
  { value: '1:4 – 1:10', label: 'Intimate Guide Ratios' },
  { value: '100%', label: 'Natural Materials' },
  { value: '18m – 9y', label: 'Multi-Age Communities' },
  { value: '2.5 Acres', label: 'Forest & Garden Campus' },
];

export const HomePage: React.FC = () => {
  const { homeLayout, openTourModal, openEnrollModal } = useSettings();

  return (
    <div>
      {homeLayout === 'layout1' ? (
        /* ======================== HOME 1 ======================== */
        <div className="animate-fadeIn">
          {/* 1. Full-Width Photographic Hero Section */}
          <Hero />

          {/* Subtle Montessori Pod Overview Strip */}
          <section className="bg-beige-50/90 dark:bg-forest-900/70 border-y border-beige-200/80 dark:border-forest-800 py-6 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {HOME_STATS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream">
                      {stat.value}
                    </p>
                    <p className="text-xs text-forest-600 dark:text-sage-300 mt-1 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Our Montessori Philosophy Section */}
          <PhilosophySection />

          {/* 3. Featured Learning Programs */}
          <section className="py-16 sm:py-20 lg:py-24 bg-cream dark:bg-forest-950 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-sage-200 dark:border-forest-700">
                    Age-Appropriate Environments
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-900 dark:text-cream mt-4">
                    Featured Learning Programs
                  </h2>
                  <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base mt-2 max-w-xl">
                    Multi-age communities calibrated specifically for each plane of child development.
                  </p>
                </div>
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-forest-800 dark:text-sage-300 hover:text-forest-950 dark:hover:text-white underline underline-offset-4"
                >
                  <span>Explore all program details, ratios & schedules</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {programsData.map((prog, idx) => (
                  <ProgramCard
                    key={prog.id}
                    program={prog}
                    featured={idx === 1}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 4. Why Choose Us Section */}
          <WhyChooseUs />

          {/* 5. Learning Environment Gallery */}
          <EnvironmentGallery />

          {/* 6. Testimonials */}
          <Testimonials />

          {/* 7. Contact CTA Banner */}
          <section className="py-16 sm:py-20 bg-forest-800 dark:bg-forest-900 text-cream relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF7F0_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative max-w-5xl mx-auto px-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-sage-200 bg-forest-700/70 px-3.5 py-1.5 rounded-full border border-forest-600">
                Begin The Discovery
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 mb-4 text-white">
                Observe the Montessori <span className="italic font-semibold text-sage-300">Magic</span> in Person
              </h2>
              <p className="text-forest-200 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                We invite prospective parents to sit quietly in our observation lounge during morning work cycles and witness the calm, focused joy of children at work.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={openTourModal}
                  className="h-12 px-7 rounded-full bg-terracotta text-white font-semibold text-sm hover:bg-terracotta-600 shadow-soft hover:-translate-y-0.5 transition-all"
                >
                  Schedule an Observation Tour
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center h-12 px-7 rounded-full bg-forest-700 text-cream font-semibold text-sm hover:bg-forest-600 border border-forest-600 transition-all"
                >
                  Contact Admissions Office
                </Link>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ======================== HOME 2 ======================== */
        <div className="animate-fadeIn">
          {/* 1. Split-Screen Hero */}
          <HeroSplit />

          {/* 2. Montessori Learning Approach Section */}
          <section className="py-16 sm:py-20 bg-beige-50/70 dark:bg-forest-900/50 border-y border-beige-200 dark:border-forest-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 space-y-5 text-left rtl:text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3 py-1 rounded-full border border-sage-200 dark:border-forest-700">
                    Scientific Pedagogy
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 dark:text-cream leading-snug">
                    A Natural Rhythm That Respects the Absorbent Mind
                  </h2>
                  <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed">
                    Between the ages of 0 and 6, the child&apos;s brain absorbs knowledge effortlessly from their surrounding environment. Rather than lecturing to a room of thirty seated children, our trained guides prepare specialized self-correcting apparatus.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-2xl bg-white dark:bg-forest-900 border border-beige-200 dark:border-forest-700 flex items-start gap-3 shadow-soft">
                      <HeartHandshake className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm text-forest-900 dark:text-cream">Intrinsic Freedom Within Limits</h4>
                        <p className="text-xs text-forest-600 dark:text-beige-200/80 mt-0.5">
                          Children choose work freely, governed by respect for community materials and peers.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-forest-900 border border-beige-200 dark:border-forest-700 flex items-start gap-3 shadow-soft">
                      <Trees className="w-5 h-5 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm text-forest-900 dark:text-cream">Holistic Ecological Connection</h4>
                        <p className="text-xs text-forest-600 dark:text-beige-200/80 mt-0.5">
                          Daily connection to living soil, botanical seeds, and seasonal cycles outdoors.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/curriculum"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-sage-300 hover:text-forest-950 dark:hover:text-white underline underline-offset-4"
                    >
                      <span>Explore all 7 curriculum areas in depth</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border-4 border-white dark:border-forest-800 bg-beige-100 dark:bg-forest-800">
                    <img
                      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000"
                      alt="Child discovering wooden sensorial materials"
                      className="w-full h-[420px] object-contain object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-transparent to-transparent flex items-end p-6">
                      <div className="text-white">
                        <p className="text-xs font-medium text-sage-200">Sensorial Refinement</p>
                        <p className="font-serif text-lg font-bold">&quot;What the hand does, the mind remembers.&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Age-Based Program Cards */}
          <section className="py-16 sm:py-20 bg-cream dark:bg-forest-950 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta bg-terracotta-50 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-terracotta-200 dark:border-forest-700">
                  Progression of Growth
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 dark:text-cream mt-4 mb-2">
                  Three Developmental Pod Communities
                </h2>
                <p className="text-forest-700 dark:text-beige-200 text-sm">
                  Carefully tailored environments matching each developmental stage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {programsData.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </div>
          </section>

          {/* 4. Learning Benefits Comparison */}
          <section className="py-16 bg-white dark:bg-forest-900/40 border-y border-beige-200 dark:border-forest-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="font-serif text-3xl font-bold text-forest-900 dark:text-cream mb-3">
                  Montessori Pod vs Conventional Classrooms
                </h2>
                <p className="text-forest-700 dark:text-beige-200 text-xs sm:text-sm">
                  How an intentional Montessori environment fosters deep resilience and joy.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-beige-200 dark:border-forest-800">
                <table className="w-full text-left rtl:text-right border-collapse min-w-[600px] text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-beige-300 dark:border-forest-700 bg-beige-100/70 dark:bg-forest-900">
                      <th className="p-4 font-serif font-bold text-forest-900 dark:text-cream">Learning Dimension</th>
                      <th className="p-4 font-serif font-bold text-forest-900 dark:text-sage-200 bg-sage-100/60 dark:bg-forest-800/80">
                        Montessori Learning Pod
                      </th>
                      <th className="p-4 font-serif font-bold text-softbrown-500 dark:text-beige-300">
                        Conventional Schooling
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige-200 dark:divide-forest-800">
                    <tr>
                      <td className="p-4 font-semibold text-forest-800 dark:text-cream">Learning Rhythm</td>
                      <td className="p-4 bg-sage-50/50 dark:bg-forest-900/60 text-forest-800 dark:text-beige-100 font-medium">
                        Uninterrupted 3-hour self-directed work periods
                      </td>
                      <td className="p-4 text-forest-600 dark:text-beige-300">
                        Fixed 45-minute periods set by external bells
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-forest-800 dark:text-cream">Age Structure</td>
                      <td className="p-4 bg-sage-50/50 dark:bg-forest-900/60 text-forest-800 dark:text-beige-100 font-medium">
                        Multi-age cohorts (18m–3y, 3–6y, 6–9y) with peer mentorship
                      </td>
                      <td className="p-4 text-forest-600 dark:text-beige-300">
                        Single-grade cohorts segregated by birthdate
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-forest-800 dark:text-cream">Curriculum Progression</td>
                      <td className="p-4 bg-sage-50/50 dark:bg-forest-900/60 text-forest-800 dark:text-beige-100 font-medium">
                        Individualized pace matching sensitive periods
                      </td>
                      <td className="p-4 text-forest-600 dark:text-beige-300">
                        Standardized pacing for entire classroom
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-forest-800 dark:text-cream">Motivation &amp; Assessment</td>
                      <td className="p-4 bg-sage-50/50 dark:bg-forest-900/60 text-forest-800 dark:text-beige-100 font-medium">
                        Intrinsic joy, self-correcting apparatus, narrative portfolios
                      </td>
                      <td className="p-4 text-forest-600 dark:text-beige-300">
                        Letter grades, gold stars, competitive rankings
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-forest-800 dark:text-cream">Classroom Environment</td>
                      <td className="p-4 bg-sage-50/50 dark:bg-forest-900/60 text-forest-800 dark:text-beige-100 font-medium">
                        Prepared sanctuary, natural wood materials, open flow outdoors
                      </td>
                      <td className="p-4 text-forest-600 dark:text-beige-300">
                        Desks facing blackboard, teacher-centered instruction
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 5. Parent Testimonials */}
          <Testimonials />

          {/* 6. Enrollment CTA */}
          <section className="py-16 bg-cream dark:bg-forest-950 transition-colors">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="p-8 sm:p-12 rounded-4xl bg-gradient-to-br from-beige-200/80 via-white to-sage-100/50 dark:from-forest-900 dark:via-forest-900 dark:to-forest-800 border border-beige-300 dark:border-forest-700 shadow-soft-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-white dark:bg-forest-800 px-3 py-1 rounded-full border border-beige-200 dark:border-forest-600">
                  Admissions Open
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 dark:text-cream mt-4 mb-3">
                  Begin Your Child&apos;s Lifelong Love of Learning
                </h2>
                <p className="text-forest-700 dark:text-beige-200 text-sm max-w-xl mx-auto mb-8">
                  Spaces in each pod community are intentionally limited to preserve intimate guide-to-child ratios. Submit an application or book an observation.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => openEnrollModal()}
                    className="h-12 px-7 rounded-full bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-cream dark:text-forest-950 font-semibold text-sm shadow-soft transition-all"
                  >
                    Start Online Application
                  </button>
                  <button
                    type="button"
                    onClick={openTourModal}
                    className="h-12 px-7 rounded-full bg-white dark:bg-forest-800 text-forest-800 dark:text-cream font-semibold text-sm hover:bg-beige-100 dark:hover:bg-forest-700 border border-beige-300 dark:border-forest-600 transition-all"
                  >
                    Schedule Morning Tour
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
