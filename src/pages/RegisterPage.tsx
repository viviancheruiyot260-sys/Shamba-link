import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, AlertCircle, ArrowRight, Sprout, Check } from 'lucide-react';
import { authService } from '../services/authService';
import { KENYAN_COUNTIES } from '../services/productService';
import { UserRole } from '../types';
import { isSupabaseConfigured } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'farmer' ? 'farmer' : 'buyer';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('Nakuru');
  const [farmOrOrgName, setFarmOrOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to create real database accounts.'
      );
      return;
    }

    setIsLoading(true);

    const { user, error } = await authService.signUp({
      email,
      password,
      fullName,
      role,
      phone,
      county,
      organizationName: farmOrOrgName,
    });

    if (error || !user) {
      setErrorMsg(error || 'Failed to register account.');
      setIsLoading(false);
      return;
    }

    setSuccessMsg('Account created successfully! Redirecting...');
    await refreshProfile();
    setIsLoading(false);

    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-sm">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-900 font-bold text-xl">
            <span className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-200 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </span>
            <span>Shamba Link</span>
          </Link>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Create your account
          </h2>
          <p className="text-xs text-stone-500">
            Join Kenya's farm-to-market direct agricultural network.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            I want to join Shamba Link as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                role === 'farmer'
                  ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-800/20'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">🌾</span>
                {role === 'farmer' && <Check className="w-4 h-4 text-emerald-800" />}
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold">Farmer / Grower</div>
                <div className="text-[11px] text-stone-500">Sell farm harvests directly</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                role === 'buyer'
                  ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-800/20'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">🏢</span>
                {role === 'buyer' && <Check className="w-4 h-4 text-emerald-800" />}
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold">Buyer / Business</div>
                <div className="text-[11px] text-stone-500">Source restaurant & retail produce</div>
              </div>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Kiprono Cheruiyot"
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {role === 'farmer' ? 'Shamba / Farm Name' : 'Company / Business Name'}
            </label>
            <input
              type="text"
              value={farmOrOrgName}
              onChange={(e) => setFarmOrOrgName(e.target.value)}
              placeholder={role === 'farmer' ? 'e.g. Aberdare Fresh Farm' : 'e.g. Green Spoon Kitchens'}
              className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Kenyan County *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number (M-Pesa)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address *
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

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
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
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              'Creating Supabase Account...'
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-800 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
