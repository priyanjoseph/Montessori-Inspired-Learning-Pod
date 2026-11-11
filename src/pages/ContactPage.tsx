import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Sparkles, Navigation, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

/**
 * Campus location configuration sourced from the existing Pod Campus Headquarters details.
 * Update `streetAddress` and `mapQuery` if a confirmed physical street address changes before publishing.
 */
const CAMPUS_LOCATION = {
  name: 'Montessori Learning Pod',
  streetAddress: '742 Evergreen Botanical Way, Boulder, CO 80302',
  areaLabel: 'Boulder Foothills, CO 80302',
  parkingNote: 'Free parent visitor parking available at North Cedar Gateway.',
  mapQuery: '742 Evergreen Botanical Way, Boulder, CO 80302',
};

export const ContactPage: React.FC = () => {
  const { openTourModal } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admissions Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please choose a subject.';
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please share a brief message (at least 10 characters).';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 600);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Admissions Inquiry',
      message: ''
    });
    setErrors({});
  };

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    CAMPUS_LOCATION.mapQuery
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    CAMPUS_LOCATION.mapQuery
  )}`;

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-cream dark:bg-forest-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-sage-200 dark:border-forest-700">
            We Welcome Your Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-900 dark:text-cream mt-4 mb-4">
            Connect With Our Community
          </h1>
          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
            Whether you have questions regarding our admissions timeline, toddler readiness, or want to schedule a quiet classroom observation, our team is here to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-stretch">
          
          {/* Left Column: Contact Form with Validation & Feedback (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white dark:bg-forest-900 rounded-4xl p-6 sm:p-10 border border-beige-300 dark:border-forest-700 shadow-soft-lg">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-sage-100 dark:bg-forest-800 text-forest-600 dark:text-sage-300 flex items-center justify-center mx-auto mb-4 border border-sage-200 dark:border-forest-700">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest-900 dark:text-cream mb-2">
                  Message Successfully Delivered!
                </h3>
                <p className="text-forest-700 dark:text-beige-200 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you for reaching out, <span className="font-semibold">{formData.name}</span>. An admissions counselor will respond to <span className="font-semibold">{formData.email}</span> within one business day.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-forest-600 text-cream text-xs font-semibold hover:bg-forest-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="font-serif text-2xl font-bold text-forest-900 dark:text-cream">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-forest-600 dark:text-beige-200 mt-1">
                    Please fill out the form below and we will gladly assist you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-forest-800 dark:text-sage-200 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Eleanor Vance"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream/50 dark:bg-forest-950/60 border ${
                          errors.name ? 'border-red-500 focus:ring-red-400' : 'border-beige-300 dark:border-forest-700 focus:ring-forest-500'
                        } focus:outline-none focus:ring-2 text-forest-900 dark:text-cream`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest-800 dark:text-sage-200 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream/50 dark:bg-forest-950/60 border ${
                          errors.email ? 'border-red-500 focus:ring-red-400' : 'border-beige-300 dark:border-forest-700 focus:ring-forest-500'
                        } focus:outline-none focus:ring-2 text-forest-900 dark:text-cream`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-forest-800 dark:text-sage-200 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream/50 dark:bg-forest-950/60 border border-beige-300 dark:border-forest-700 focus:ring-2 focus:ring-forest-500 focus:outline-none text-forest-900 dark:text-cream"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest-800 dark:text-sage-200 mb-1">
                        Inquiry Subject *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream/50 dark:bg-forest-950/60 border border-beige-300 dark:border-forest-700 focus:ring-2 focus:ring-forest-500 focus:outline-none text-forest-900 dark:text-cream"
                      >
                        <option value="Admissions Inquiry">Admissions &amp; Enrollment</option>
                        <option value="Private Observation Visit">Private Observation Visit</option>
                        <option value="Toddler Readiness Consultation">Toddler Readiness (18m–3y)</option>
                        <option value="Tuition & Financial Assistance">Tuition &amp; Financial Assistance</option>
                        <option value="Community & Press Relations">Community / Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-800 dark:text-sage-200 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please tell us about your child's age, your educational priorities, or any questions you may have..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream/50 dark:bg-forest-950/60 border ${
                        errors.message ? 'border-red-500 focus:ring-red-400' : 'border-beige-300 dark:border-forest-700 focus:ring-forest-500'
                      } focus:outline-none focus:ring-2 text-forest-900 dark:text-cream`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-softbrown-400 dark:text-beige-300/75">
                      We treat your family&apos;s personal privacy with reverence.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-forest-600 dark:bg-sage-500 text-cream dark:text-forest-950 text-xs font-semibold hover:bg-forest-700 dark:hover:bg-sage-400 shadow-soft transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <span>Submit Message</span>
                          <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Right Column: Campus Headquarters & Visiting Information (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="h-full bg-white dark:bg-forest-900 rounded-4xl p-6 sm:p-8 border border-beige-300 dark:border-forest-700 shadow-soft-lg flex flex-col justify-between gap-6">
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-800 px-3 py-1 rounded-full border border-sage-200 dark:border-forest-700">
                    Campus Information
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-900 dark:text-cream mt-3">
                    Pod Campus Headquarters
                  </h3>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-forest-700 dark:text-beige-200">
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sage-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-forest-600 dark:text-sage-300" />
                    </div>
                    <div>
                      <span className="font-bold text-forest-900 dark:text-cream block">Campus Address</span>
                      <span>{CAMPUS_LOCATION.streetAddress}</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-terracotta-100 dark:bg-forest-800 text-terracotta-700 dark:text-terracotta-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-terracotta-600 dark:text-terracotta-300" />
                    </div>
                    <div>
                      <span className="font-bold text-forest-900 dark:text-cream block">Admissions Desk</span>
                      <a href="tel:+15553827190" className="hover:text-forest-900 dark:hover:text-white underline">
                        +1 (555) 382-7190
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-beige-200 dark:bg-forest-800 text-forest-700 dark:text-sage-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-forest-600 dark:text-sage-300" />
                    </div>
                    <div>
                      <span className="font-bold text-forest-900 dark:text-cream block">Email Inquiries</span>
                      <a href="mailto:info@montessorilearningpod.edu" className="hover:text-forest-900 dark:hover:text-white underline">
                        info@montessorilearningpod.edu
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-sage-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-forest-700 dark:text-sage-300" />
                    </div>
                    <div>
                      <span className="font-bold text-forest-900 dark:text-cream block">Campus Hours</span>
                      <span>Monday – Friday: 8:00 AM – 5:30 PM</span>
                    </div>
                  </li>
                </ul>

                <div className="p-4 rounded-2xl bg-beige-50 dark:bg-forest-950/60 border border-beige-200 dark:border-forest-800 text-xs text-forest-700 dark:text-beige-200">
                  <p className="font-semibold text-forest-900 dark:text-cream mb-1">
                    Visitor Arrival &amp; Observation Notes
                  </p>
                  <p className="leading-relaxed">
                    {CAMPUS_LOCATION.parkingNote} Morning observation visits are scheduled quietly during active 3-hour work cycles.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={openTourModal}
                  className="w-full py-3 rounded-full bg-beige-200 dark:bg-forest-800 hover:bg-forest-600 dark:hover:bg-sage-500 hover:text-cream dark:hover:text-forest-950 text-forest-900 dark:text-cream text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                  <span>Prefer an In-Person Tour? Book Here</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Dedicated Embedded Google Maps Section: Find Our Campus */}
        <section className="mt-10 bg-white dark:bg-forest-900 rounded-4xl p-6 sm:p-8 border border-beige-300 dark:border-forest-700 shadow-soft-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-800 px-3 py-1 rounded-full border border-sage-200 dark:border-forest-700">
                {CAMPUS_LOCATION.areaLabel}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream mt-2.5">
                Find Our Campus
              </h2>
              <p className="text-xs sm:text-sm text-forest-600 dark:text-beige-200 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-terracotta flex-shrink-0" />
                <span>{CAMPUS_LOCATION.streetAddress}</span>
              </p>
            </div>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-cream dark:text-forest-950 text-xs sm:text-sm font-semibold shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all whitespace-nowrap self-start sm:self-center"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-3xl overflow-hidden border border-beige-300 dark:border-forest-700 bg-beige-100 dark:bg-forest-800 shadow-soft">
            <iframe
              title="Montessori Learning Pod Campus Location Map"
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-softbrown-400 dark:text-beige-300/80">
            <p>{CAMPUS_LOCATION.parkingNote}</p>
            <p>Interactive map: zoom, pan, or click Get Directions for turn-by-turn navigation.</p>
          </div>
        </section>

      </div>
    </div>
  );
};

