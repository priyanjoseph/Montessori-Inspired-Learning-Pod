import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Home,
  Info,
  Mail,
  Send,
  Sprout,
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { DirectionToggle } from '../components/DirectionToggle';
import { ThemeToggle } from '../components/ThemeToggle';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    emailSent: boolean;
    smtpConfigured: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{
        ok: boolean;
        emailSent: boolean;
        smtpConfigured: boolean;
        message: string;
      }>('/api/auth/forgot-password', {
        method: 'POST',
        body: { email: email.trim() },
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Unable to process password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 flex flex-col justify-center px-6 py-12 relative transition-colors">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <DirectionToggle />
        <ThemeToggle compact />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-beige-100 dark:bg-forest-900 border border-beige-300 dark:border-forest-700 text-forest-800 dark:text-beige-100 text-xs font-semibold"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto bg-white dark:bg-forest-900 rounded-4xl border border-beige-300 dark:border-forest-700 shadow-soft-xl p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-forest-700 text-cream flex items-center justify-center shadow-soft">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-forest-900 dark:text-cream block leading-none">
              Montessori Pod
            </span>
            <span className="text-[11px] text-forest-600 dark:text-sage-300 font-semibold uppercase tracking-wider">
              Account Recovery
            </span>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream">
          Forgot Your Password?
        </h1>
        <p className="text-xs sm:text-sm text-forest-700 dark:text-beige-200 mt-1.5 mb-6 leading-relaxed">
          Enter the email address associated with your account and we will issue a secure, time-limited password reset link.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-2xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div
            role="status"
            className={`mb-5 p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
              result.emailSent
                ? 'bg-sage-100/90 dark:bg-forest-800 border-sage-300 dark:border-sage-600 text-forest-900 dark:text-cream'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100'
            }`}
          >
            {result.emailSent ? (
              <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-sage-300 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5" />
            )}
            <span>{result.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5"
            >
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm text-forest-950 dark:text-cream"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-forest-700 hover:bg-forest-800 dark:bg-sage-500 dark:hover:bg-sage-400 text-cream dark:text-forest-950 font-semibold text-sm shadow-soft transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Reset Instructions</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-beige-200 dark:border-forest-800 flex items-center justify-between text-xs">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-forest-700 dark:text-sage-300 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-semibold text-forest-700 dark:text-sage-300 hover:underline"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

