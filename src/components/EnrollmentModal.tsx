import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, CheckCircle2, Sparkles, User, Mail, Phone, Calendar } from 'lucide-react';
import { programsData } from '../data/programsData';

export const EnrollmentModal: React.FC = () => {
  const { isEnrollModalOpen, closeEnrollModal, selectedEnrollProgram } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    childName: '',
    childBirthDate: '',
    program: selectedEnrollProgram || programsData[1].title,
    startDate: 'Fall Term (September 2026)',
    previousExperience: 'None (First School Experience)',
    comments: ''
  });

  // Sync if selectedEnrollProgram changes
  React.useEffect(() => {
    if (selectedEnrollProgram) {
      setFormData(prev => ({ ...prev, program: selectedEnrollProgram }));
    }
  }, [selectedEnrollProgram]);

  if (!isEnrollModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    closeEnrollModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-cream dark:bg-forest-900 rounded-3xl p-6 md:p-8 shadow-soft-xl border border-beige-300 dark:border-forest-700 max-h-[92vh] overflow-y-auto text-forest-900 dark:text-cream"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={closeEnrollModal}
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
            <h3 className="font-serif text-2xl font-bold text-forest-900 dark:text-cream mb-2">Application Submitted!</h3>
            <p className="text-forest-700 dark:text-beige-200 text-sm mb-6 leading-relaxed">
              We are delighted to receive an application for <span className="font-semibold">{formData.childName || 'your child'}</span> in the <span className="font-semibold">{formData.program}</span>. Our admissions team will review your application and send the enrollment packet to <span className="font-semibold">{formData.email}</span>.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-forest-600 text-cream font-medium text-sm hover:bg-forest-700 transition-colors"
            >
              Return to Website
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 dark:bg-forest-800 border border-sage-200 dark:border-forest-700 text-forest-800 dark:text-sage-200 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sage-600 dark:text-sage-300" />
                <span>Admissions 2026–2027</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-forest-900 dark:text-cream">
                Enroll in Montessori Pod
              </h2>
              <p className="text-forest-700 dark:text-beige-200 text-xs md:text-sm mt-1">
                Begin your family’s journey into an intentional, respectful educational community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Parent / Guardian Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <input
                      required
                      type="text"
                      placeholder="Your full name"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <input
                      required
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Child's Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Child's first and last name"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Child's Birth Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <input
                      required
                      type="date"
                      value={formData.childBirthDate}
                      onChange={(e) => setFormData({ ...formData, childBirthDate: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Program of Interest *</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                  >
                    {programsData.map(p => (
                      <option key={p.id} value={p.title}>{p.title} ({p.ageGroup})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Desired Start Session</label>
                  <select
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                  >
                    <option value="Immediate Mid-Term Enrollment">Immediate Mid-Term Opening</option>
                    <option value="Fall Term (September 2026)">Fall Term (September 2026)</option>
                    <option value="Spring Term (January 2027)">Spring Term (January 2027)</option>
                    <option value="Summer Forest Session (June 2026)">Summer Forest Program (June 2026)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                    <input
                      required
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Prior Educational Context</label>
                  <select
                    value={formData.previousExperience}
                    onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                  >
                    <option value="None (First School Experience)">Home Care / First School</option>
                    <option value="Previous Montessori Experience">Previous Montessori School</option>
                    <option value="Conventional Daycare or Preschool">Conventional Daycare / Preschool</option>
                    <option value="Homeschooling">Homeschooling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">Additional Notes & Family Values</label>
                <textarea
                  rows={2}
                  placeholder="Tell us what you hope your child will discover and experience with us..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEnrollModal}
                  className="px-4 py-2 text-xs font-semibold text-forest-700 hover:text-forest-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-terracotta text-white text-xs font-semibold hover:bg-terracotta-600 shadow-soft transition-all"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

