import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  Sprout,
  User,
  UserPlus,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { DirectionToggle } from '../components/DirectionToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { apiRequest } from '../lib/api';

type AuthTab = 'signin' | 'register';

interface LoginPageProps {
  initialTab?: AuthTab;
}

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

const INPUT_BASE =
  'w-full h-11 rounded-2xl bg-white dark:bg-forest-950/60 border border-beige-300/90 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 text-sm text-forest-950 dark:text-cream placeholder:text-softbrown-400 dark:placeholder:text-sage-400/70 shadow-sm transition-all';

const LABEL_BASE =
  'block text-xs font-semibold text-forest-900 dark:text-beige-100';

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

export const LoginPage: React.FC<LoginPageProps> = ({ initialTab = 'signin' }) => {
  const { login, register } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resolvedInitialTab: AuthTab =
    searchParams.get('tab') === 'register' || initialTab === 'register' ? 'register' : 'signin';

  const [activeTab, setActiveTab] = useState<AuthTab>(resolvedInitialTab);

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Create Account state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Shared feedback state
  const [error, setError] = useState('');
  const [oauthNotice, setOauthNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<{
    google: { configured: boolean };
    facebook: { configured: boolean };
  }>({ google: { configured: false }, facebook: { configured: false } });

  useEffect(() => {
    setActiveTab(resolvedInitialTab);
  }, [resolvedInitialTab]);

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

  const switchTab = (nextTab: AuthTab) => {
    setActiveTab(nextTab);
    setError('');
    setOauthNotice('');
  };

  const passwordRules = [
    { label: '8+ chars', met: regPassword.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(regPassword) },
    { label: 'Lowercase', met: /[a-z]/.test(regPassword) },
    { label: 'Number', met: /[0-9]/.test(regPassword) },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setOauthNotice('');

    if (fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (passwordRules.some((rule) => !rule.met)) {
      setError('Password must include at least 8 characters, uppercase, lowercase, and a number.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        name: fullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        confirmPassword,
        agreeToTerms: true,
      });

      navigate(res.user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check your details and try again.');
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
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-forest-950 font-sans text-forest-950 dark:text-cream flex flex-col items-center justify-center px-4 pt-20 pb-10 sm:py-16 relative transition-colors">
      {/* Top-Right Square Utility Buttons */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 rtl:right-auto rtl:left-5 rtl:sm:left-6 flex items-center gap-2.5 z-20">
        <DirectionToggle variant="square" />
        <ThemeToggle compact variant="square" />
      </div>

      {/* Centered White Card (~24px rounded corners, subtle border & shadow) */}
      <div className="w-full max-w-[470px] bg-white dark:bg-forest-900 rounded-[24px] border border-beige-200/90 dark:border-forest-700 shadow-[0_14px_44px_-14px_rgba(27,59,43,0.12)] px-6 py-8 sm:px-9 sm:py-9 transition-colors">
        {/* Top Branding Header */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-forest-400 rounded-2xl px-1 py-0.5"
            aria-label="Montessori Pod Homepage"
          >
            <div className="w-11 h-11 rounded-2xl bg-forest-800 dark:bg-sage-500 text-cream dark:text-forest-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="text-left rtl:text-right">
              <span className="font-serif font-bold text-xl sm:text-[22px] text-forest-950 dark:text-cream tracking-tight block leading-tight">
                Montessori Pod
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-forest-600 dark:text-sage-300 mt-0.5 block">
                Curiosity • Autonomy • Grace
              </span>
            </div>
          </Link>
        </div>

        {/* Two Equal-Sized Segmented Tabs */}
        <div
          role="tablist"
          aria-label="Authentication Mode"
          className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-beige-100/90 dark:bg-forest-950/75 border border-beige-200/80 dark:border-forest-800 mt-6 mb-6"
        >
          <button
            type="button"
            role="tab"
            id="auth-tab-signin"
            aria-selected={activeTab === 'signin'}
            onClick={() => switchTab('signin')}
            className={`inline-flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-400 ${
              activeTab === 'signin'
                ? 'bg-forest-800 dark:bg-sage-500 text-white dark:text-forest-950 shadow-sm'
                : 'text-forest-700 dark:text-beige-200 hover:text-forest-950 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4 flex-shrink-0" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            role="tab"
            id="auth-tab-register"
            aria-selected={activeTab === 'register'}
            onClick={() => switchTab('register')}
            className={`inline-flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-400 ${
              activeTab === 'register'
                ? 'bg-forest-800 dark:bg-sage-500 text-white dark:text-forest-950 shadow-sm'
                : 'text-forest-700 dark:text-beige-200 hover:text-forest-950 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 flex-shrink-0" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Feedback Banners */}
        {error && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-2xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs sm:text-[13px] flex items-start gap-2.5 leading-snug"
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

        {/* TAB 1: SIGN IN FORM */}
        {activeTab === 'signin' ? (
          <div role="tabpanel" aria-labelledby="auth-tab-signin">
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              {/* Email Address */}
              <div>
                <label htmlFor="login-email" className={`${LABEL_BASE} mb-1.5`}>
                  Email Address <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500 dark:text-sage-400 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="student@example.com"
                    className={`${INPUT_BASE} pl-10 pr-4 rtl:pl-4 rtl:pr-10`}
                  />
                </div>
              </div>

              {/* Password + Right-Aligned Forgot Password Link */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label htmlFor="login-password" className={LABEL_BASE}>
                    Password <span className="text-terracotta">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-forest-700 dark:text-sage-300 hover:text-forest-950 dark:hover:text-cream transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500 dark:text-sage-400 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className={`${INPUT_BASE} pl-10 pr-11 rtl:pl-11 rtl:pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-1 text-forest-500 hover:text-forest-800 dark:text-sage-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember this device */}
              <div className="pt-0.5">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-forest-700 dark:text-beige-200 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-beige-400 text-forest-700 focus:ring-forest-500 cursor-pointer accent-forest-700"
                  />
                  <span className="font-medium">Remember this device for 30 days</span>
                </label>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 px-6 rounded-full bg-forest-800 hover:bg-forest-900 dark:bg-sage-500 dark:hover:bg-sage-400 text-white dark:text-forest-950 font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-forest-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-beige-200 dark:border-forest-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-forest-900 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-forest-600/80 dark:text-beige-300/75">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Social Login Buttons Row (Equal Width & Height, Zero Truncation) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                className="w-full h-11 px-3 rounded-2xl bg-white dark:bg-forest-950/60 border border-beige-300/90 dark:border-forest-700 hover:border-forest-600 dark:hover:border-sage-400 hover:bg-beige-50 dark:hover:bg-forest-800 text-forest-900 dark:text-cream text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm whitespace-nowrap transition-all"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('facebook')}
                className="w-full h-11 px-3 rounded-2xl bg-white dark:bg-forest-950/60 border border-beige-300/90 dark:border-forest-700 hover:border-forest-600 dark:hover:border-sage-400 hover:bg-beige-50 dark:hover:bg-forest-800 text-forest-900 dark:text-cream text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm whitespace-nowrap transition-all"
              >
                <FacebookIcon />
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Bottom Footer Switch */}
            <div className="mt-6 pt-5 border-t border-beige-200/80 dark:border-forest-800 text-center text-xs text-forest-700 dark:text-beige-200">
              <span>Don&apos;t have an account yet? </span>
              <button
                type="button"
                onClick={() => switchTab('register')}
                className="inline-flex items-center gap-1 font-bold text-forest-900 dark:text-sage-300 hover:underline underline-offset-4 ml-1"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        ) : (
          /* TAB 2: CREATE ACCOUNT FORM */
          <div role="tabpanel" aria-labelledby="auth-tab-register">
            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="reg-fullname" className={`${LABEL_BASE} mb-1.5`}>
                  Full Name <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500 dark:text-sage-400 pointer-events-none" />
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setError('');
                    }}
                    placeholder="Maya Lin"
                    className={`${INPUT_BASE} pl-10 pr-4 rtl:pl-4 rtl:pr-10`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="reg-email" className={`${LABEL_BASE} mb-1.5`}>
                  Email Address <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500 dark:text-sage-400 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="student@example.com"
                    className={`${INPUT_BASE} pl-10 pr-4 rtl:pl-4 rtl:pr-10`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className={`${LABEL_BASE} mb-1.5`}>
                  Password <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500 dark:text-sage-400 pointer-events-none" />
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Minimum 8 chars (A-z, 0-9)"
                    className={`${INPUT_BASE} pl-10 pr-11 rtl:pl-11 rtl:pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((prev) => !prev)}
                    className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-1 text-forest-500 hover:text-forest-800 dark:text-sage-300 transition-colors"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regPassword && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 px-1">
                    {passwordRules.map((rule) => (
                      <span
                        key={rule.label}
                        className={`text-[11px] font-medium ${
                          rule.met
                            ? 'text-forest-700 dark:text-sage-300'
                            : 'text-softbrown-400 dark:text-beige-300/60'
                        }`}
                      >
                        {rule.met ? '✓ ' : '• '}
                        {rule.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm-password" className={`${LABEL_BASE} mb-1.5`}>
                  Confirm Password <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500 dark:text-sage-400 pointer-events-none" />
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Confirm your password"
                    className={`${INPUT_BASE} pl-10 pr-11 rtl:pl-11 rtl:pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-1 text-forest-500 hover:text-forest-800 dark:text-sage-300 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Create Account Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 px-6 rounded-full bg-forest-800 hover:bg-forest-900 dark:bg-sage-500 dark:hover:bg-sage-400 text-white dark:text-forest-950 font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-forest-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Footer Switch */}
            <div className="mt-6 pt-5 border-t border-beige-200/80 dark:border-forest-800 text-center text-xs text-forest-700 dark:text-beige-200">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => switchTab('signin')}
                className="inline-flex items-center gap-1 font-bold text-forest-900 dark:text-sage-300 hover:underline underline-offset-4 ml-1"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subtle External Navigation & Demo Helper Row Below Card */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-forest-700/80 dark:text-beige-300/80">
        <Link
          to="/"
          className="inline-flex items-center gap-1 font-semibold hover:text-forest-950 dark:hover:text-cream transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>Back to Website</span>
        </Link>

        {activeTab === 'signin' && (
          <>
            <span className="text-beige-400 dark:text-forest-700" aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-2">
              <span>Demo Fill:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('parent@example.com');
                  setPassword('parent123');
                  setError('');
                }}
                className="font-semibold underline underline-offset-2 hover:text-forest-950 dark:hover:text-cream"
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@montessorilearningpod.edu');
                  setPassword('admin123');
                  setError('');
                }}
                className="font-semibold underline underline-offset-2 hover:text-forest-950 dark:hover:text-cream"
              >
                Admin
              </button>
            </span>
          </>
        )}
      </div>
    </div>
  );
};
