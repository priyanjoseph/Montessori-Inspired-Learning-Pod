import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      type="button"
      className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 p-3 rounded-full bg-forest-600 text-cream hover:bg-forest-700 shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2"
      aria-label="Scroll back to top of page"
      title="Back to Top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

