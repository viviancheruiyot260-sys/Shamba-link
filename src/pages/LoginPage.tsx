import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../config/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { refreshProfile, setDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to log in with real credentials, or use the demo preview below.'
      );
      return;
    }

    setIsLoading(true);
    const { user, error } = await authService.signIn(email, password);

    if (error || !user) {
      setErrorMsg(error || 'Invalid credentials.');
      setIsLoading(false);
      return;
    }

    await refreshProfile();
    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleDemoSignIn = (role: 'farmer' | 'buyer') => {
    setDemoRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-sm">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-900 font-bold text-xl">
            <span className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-200 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </span>
            <span>Shamba Link</span>
          </Link>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Log in to your account
          </h2>
          <p className="text-xs text-stone-500">
            Access your farmer harvest listings or buyer produce orders.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mkulima@shambalink.co.ke"
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-emerald-800 hover:text-emerald-950 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              'Authenticating with Supabase...'
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Mode Helper for reviewing UI prior to setting up Supabase keys */}
        {!isSupabaseConfigured && (
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <div className="text-[11px] font-semibold text-stone-500 text-center uppercase tracking-wider">
              Developer Quick Preview
            </div>
            <p className="text-[11px] text-stone-500 text-center">
              Explore the protected role-specific dashboard views:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('farmer')}
                className="px-3 py-2 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition-colors"
              >
                🌾 Preview Farmer
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('buyer')}
                className="px-3 py-2 bg-stone-100 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition-colors"
              >
                🏢 Preview Buyer
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-stone-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-emerald-800 hover:underline">
            Register as Farmer or Buyer
          </Link>
        </div>
      </div>
    </div>
  );
};
