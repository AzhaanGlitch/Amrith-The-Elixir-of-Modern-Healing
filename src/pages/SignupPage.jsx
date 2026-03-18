import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui';
import { ArrowRight, User, Phone, Mail, MapPin, Stethoscope } from 'lucide-react';

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'patient';
  const [role, setRole] = useState(defaultRole);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', specialization: '' });
  const { signup, isLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    try {
      const user = await signup(role, form);
      addToast(`Welcome to Amrith, ${user.name}! 🎉`, 'success');
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch {
      addToast('Signup failed. Please try again.', 'error');
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
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <img src="/logo.png" alt="Amrith Logo" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform" />
            </Link>
            <h1 className="text-2xl font-heading font-bold text-text">Create Account</h1>
            <p className="text-text-muted text-sm mt-1">Join 50,000+ users on Amrith</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-background rounded-xl p-1 mb-8">
            {['patient', 'doctor'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === r ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text'
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

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => updateForm('name', e.target.value)}
                    placeholder={role === 'doctor' ? 'Dr. Meera Iyer' : 'Aditya Rajan'}
                    className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">+91</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => updateForm('phone', e.target.value)}
                      placeholder="98765 43210"
                      className="w-full py-3.5 pl-14 pr-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => updateForm('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {role === 'patient' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Address</label>
                      <textarea
                        value={form.address}
                        onChange={e => updateForm('address', e.target.value)}
                        placeholder="Your address for home sample collection"
                        rows={3}
                        className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Gender</label>
                      <select className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text focus:border-primary focus:ring-2 focus:ring-primary/20">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Specialization</label>
                      <input
                        type="text"
                        value={form.specialization}
                        onChange={e => updateForm('specialization', e.target.value)}
                        placeholder="e.g., Internal Medicine, Cardiology"
                        className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Medical License Number</label>
                      <input
                        type="text"
                        placeholder="e.g., MCI-12345"
                        className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Years of Experience</label>
                      <input
                        type="number"
                        placeholder="e.g., 10"
                        className="w-full py-3.5 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
              )}
              <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Creating...' : step === 1 ? 'Continue' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
