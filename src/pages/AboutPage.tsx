import React from 'react';
import { teachersData } from '../data/teachersData';
import { useSettings } from '../context/SettingsContext';
import { Heart, Compass, ShieldCheck, Award, Trees, Users, ArrowRight, Quote } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { openTourModal } = useSettings();

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-cream dark:bg-forest-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-sage-200 dark:border-forest-700">
            About Our Learning Pod
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 dark:text-cream mt-4 mb-4">
            A Living Sanctuary for Childhood
          </h1>
          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
            Founded with the conviction that education should honor the child's natural developmental rhythm, rather than conditioning conformity.
          </p>
        </div>

        {/* 1. Our Story Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-soft-xl border-4 border-white dark:border-forest-800">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200"
                  alt="Montessori learning pod founding and classroom space"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 rtl:-right-auto rtl:-left-6 hidden sm:block p-4 rounded-2xl bg-white/95 dark:bg-forest-900/95 backdrop-blur-md shadow-soft-lg border border-beige-200 dark:border-forest-700 max-w-[220px]">
                <p className="font-serif text-2xl font-bold text-forest-800 dark:text-cream">Founded 2018</p>
                <p className="text-xs text-forest-600 dark:text-beige-200 mt-0.5">8 years of child-centered community stewardship.</p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5 text-left rtl:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta dark:text-terracotta-300 bg-terracotta-50 dark:bg-forest-900 px-3 py-1 rounded-full border border-terracotta-200 dark:border-forest-700">
                Our Genesis
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 dark:text-cream">
                How Our Pod Began
              </h2>
              <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed">
                In 2018, a collective of AMI-certified educators and developmental pediatricians joined hands in Boulder, Colorado. Witnessing rising anxiety, screen addiction, and test pressure in early education, we envisioned an antidote: an authentic, micro-community Montessori pod nestled beside protected woodlands.
              </p>
              <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed">
                We began with one humble Casa dei Bambini classroom of twelve children. Today, our pod has matured into a thriving three-tier community (Toddler, Primary, and Early Elementary) rooted in mutual reverence, slow childhood, and deep scientific inquiry.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-forest-800 dark:text-sage-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                  <span>AMI Affiliated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                  <span>Certified Nature Sanctuary</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Mission & Vision */}
        <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-4xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft relative overflow-hidden group hover:shadow-soft-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-600 dark:text-sage-300">Our Purpose</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream mt-1 mb-4">
              Our Mission
            </h3>
            <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
              To cultivate independent, empathetic, and intellectually curious human beings by providing an authentic, scientifically grounded Montessori environment that nurtures each child's intrinsic joy of discovery, self-discipline, and deep care for the living Earth.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-4xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft relative overflow-hidden group hover:shadow-soft-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 dark:bg-forest-800 text-terracotta-700 dark:text-terracotta-300 flex items-center justify-center mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta dark:text-terracotta-300">Our Aspiration</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream mt-1 mb-4">
              Our Vision
            </h3>
            <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
              A peaceful world where education is recognized not as a competitive race, but as a joyful voyage of self-construction—raising courageous young citizens who think critically, act ethically, and live in harmonious stewardship with all creatures.
            </p>
          </div>
        </section>

        {/* 3. The Prepared Learning Environment Description */}
        <section className="mb-20 p-8 sm:p-12 rounded-4xl bg-beige-100/70 dark:bg-forest-900/60 border border-beige-300 dark:border-forest-700">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-white dark:bg-forest-800 px-3.5 py-1.5 rounded-full border border-beige-300 dark:border-forest-700">
              The Architecture of Calm
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 dark:text-cream mt-3 mb-3">
              The Prepared Environment
            </h2>
            <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed">
              Dr. Montessori taught that a disorganized space causes a scattered mind. Every square foot of our campus is engineered with serene beauty and functional purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-200 dark:border-forest-700">
              <h4 className="font-serif font-bold text-base text-forest-900 dark:text-cream mb-2">Natural Aesthetics</h4>
              <p className="text-xs text-forest-600 dark:text-beige-200/85 leading-relaxed">
                Solid native cedar furnishings, non-toxic organic finishes, natural wool floor rugs, living indoor ferns, and expansive floor-to-ceiling daylight.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-200 dark:border-forest-700">
              <h4 className="font-serif font-bold text-base text-forest-900 dark:text-cream mb-2">True Proportional Scale</h4>
              <p className="text-xs text-forest-600 dark:text-beige-200/85 leading-relaxed">
                Everything is child-proportioned: low water basins, real porcelain pitchers, small brooms, and child-safe cutlery that instill authentic independence.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-200 dark:border-forest-700">
              <h4 className="font-serif font-bold text-base text-forest-900 dark:text-cream mb-2">Seamless Outdoor Flow</h4>
              <p className="text-xs text-forest-600 dark:text-beige-200/85 leading-relaxed">
                French doors open constantly to covered porches, raised vegetable garden beds, and the forest trail, making nature an everyday classroom extension.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Certified Guide Team Section (Balanced 3 x 2 Grid on Desktop) */}
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta dark:text-terracotta-300 bg-terracotta-50 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-terracotta-200 dark:border-forest-700">
              Educators &amp; Observers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 dark:text-cream mt-3 mb-3">
              Meet Our Certified Guides
            </h2>
            <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed">
              Our guides are international AMI/AMS diplomates whose lifelong devotion is observing, protecting, and nurturing each child's developing spirit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {teachersData.slice(0, 6).map((guide) => (
              <div
                key={guide.id}
                className="h-full rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="relative h-60 overflow-hidden bg-beige-100 dark:bg-forest-800 flex-shrink-0">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="w-full h-full object-cover object-[50%_25%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-forest-950/15 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white text-left rtl:text-right">
                    <p className="text-xs font-bold text-sage-200">{guide.experience}</p>
                    <h3 className="font-serif text-lg font-bold leading-snug">{guide.name}</h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between text-left rtl:text-right">
                  <div>
                    <p className="text-xs font-semibold text-terracotta dark:text-terracotta-300 mb-2">
                      {guide.role}
                    </p>
                    <p className="text-[11px] font-medium text-forest-700 dark:text-sage-200 mb-3 bg-beige-100 dark:bg-forest-800 px-2.5 py-1 rounded-lg inline-block">
                      {guide.credentials}
                    </p>
                    <p className="text-xs text-forest-700 dark:text-beige-200 leading-relaxed mb-4">
                      {guide.bio}
                    </p>
                  </div>

                  <div className="pt-3 mt-auto border-t border-beige-200 dark:border-forest-800">
                    <blockquote className="text-[11px] italic text-softbrown-500 dark:text-beige-300/85 flex items-start gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-terracotta flex-shrink-0 mt-0.5" />
                      <span>"{guide.quote}"</span>
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={openTourModal}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-forest-600 dark:bg-sage-500 text-cream dark:text-forest-950 font-semibold text-sm hover:bg-forest-700 dark:hover:bg-sage-400 shadow-soft hover:shadow-soft-lg transition-all"
          >
            <span>Meet Our Guides on a Campus Visit</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};

