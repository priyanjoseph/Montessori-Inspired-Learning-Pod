import React from 'react';
import { Award, Trees, Users, Clock, ShieldCheck, Heart } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: Clock,
      title: '3-Hour Uninterrupted Cycles',
      description: 'Unlike fragmented traditional schedules with bells ringing every 45 minutes, our children dive into prolonged flow states of deep concentration.'
    },
    {
      icon: Users,
      title: 'Multi-Age Peer Mentorship',
      description: 'Children learn in three-year age spans. Older peers reinforce mastery by guiding younger friends, while younger ones observe advanced work with enthusiasm.'
    },
    {
      icon: Award,
      title: 'Certified AMI & AMS Guides',
      description: 'Our lead guides hold international credentials and advanced degrees in child psychology, acting as scientific observers rather than authoritarian lecturers.'
    },
    {
      icon: Trees,
      title: 'Daily Forest & Garden Living',
      description: 'With 2.5 acres of permaculture gardens, native woodland trails, and composting stations, ecological reverence is an everyday lived reality.'
    },
    {
      icon: Heart,
      title: 'Grace & Courtesy Culture',
      description: 'Children learn practical social grace: welcoming visitors, solving differences at the Peace Table, setting family dining tables, and respecting boundaries.'
    },
    {
      icon: ShieldCheck,
      title: 'Non-Competitive Inner Motivation',
      description: 'No gold stars, letter grades, or comparative rankings. Children work for the sheer intrinsic joy of problem-solving and creative contribution.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-cream dark:bg-forest-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta dark:text-terracotta-300 bg-terracotta-50 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-terracotta-200 dark:border-forest-700">
            Why Choose Montessori Pod
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-900 dark:text-cream mt-4 mb-4">
            A Nurturing Haven for Lifelong Confidence
          </h2>
          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
            We provide a sanctuary where children do not just prepare for exams—they build the character, emotional intelligence, and self-reliance to navigate a complex world.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-beige-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 flex items-center justify-center mb-5 group-hover:bg-forest-600 group-hover:text-cream transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-forest-900 dark:text-cream mb-2.5">
                  {r.title}
                </h3>
                <p className="text-forest-700 dark:text-beige-200 text-xs sm:text-sm leading-relaxed">
                  {r.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

