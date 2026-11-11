import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Baby,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  User,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { DirectionToggle } from '../components/DirectionToggle';
import { ThemeToggle } from '../components/ThemeToggle';

const PROGRAM_OPTIONS = [
  'Toddler Community (18m – 3 yrs)',
  'Primary Program (Casa dei Bambini, 3 – 6 yrs)',
  'Early Elementary Pod (6 – 9 yrs)',
];

export const RegisterPage: React.FC = () => {
  const { user, authLoading, register } = useSettings();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [preferredProgram, setPreferredProgram] = useState(PROGRAM_OPTIONS[1]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!authLoading && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const passwordRules = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.trim() && phone.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (passwordRules.some((r) => !r.met)) {
      setError('Please ensure your password satisfies all strength requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (childName.trim().length < 2) {
      setError("Please enter your child's full name.");
      return;
    }
    if (!childAge.trim()) {
      setError("Please specify your child's age.");
      return;
    }
    if (!agreeToTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        confirmPassword,
        childName: childName.trim(),
        childAge: childAge.trim(),
        preferredProgram,
        agreeToTerms,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please review your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cream-50 dark:bg-forest-950 font-sans text-forest-950 dark:text-cream transition-colors">
      {/* Left Intro Column */}
      <div className="lg:w-5/12 xl:w-[42%] bg-forest-900 text-cream p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200"
            alt="Children learning with Montessori wooden materials"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950/90 via-forest-900/85 to-forest-800/80" />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-400/20 border border-sage-400/40 text-sage-200 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg block leading-none">
                Montessori Learning Pod
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sage-300 font-semibold mt-0.5 block">
                Family Enrollment Registration
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-forest-800/80 hover:bg-forest-800 text-beige-100 px-3.5 py-2 rounded-full border border-forest-700"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <div className="relative z-10 my-8 space-y-5 max-w-md">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-500/20 border border-sage-400/30 text-sage-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dedicated Parent Portal Access</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Begin Your Family’s Montessori Journey
          </h2>
          <p className="text-sm text-beige-200 leading-relaxed">
            Creating a Parent Community account connects your family profile directly with your child’s personalized classroom studio, daily observations, progress reports, and tuition records.
          </p>
          <ul className="space-y-2.5 text-xs text-beige-100">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sage-300 flex-shrink-0" />
              <span>Private photo logs & observation reflections</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sage-300 flex-shrink-0" />
              <span>Transparent tuition schedule & instant receipts</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sage-300 flex-shrink-0" />
              <span>Direct communication with Montessori lead guides</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-sage-300/80">
          All newly created family accounts automatically receive strict Parent Portal permissions.
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 sm:py-12 relative">
        <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6 flex items-center gap-2">
          <DirectionToggle />
          <ThemeToggle compact />
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-beige-100 dark:bg-forest-900 border border-beige-300 dark:border-forest-700 text-forest-800 dark:text-beige-100 text-xs font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <div className="w-full max-w-xl mx-auto pt-8 sm:pt-4">
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold text-forest-900 dark:text-cream">
              Create New Account
            </h1>
            <p className="text-sm text-forest-700 dark:text-beige-200 mt-1">
              Register as a parent or guardian to create your child’s personalized portal profile.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-2xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Parent Full Name */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                  Parent / Guardian Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
                  />
                </div>
              </div>

              {/* 2. Email Address */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="family@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
                  />
                </div>
              </div>
            </div>

            {/* 3. Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
                />
              </div>
            </div>

            {/* 4 & 5. Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create strong password"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-3 p-1 text-forest-500 hover:text-forest-800 dark:text-sage-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-3 p-1 text-forest-500 hover:text-forest-800 dark:text-sage-300"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength indicators */}
            <div className="flex flex-wrap gap-2">
              {passwordRules.map((rule) => (
                <span
                  key={rule.label}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                    rule.met
                      ? 'bg-sage-100 dark:bg-forest-800 border-sage-300 dark:border-sage-500/40 text-forest-800 dark:text-sage-200'
                      : 'bg-beige-100 dark:bg-forest-900 border-beige-300 dark:border-forest-700 text-forest-600 dark:text-beige-300'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{rule.label}</span>
                </span>
              ))}
            </div>

            {/* 6, 7, 8. Child & Program Info */}
            <div className="pt-2 border-t border-beige-200 dark:border-forest-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                  Child’s Full Name *
                </label>
                <div className="relative">
                  <Baby className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Noah Lin"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                  Child’s Age *
                </label>
                <input
                  type="text"
                  required
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  placeholder="e.g. 4 Years, 2 Months"
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                Preferred Montessori Program *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                <select
                  value={preferredProgram}
                  onChange={(e) => setPreferredProgram(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
                >
                  {PROGRAM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-forest-800 dark:text-beige-200 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-beige-400 text-forest-600 accent-forest-600 cursor-pointer"
              />
              <span>
                I agree to the Montessori Learning Pod{' '}
                <span className="font-semibold text-forest-900 dark:text-cream underline underline-offset-2">
                  Family Community Terms of Service
                </span>{' '}
                and{' '}
                <span className="font-semibold text-forest-900 dark:text-cream underline underline-offset-2">
                  Student Privacy Policy
                </span>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-cream dark:text-forest-950 font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-beige-200 dark:border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-forest-700 dark:text-beige-200">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-forest-900 dark:text-sage-300 hover:underline underline-offset-4"
              >
                Login
              </Link>
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-semibold text-forest-700 dark:text-sage-300 hover:text-forest-950 dark:hover:text-cream"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

