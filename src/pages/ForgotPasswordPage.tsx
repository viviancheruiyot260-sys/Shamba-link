import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, Check, Sprout } from 'lucide-react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../config/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to send password recovery emails.'
      );
      return;
    }

    setIsLoading(true);
    const { success, error } = await authService.resetPassword(email);

    if (error || !success) {
      setErrorMsg(error || 'Failed to send reset link.');
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-sm">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-900 font-bold text-xl">
            <span className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-200 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </span>
            <span>Shamba Link</span>
          </Link>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Reset your password
          </h2>
          <p className="text-xs text-stone-500">
            Enter your registered email and we'll send you a secure reset link.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Check your inbox</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              If an account exists for <strong className="text-stone-900">{email}</strong>, you will receive password reset instructions.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.co.ke"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
            >
              {isLoading ? 'Sending Reset Instructions...' : 'Send Password Reset Link'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
