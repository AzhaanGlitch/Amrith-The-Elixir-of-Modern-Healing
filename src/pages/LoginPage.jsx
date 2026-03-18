import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui';
import { Mail, Phone, Lock, ArrowRight, Eye, EyeOff, User, Stethoscope } from 'lucide-react';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'patient';
  const [role, setRole] = useState(defaultRole);
  const [method, setMethod] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    setOtpSent(true);
    addToast('OTP sent successfully! Use any 6-digit code to login.', 'success');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(role);
      addToast(`Welcome back, ${user.name}!`, 'success');
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch {
      addToast('Login failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-background-alt">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-border-light">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <img src="/logo.png" alt="Amrith Logo" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform" />
            </Link>
            <h1 className="text-2xl font-heading font-bold text-text">Welcome Back</h1>
            <p className="text-text-muted text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-background rounded-xl p-1 mb-8">
            {['patient', 'doctor'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === r
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {r === 'patient' ? (
                  <span className="flex items-center justify-center gap-2"><User className="w-4 h-4" /> Patient</span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><Stethoscope className="w-4 h-4" /> Doctor</span>
                )}
              </button>
            ))}
          </div>

          {/* Method Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => { setMethod('phone'); setOtpSent(false); }}
              className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-all ${
                method === 'phone' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              <Phone className="w-4 h-4" /> Mobile OTP
            </button>
            <button
              onClick={() => { setMethod('email'); setOtpSent(false); }}
              className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-all ${
                method === 'email' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>

          {/* Form */}
          <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-5">
            {method === 'phone' ? (
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full py-3.5 pl-14 pr-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                    aria-label="Enter mobile number"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                    aria-label="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full py-3.5 px-4 pr-12 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                      aria-label="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {method === 'phone' && otpSent && (
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text text-center text-lg tracking-[0.5em] placeholder:text-text-muted placeholder:tracking-normal placeholder:text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                  aria-label="Enter OTP"
                />
                <button type="button" className="text-primary text-xs font-medium mt-2 hover:underline">
                  Resend OTP
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : method === 'phone' && !otpSent ? 'Send OTP' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-muted text-sm">
              Don't have an account?{' '}
              <Link to={`/signup?role=${role}`} className="text-primary font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
