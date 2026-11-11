import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, Calendar, Clock, User, Mail, Phone, Baby, CheckCircle2 } from 'lucide-react';

export const ScheduleTourModal: React.FC = () => {
  const { isTourModalOpen, closeTourModal } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    childName: '',
    childAge: '3-6',
    preferredDate: '',
    preferredTime: 'Morning (9:30 AM - Observation Cycle)',
    notes: ''
  });

  if (!isTourModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Keep confirmation visible for 2.5 seconds or let user close
    }, 100);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      parentName: '',
      email: '',
      phone: '',
      childName: '',
      childAge: '3-6',
      preferredDate: '',
      preferredTime: 'Morning (9:30 AM - Observation Cycle)',
      notes: ''
    });
    closeTourModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-cream dark:bg-forest-900 rounded-3xl p-6 md:p-8 shadow-soft-xl border border-beige-300 dark:border-forest-700 max-h-[92vh] overflow-y-auto text-forest-900 dark:text-cream"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={closeTourModal}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-forest-700 dark:text-beige-200 hover:text-forest-900 dark:hover:text-white bg-beige-100 dark:bg-forest-800 hover:bg-beige-200 dark:hover:bg-forest-700 p-2 rounded-full transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-sage-100 dark:bg-forest-800 text-forest-600 dark:text-sage-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-sage-200 dark:border-forest-700">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest-900 dark:text-cream mb-2">Tour Request Received!</h3>
            <p className="text-forest-700 dark:text-beige-200 text-sm mb-6 leading-relaxed">
              Thank you, <span className="font-semibold">{formData.parentName || 'Parent'}</span>. Our admissions coordinator will confirm your morning observation visit for <span className="font-semibold">{formData.preferredDate || 'your selected date'}</span> within 24 hours.
            </p>
            <div className="p-4 bg-beige-100 dark:bg-forest-800 rounded-2xl text-left rtl:text-right text-xs text-forest-700 dark:text-beige-200 space-y-1.5 mb-6">
              <p><strong>Selected Program:</strong> Age {formData.childAge}</p>
              <p><strong>Visit Window:</strong> {formData.preferredTime}</p>
              <p><strong>Confirmation Sent To:</strong> {formData.email || 'your email'}</p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-forest-600 text-cream font-medium text-sm hover:bg-forest-700 transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta dark:text-terracotta-300 bg-terracotta-50 dark:bg-forest-800 px-2.5 py-1 rounded-full border border-terracotta-200 dark:border-forest-700">
                Private Observation Visit
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-forest-900 dark:text-cream mt-2">
                Schedule a Pod Tour
              </h2>
              <p className="text-forest-700 dark:text-beige-200 text-xs md:text-sm mt-1">
                Experience our peaceful, child-centered Montessori classrooms in quiet action.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Maria Gonzalez"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900 placeholder:text-softbrown-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <input
                      required
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900 placeholder:text-softbrown-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900 placeholder:text-softbrown-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Child's Age Group
                  </label>
                  <div className="relative">
                    <Baby className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <select
                      value={formData.childAge}
                      onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                    >
                      <option value="18m-3y">Toddler Community (18m – 3 yrs)</option>
                      <option value="3-6">Primary / Casa (3 – 6 yrs)</option>
                      <option value="6-9">Early Elementary (6 – 9 yrs)</option>
                      <option value="expecting">Expecting / Infant Planning</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <input
                      required
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Observation Window
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                    >
                      <option value="Morning (9:30 AM - Observation Cycle)">9:30 AM (Work Cycle Observation)</option>
                      <option value="Late Morning (11:00 AM - Outdoor / Lunch)">11:00 AM (Outdoor & Dining)</option>
                      <option value="Afternoon (3:30 PM - Q&A with Lead Guide)">3:30 PM (Detailed Q&A with Guide)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Questions or Developmental Priorities
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your child's personality, interests, or any questions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900 placeholder:text-softbrown-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeTourModal}
                  className="px-4 py-2 text-xs font-semibold text-forest-700 hover:text-forest-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-forest-600 text-cream text-xs font-semibold hover:bg-forest-700 shadow-soft transition-all"
                >
                  Confirm Tour Booking
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

