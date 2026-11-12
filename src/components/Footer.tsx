import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Heart, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const { openTourModal } = useSettings();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 400);
    }
  };

  return (
    <footer className="bg-forest-900 dark:bg-forest-950 text-cream pt-16 pb-12 border-t border-forest-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-forest-800">
          
          {/* Column 1: Logo & Short Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-2xl bg-sage-400 text-forest-900 flex items-center justify-center shadow-soft">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 stroke-forest-900"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#9CAF88" fillOpacity="0.4"/>
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-white block">
                  Montessori Pod
                </span>
                <span className="text-[11px] text-sage-200 tracking-wider uppercase block">
                  Curiosity • Autonomy • Grace
                </span>
              </div>
            </Link>

            <p className="text-forest-200/80 text-sm leading-relaxed">
              Montessori Pod is a nurturing learning sanctuary where children explore, create, develop bodily independence, and learn at their own natural pace.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-sage-300">
              <ShieldCheck className="w-4 h-4 text-sage-400" />
              <span>AMI & AMS Pedagogical Standards</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 relative inline-block">
              Quick Links
              <span className="block w-6 h-0.5 bg-terracotta mt-1 rounded-full"></span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-forest-200 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600 group-hover:bg-sage-400 transition-colors"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-forest-200 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600 group-hover:bg-sage-400 transition-colors"></span>
                  Programs (18m – 9 yrs)
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="text-forest-200 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600 group-hover:bg-sage-400 transition-colors"></span>
                  Curriculum Areas
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-forest-200 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600 group-hover:bg-sage-400 transition-colors"></span>
                  About Us & Guides
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-forest-200 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600 group-hover:bg-sage-400 transition-colors"></span>
                  Contact & Tours
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sage-300 hover:text-white transition-colors flex items-center gap-1.5 group font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta group-hover:scale-125 transition-transform"></span>
                  Parent Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 relative inline-block">
              Contact Information
              <span className="block w-6 h-0.5 bg-terracotta mt-1 rounded-full"></span>
            </h4>
            <ul className="space-y-3.5 text-sm text-forest-200">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-terracotta mt-0.5 flex-shrink-0" />
                <span className="leading-snug">
                  742 Evergreen Botanical Way<br />
                  Boulder, CO 80302
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href="tel:+15553827190" className="hover:text-white transition-colors">
                  +1 (555) 382-7190
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-terracotta flex-shrink-0" />
                <a href="mailto:admissions@montessorilearningpod.edu" className="hover:text-white transition-colors">
                  info@montessorilearningpod.edu
                </a>
              </li>
              <li className="flex items-start gap-3 pt-1 text-xs text-forest-300">
                <Clock className="w-4 h-4 text-sage-400 mt-0.5 flex-shrink-0" />
                <span>
                  Mon – Fri: 8:00 AM – 5:30 PM<br />
                  Observation Hours by Appointment
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media & Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 relative inline-block">
              Connect & Journal
              <span className="block w-6 h-0.5 bg-terracotta mt-1 rounded-full"></span>
            </h4>
            <p className="text-forest-200 text-xs mb-3 leading-relaxed">
              Follow our daily moments of discovery, classroom reflections, and seasonal child-rearing wisdom.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 mb-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-forest-800 text-cream flex items-center justify-center hover:bg-terracotta hover:scale-105 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-forest-800 text-cream flex items-center justify-center hover:bg-terracotta hover:scale-105 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-forest-800 text-cream flex items-center justify-center hover:bg-terracotta hover:scale-105 transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <p className="text-xs font-semibold text-white mb-1.5">The Mindful Child Newsletter</p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-forest-800/80 border border-sage-500/30 text-xs text-sage-300">
                  <Check className="w-4 h-4 text-sage-400" />
                  <span>Subscribed! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-forest-800/90 text-white placeholder:text-forest-400 border border-forest-700 focus:outline-none focus:ring-1 focus:ring-sage-400"
                    />
                    <button
                      type="submit"
                      aria-label="Submit newsletter subscription"
                      className="absolute right-1 rtl:right-auto rtl:left-1 top-1 bottom-1 px-2.5 bg-terracotta text-white rounded-lg hover:bg-terracotta-600 transition-colors flex items-center justify-center"
                    >
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-forest-300 gap-4">
          <p className="text-center md:text-left rtl:md:text-right">
            © 2026 Montessori Pod. All rights reserved. Nurturing future thinkers with care and dignity.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              Terms and Conditions
            </Link>
            <button
              onClick={openTourModal}
              className="text-sage-300 hover:text-white transition-colors underline"
            >
              Request Observation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

