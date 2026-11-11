import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
  Info,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sprout,
  UserCheck,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { DirectionToggle } from '../components/DirectionToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { apiRequest } from '../lib/api';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  google_not_configured:
    'Google OAuth is not configured on this server yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment (.env) to enable live Google Sign-In.',
  facebook_not_configured:
    'Facebook Login is not configured on this server yet. Add FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in your environment (.env) to enable live Facebook Sign-In.',
  google_cancelled: 'Google sign-in was cancelled before completion.',
  facebook_cancelled: 'Facebook sign-in was cancelled before completion.',
  google_invalid_state: 'Google authentication could not be verified (state mismatch). Please try again.',
  facebook_invalid_state: 'Facebook authentication could not be verified (state mismatch). Please try again.',
  google_unverified_email: 'Google did not provide a verified email address for your account.',
  facebook_no_email: 'Facebook did not share an email address for your account. Please grant email permission or sign up with email.',
  google_failed: 'Google authentication failed. Please verify OAuth credentials or sign in with email and password.',
  facebook_failed: 'Facebook authentication failed. Please verify app credentials or sign in with email and password.',
};

const GoogleIcon: React.FC = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
    />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#1877F2"
      d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
    />
  </svg>
);

export const LoginPage: React.FC = () => {
  const { user, authLoading, login } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [oauthNotice, setOauthNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<{
    google: { configured: boolean };
    facebook: { configured: boolean };
  }>({ google: { configured: false }, facebook: { configured: false } });

  useEffect(() => {
    const errCode = searchParams.get('oauth_error');
    if (errCode) {
      setOauthNotice(
        OAUTH_ERROR_MESSAGES[errCode] || 'Social sign-in could not be completed. Please try again.'
      );
    }

    apiRequest<{
      google: { configured: boolean };
      facebook: { configured: boolean };
    }>('/api/auth/providers')
      .then((res) => setProviders({ google: res.google, facebook: res.facebook }))
      .catch(() => {});
  }, [searchParams]);

  if (!authLoading && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOauthNotice('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your portal password.');
      return;
    }

    setIsLoading(true);
    try {
      const signedInUser = await login(email.trim(), password, rememberMe);
      navigate(signedInUser.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: 'google' | 'facebook') => {
    setError('');
    const isConfigured = providers[provider]?.configured;
    if (!isConfigured) {
      setOauthNotice(OAUTH_ERROR_MESSAGES[`${provider}_not_configured`]);
      return;
    }
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cream-50 dark:bg-forest-950 font-sans text-forest-950 dark:text-cream transition-colors">
      {/* LEFT PANEL: Montessori Botanical Atmosphere */}
      <div className="relative lg:w-5/12 xl:w-[46%] bg-forest-900 overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-cream min-h-[280px] lg:min-h-screen">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1400"
            alt="Montessori wooden natural materials on shelf"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950/90 via-forest-900/80 to-forest-800/75" />
        </div>

        {/* Brand & Home Link */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-sage-400/20 border border-sage-400/40 backdrop-blur-sm text-sage-200 flex items-center justify-center group-hover:bg-sage-400/30 transition-colors">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-cream block leading-none">
                Montessori Learning Pod
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sage-300 font-semibold mt-0.5 block">
                Family & Guide Portal
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-beige-100 hover:text-cream bg-forest-800/70 hover:bg-forest-800 px-3.5 py-2 rounded-full border border-forest-700 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Inspirational Quote */}
        <div className="relative z-10 my-8 lg:my-0 max-w-md space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-500/20 border border-sage-400/30 text-sage-200 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role-Verified Community Portal</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-cream">
            “The land is where our roots are. The children must be taught to feel and live in harmony with the Earth.”
          </h2>
          <p className="text-beige-200 text-sm italic font-serif">
            — Dr. Maria Montessori
          </p>

          <div className="pt-4 border-t border-forest-700/80 grid grid-cols-2 gap-4 text-xs text-beige-200">
            <div>
              <p className="font-semibold text-cream mb-1">Parents & Families</p>
              <p className="text-beige-300/90 leading-relaxed">
                Daily learning logs, term progress reports, attendance, and family tuition statements.
              </p>
            </div>
            <div>
              <p className="font-semibold text-cream mb-1">Campus Administrators</p>
              <p className="text-beige-300/90 leading-relaxed">
                Manage students, guides, attendance, tuition ledger, events, and website content.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-sage-300/80">
          256-bit scrypt credential hashing • HttpOnly role-isolated sessions
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-14 xl:px-20 py-8 sm:py-12 bg-cream-50 dark:bg-forest-950 relative">
        <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6 flex items-center gap-2">
          <DirectionToggle />
          <ThemeToggle compact />
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-beige-100 dark:bg-forest-900 hover:bg-beige-200 dark:hover:bg-forest-800 text-forest-800 dark:text-beige-100 text-xs font-semibold transition-colors border border-beige-300 dark:border-forest-700"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto pt-6 sm:pt-0">
          <div className="text-left rtl:text-right mb-6">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 dark:text-cream tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-forest-700 dark:text-beige-200 text-sm mt-1.5 leading-relaxed">
              Sign in to access your Parent Community Portal.
            </p>
          </div>

          {/* Demo Credential Quick-Fill Box */}
          <div className="mb-5 p-3.5 rounded-2xl bg-sage-100/75 dark:bg-forest-900/90 border border-sage-200 dark:border-forest-700 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-forest-900 dark:text-cream mb-2">
              <KeyRound className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300" />
              <span>Demo Quick-Fill Accounts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('parent@example.com');
                  setPassword('parent123');
                  setError('');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-forest-800 border border-beige-300 dark:border-forest-700 hover:border-forest-500 text-left text-forest-800 dark:text-beige-100 font-medium transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-forest-600 dark:text-sage-300 flex-shrink-0" />
                <span className="truncate">Parent Demo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@montessorilearningpod.edu');
                  setPassword('admin123');
                  setError('');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-forest-800 border border-beige-300 dark:border-forest-700 hover:border-forest-500 text-left text-forest-800 dark:text-beige-100 font-medium transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600 dark:text-sage-300 flex-shrink-0" />
                <span className="truncate">Admin Demo</span>
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 p-3.5 rounded-2xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {oauthNotice && (
            <div
              role="status"
              className="mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 text-xs flex items-start gap-2.5 leading-relaxed"
            >
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700 dark:text-amber-300" />
              <span>{oauthNotice}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-3.5 w-4 h-4 text-forest-500 dark:text-sage-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="parent@example.com"
                  className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream placeholder:text-softbrown-400 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-3.5 w-4 h-4 text-forest-500 dark:text-sage-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 rtl:pl-12 rtl:pr-11 py-3 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream placeholder:text-softbrown-400 shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-3 p-1 text-forest-500 hover:text-forest-800 dark:text-sage-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-forest-800 dark:text-beige-200 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-beige-400 text-forest-600 focus:ring-forest-500 cursor-pointer accent-forest-600"
                />
                <span className="font-medium">Remember Me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-forest-700 dark:text-sage-300 hover:text-forest-900 dark:hover:text-cream font-semibold underline decoration-beige-400 underline-offset-4 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-cream dark:text-forest-950 font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-cream dark:border-forest-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-beige-300 dark:border-forest-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-cream-50 dark:bg-forest-950 px-3 text-forest-600 dark:text-beige-300 font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 hover:border-forest-500 dark:hover:border-sage-400 hover:bg-beige-50 dark:hover:bg-forest-800 text-forest-900 dark:text-cream text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('facebook')}
              className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 hover:border-forest-500 dark:hover:border-sage-400 hover:bg-beige-50 dark:hover:bg-forest-800 text-forest-900 dark:text-cream text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <FacebookIcon />
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Create New Account Link */}
          <div className="mt-6 pt-5 border-t border-beige-200 dark:border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-forest-700 dark:text-beige-200">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-forest-900 dark:text-sage-300 hover:underline underline-offset-4"
              >
                Create New Account
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

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-forest-600/80 dark:text-beige-300/75">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
            <span>New registrations open strictly as verified Parent/User accounts.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
