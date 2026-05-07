import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui';
import { User, Stethoscope, ShieldAlert } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    phone: '', address: '', dob: '', gender: '', bloodGroup: '', // Patient
    specialization: '', licenseNumber: '', experience: '', qualification: '' // Doctor
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // If they somehow land here without a user, or admin doesn't need onboarding
  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }
  
  if (user.role === 'admin') {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const updateForm = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/profile`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('amrith_token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const data = await response.json();
      
      // Update local context user object
      updateUserData(data.user);
      
      addToast('Profile setup complete!', 'success');
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      addToast(err.message || 'Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[30px] p-8 sm:p-12 relative z-10 w-full max-w-[600px] text-white">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Complete Your Profile</h1>
            <p className="text-gray-400">Please provide a few more details to finalize your {user.role} account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {user.role === 'patient' && (
                <>
                    <input type="tel" placeholder="Mobile Number (+91)" className={inputClass} required value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
                    <input type="text" placeholder="House Address" className={inputClass} required value={formData.address} onChange={e => updateForm('address', e.target.value)} />
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-gray-400 ml-1 mb-1 block">Date of Birth</label>
                            <input type="date" className={`${inputClass} [color-scheme:dark]`} required value={formData.dob} onChange={e => updateForm('dob', e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-400 ml-1 mb-1 block">Gender</label>
                            <select className={`${inputClass} [color-scheme:dark]`} required value={formData.gender} onChange={e => updateForm('gender', e.target.value)}>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <input type="text" placeholder="Blood Group (e.g. O+)" className={inputClass} required value={formData.bloodGroup} onChange={e => updateForm('bloodGroup', e.target.value)} />
                </>
            )}

            {user.role === 'doctor' && (
                <>
                    <input type="tel" placeholder="Mobile Number (+91)" className={inputClass} required value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
                    <input type="text" placeholder="Specialization (e.g. Cardiology)" className={inputClass} required value={formData.specialization} onChange={e => updateForm('specialization', e.target.value)} />
                    <input type="text" placeholder="Medical License (MCI-1234)" className={inputClass} required value={formData.licenseNumber} onChange={e => updateForm('licenseNumber', e.target.value)} />
                    <div className="flex gap-4">
                        <input type="text" placeholder="Years of Experience (e.g. 10 years)" className={inputClass} required value={formData.experience} onChange={e => updateForm('experience', e.target.value)} />
                        <input type="text" placeholder="Qualification (e.g. MBBS, MD)" className={inputClass} required value={formData.qualification} onChange={e => updateForm('qualification', e.target.value)} />
                    </div>
                </>
            )}

            <Button type="submit" size="lg" className="w-full mt-6 shadow-lg shadow-primary/20" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Complete Setup'}
            </Button>
        </form>
      </div>
    </div>
  );
}
