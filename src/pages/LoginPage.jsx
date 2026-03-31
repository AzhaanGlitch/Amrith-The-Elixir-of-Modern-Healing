import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui';
import { User, Stethoscope } from 'lucide-react';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // By default, if path is /signup, the container should be active (showing the signup panel)
  const isSignupPath = location.pathname === '/signup';
  const [isActive, setIsActive] = useState(isSignupPath);

  // Sync state if url changes via back button
  useEffect(() => {
    setIsActive(location.pathname === '/signup');
  }, [location.pathname]);

  const searchParams = new URLSearchParams(location.search);
  const defaultRole = searchParams.get('role') || 'patient';
  const [role, setRole] = useState(defaultRole);
  
  const { login, signup, isLoading } = useAuth();
  const { addToast } = useToast();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', phone: '', email: '', password: '',
    address: '', dob: '', gender: '',
    specialization: '', license: '', experience: ''
  });

  const redirectPath = searchParams.get('redirect');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(role);
      addToast(`Welcome back, ${user.name}!`, 'success');
      navigate(redirectPath || (role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'));
    } catch {
      addToast('Login failed. Please try again.', 'error');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signup(role, signupForm);
      addToast(`Welcome to Amrith, ${user.name}! 🎉`, 'success');
      navigate(redirectPath || (role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'));
    } catch {
      addToast('Signup failed. Please try again.', 'error');
    }
  };

  const updateSignup = (k, v) => setSignupForm(p => ({ ...p, [k]: v }));
  const updateLogin = (k, v) => setLoginForm(p => ({ ...p, [k]: v }));

  const toggleAuth = (toSignup) => {
    setIsActive(toSignup);
    navigate(toSignup ? '/signup' : '/login', { replace: true });
  };

  // Reusable input styling matching the glassy theme
  const inputClass = "w-full py-3.5 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 backdrop-blur-sm transition-all";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-24 overflow-hidden bg-black">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/common.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'blur(5px) brightness(0.9)' }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Main Container */}
      <div className={`auth-container bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[30px] relative overflow-hidden w-full max-w-[900px] min-h-[600px] ${isActive ? 'active' : ''}`}>
        
        {/* Sign Up Form */}
        <div className="auth-form-container auth-sign-up">
          <form onSubmit={handleSignupSubmit} className="flex flex-col items-center justify-center p-8 h-full space-y-4 text-white">
            <h1 className="text-3xl font-heading font-bold mb-2">Create Account</h1>
            
            {/* Role Toggle */}
            <div className="flex w-full bg-black/40 rounded-xl p-1 border border-white/5">
              {['patient', 'doctor'].map(r => (
                <button
                  key={`su-${r}`}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    role === r ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {r === 'patient' ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                    <span className="capitalize">{r}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="w-full space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
              <input type="text" placeholder={role === 'doctor' ? "Dr. Full Name" : "Full Name"} className={inputClass} required value={signupForm.name} onChange={e => updateSignup('name', e.target.value)} />
              <input type="email" placeholder="Email Address" className={inputClass} required value={signupForm.email} onChange={e => updateSignup('email', e.target.value)} />
              <input type="tel" placeholder="Mobile Number (+91)" className={inputClass} required value={signupForm.phone} onChange={e => updateSignup('phone', e.target.value)} />
              <input type="password" placeholder="Password" className={inputClass} required value={signupForm.password} onChange={e => updateSignup('password', e.target.value)} />
              
              {role === 'patient' ? (
                <>
                  <input type="text" placeholder="House Address" className={inputClass} value={signupForm.address} onChange={e => updateSignup('address', e.target.value)} />
                  <div className="flex gap-3">
                    <input type="date" className={`${inputClass} [color-scheme:dark] flex-1`} value={signupForm.dob} onChange={e => updateSignup('dob', e.target.value)} />
                    <select className={`${inputClass} [color-scheme:dark] flex-1`} value={signupForm.gender} onChange={e => updateSignup('gender', e.target.value)}>
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <input type="text" placeholder="Specialization (e.g. Cardiology)" className={inputClass} required value={signupForm.specialization} onChange={e => updateSignup('specialization', e.target.value)} />
                  <input type="text" placeholder="Medical License (MCI-1234)" className={inputClass} required value={signupForm.license} onChange={e => updateSignup('license', e.target.value)} />
                  <input type="number" placeholder="Years of Experience" className={inputClass} required value={signupForm.experience} onChange={e => updateSignup('experience', e.target.value)} />
                </>
              )}
            </div>
            
            <Button type="submit" size="lg" className="w-full mt-2 shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Sign Up'}
            </Button>
            
            {/* Mobile Nav helper */}
            <p className="mt-4 md:hidden text-gray-400 text-sm">
              Already have an account? <button type="button" onClick={() => toggleAuth(false)} className="text-primary font-semibold hover:underline">Sign In</button>
            </p>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="auth-form-container auth-sign-in">
          <form onSubmit={handleLoginSubmit} className="flex flex-col items-center justify-center p-10 h-full space-y-4 text-white">
            <h1 className="text-3xl font-heading font-bold mb-2">Sign In</h1>
            
            {/* Role Toggle */}
            <div className="flex w-full bg-black/40 rounded-xl p-1 border border-white/5">
              {['patient', 'doctor'].map(r => (
                <button
                  key={`si-${r}`}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    role === r ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {r === 'patient' ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                    <span className="capitalize">{r}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="w-full space-y-3 mt-4">
              <input type="email" placeholder="Email Address" className={inputClass} required value={loginForm.email} onChange={e => updateLogin('email', e.target.value)} />
              <input type="password" placeholder="Password" className={inputClass} required value={loginForm.password} onChange={e => updateLogin('password', e.target.value)} />
            </div>

            <div className="w-full text-right mt-1">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Forget Your Password?</a>
            </div>
            
            <Button type="submit" size="lg" className="w-full mt-4 shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            {/* Mobile Nav helper */}
            <p className="mt-4 md:hidden text-gray-400 text-sm">
              Don't have an account? <button type="button" onClick={() => toggleAuth(true)} className="text-primary font-semibold hover:underline">Sign Up</button>
            </p>
          </form>
        </div>

        {/* Overlay Toggle Container */}
        <div className="auth-toggle-container hidden md:block">
          <div className="auth-toggle bg-gradient-to-r from-[#5c6bc0] to-[#512da8] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            
            <div className="auth-toggle-panel auth-toggle-left">
              <h1 className="text-4xl font-heading font-bold text-white mb-4">Welcome Back!</h1>
              <p className="text-white/90 mb-8 max-w-xs text-center text-sm leading-relaxed">
                Enter your personal details to securely login and access all your virtual hospital features.
              </p>
              <button 
                type="button"
                className="px-10 py-3 rounded-xl border border-white text-white font-semibold hover:bg-white hover:text-[#5c6bc0] transition-colors shadow-lg"
                onClick={() => toggleAuth(false)}
              >
                Sign In
              </button>
            </div>
            
            <div className="auth-toggle-panel auth-toggle-right">
              <h1 className="text-4xl font-heading font-bold text-white mb-4">Welcome</h1>
              <p className="text-white/90 mb-8 max-w-xs text-center text-sm leading-relaxed">
                Register with your personal details to begin using Amrith's AI-driven diagnostic platform.
              </p>
              <button 
                type="button"
                className="px-10 py-3 rounded-xl border border-white text-white font-semibold hover:bg-white hover:text-[#512da8] transition-colors shadow-lg"
                onClick={() => toggleAuth(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        /* 
          Auth Container animations and structural logic 
          Ref: User provided sliding layout 
        */
        .auth-container {
            position: relative;
            overflow: hidden;
        }
        .auth-form-container {
            position: absolute;
            top: 0;
            height: 100%;
            transition: all 0.6s ease-in-out;
        }
        
        /* Mobile: By default stack them up nicely if we lack space, 
           but we manage visibility with z-index/opacity */
        @media (max-width: 768px) {
          .auth-form-container {
             width: 100% !important;
          }
          .auth-sign-up {
             opacity: 0;
             visibility: hidden;
             transform: translateX(100%);
          }
          .auth-container.active .auth-sign-in {
             opacity: 0;
             visibility: hidden;
             transform: translateX(-100%);
          }
          .auth-container.active .auth-sign-up {
             transform: translateX(0);
             visibility: visible;
             opacity: 1;
             z-index: 5;
             animation: none !important;
          }
        }
        
        .auth-sign-in {
            left: 0;
            width: 50%;
            z-index: 2;
            transition: all 0.6s ease-in-out;
        }
        @media (min-width: 769px) {
          .auth-container.active .auth-sign-in {
              transform: translateX(100%);
              opacity: 0;
              pointer-events: none;
          }
        }
        .auth-sign-up {
            left: 0;
            width: 50%;
            opacity: 0;
            z-index: 1;
            pointer-events: none;
            transition: all 0.6s ease-in-out;
        }
        @media (min-width: 769px) {
          .auth-container.active .auth-sign-up {
              transform: translateX(100%);
              opacity: 1;
              z-index: 5;
              pointer-events: auto;
              animation: moveAuth 0.6s;
          }
        }
        @keyframes moveAuth {
            0%, 49.99% { opacity: 0; z-index: 1; }
            50%, 100% { opacity: 1; z-index: 5; }
        }
        .auth-toggle-container {
            position: absolute;
            top: 0;
            left: 50%;
            width: 50%;
            height: 100%;
            overflow: hidden;
            transition: all 0.6s ease-in-out;
            border-radius: 150px 0 0 100px;
            z-index: 1000;
        }
        .auth-container.active .auth-toggle-container {
            transform: translateX(-100%);
            border-radius: 0 150px 100px 0;
        }
        .auth-toggle {
            position: relative;
            left: -100%;
            height: 100%;
            width: 200%;
            transform: translateX(0);
            transition: all 0.6s ease-in-out;
        }
        .auth-container.active .auth-toggle {
            transform: translateX(50%);
        }
        .auth-toggle-panel {
            position: absolute;
            width: 50%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: center;
            top: 0;
            transform: translateX(0);
            transition: all 0.6s ease-in-out;
        }
        .auth-toggle-left {
            transform: translateX(-200%);
        }
        .auth-container.active .auth-toggle-left {
            transform: translateX(0);
        }
        .auth-toggle-right {
            right: 0;
            transform: translateX(0);
        }
        .auth-container.active .auth-toggle-right {
            transform: translateX(200%);
        }
      `}</style>
    </div>
  );
}
