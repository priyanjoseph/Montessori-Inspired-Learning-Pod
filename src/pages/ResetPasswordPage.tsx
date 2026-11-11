import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
  Lock,
  Sprout,
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { DirectionToggle } from '../components/DirectionToggle';
import { ThemeToggle } from '../components/ThemeToggle';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenReason, setTokenReason] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setCheckingToken(false);
      setTokenValid(false);
      setTokenReason('No reset token was provided in the URL.');
      return;
    }

    apiRequest<{ valid: boolean; reason?: string }>(
      `/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`
    )
      .then((res) => {
        setTokenValid(res.valid);
        if (!res.valid) {
          if (res.reason === 'token_expired') {
            setTokenReason('This password reset link has expired. Please request a fresh link.');
          } else if (res.reason === 'token_used') {
            setTokenReason('This password reset link has already been used.');
          } else {
            setTokenReason('This password reset link is invalid or malformed.');
          }
        }
      })
      .catch(() => {
        setTokenValid(false);
        setTokenReason('Could not verify your reset link. Please try requesting another.');
      })
      .finally(() => setCheckingToken(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest<{ ok: boolean; message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: { token, password, confirmPassword },
      });
      setSuccessMessage(res.message);
    } catch (err: any) {
      setError(err?.message || 'Unable to reset password.');
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
              Montessori Learning Pod
            </span>
            <span className="text-[11px] text-forest-600 dark:text-sage-300 font-semibold uppercase tracking-wider">
              Set New Password
            </span>
          </div>
        </div>

        {checkingToken ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium text-forest-700 dark:text-beige-200">
              Verifying secure reset link...
            </p>
          </div>
        ) : successMessage ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-sage-100 dark:bg-forest-800 border border-sage-300 dark:border-sage-600 text-forest-900 dark:text-cream text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-forest-700 dark:text-sage-300 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
            <Link
              to="/login"
              className="w-full py-3.5 px-6 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream font-semibold text-sm flex items-center justify-center gap-2"
            >
              <span>Continue to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : !tokenValid ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{tokenReason}</span>
            </div>
            <Link
              to="/forgot-password"
              className="w-full py-3 px-6 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream font-semibold text-sm flex items-center justify-center gap-2"
            >
              <span>Request New Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 dark:text-cream">
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-forest-700 dark:text-beige-200 mt-1.5 mb-6">
              Choose a strong new password for your Montessori Learning Pod account.
            </p>

            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 chars, upper/lower/digit"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-3 p-1 text-forest-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-800 dark:text-beige-100 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream font-semibold text-sm shadow-soft flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 pt-5 border-t border-beige-200 dark:border-forest-800 flex items-center justify-between text-xs">
          <Link to="/login" className="font-semibold text-forest-700 dark:text-sage-300 hover:underline">
            Back to Login
          </Link>
          <Link to="/" className="font-semibold text-forest-700 dark:text-sage-300 hover:underline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

