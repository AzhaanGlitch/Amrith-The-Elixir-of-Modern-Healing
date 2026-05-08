import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, Button, Avatar, Badge } from '../../components/ui';
import { Stethoscope, ShieldCheck, User, Phone, Mail, Award, Edit3, Save, Briefcase } from 'lucide-react';

export default function DoctorProfilePage() {
  const { user, updateUserData } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      specialization: user?.specialization || '',
      qualification: user?.qualification || '',
      experience: user?.experience || '',
      licenseNumber: user?.licenseNumber || '',
      profileImage: user?.profileImage || ''
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('amrith_token')}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      updateUserData(data.user);
      setEditing(false);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Image must be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text mb-6">Profile & Settings</h1>

      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative group">
            {editing ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-gray-50 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                {formData.profileImage || user?.profileImage ? (
                  <img src={formData.profileImage || user?.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Stethoscope className="w-10 h-10 text-primary/40" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-gray-50 flex items-center justify-center">
                {user?.profileImage ? (
                  <img src={user?.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Avatar name={user?.name} size="xl" />
                )}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-heading font-bold text-text">{user?.name}</h2>
              {user?.verified && (
                <Badge variant="accent" className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </Badge>
              )}
            </div>
            <p className="text-text-muted text-sm mt-1">{user?.specialization}</p>
            <p className="text-text-muted text-sm">{user?.qualification} • {user?.experience}</p>
          </div>
          <Button variant={editing ? 'primary' : 'outline'} size="sm" onClick={() => editing ? handleSave() : startEditing()} disabled={isSaving}>
            {isSaving ? 'Saving...' : editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold text-text mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Personal Information
          </h3>
          <div className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', value: user?.name, icon: User },
              { key: 'phone', label: 'Phone', value: user?.phone, icon: Phone },
            ].map(({ key, label, value, icon: Icon }) => (
              <div key={key}>
                <label className="block text-sm text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </label>
                {editing ? (
                  <input type="text" value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text focus:border-primary" />
                ) : (
                  <p className="text-text font-medium py-3 px-4 bg-background rounded-xl text-sm">{value || '—'}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm text-text-muted mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <p className="text-text font-medium py-3 px-4 bg-background rounded-xl text-sm opacity-70">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Professional Info */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold text-text mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Professional Details
          </h3>
          <div className="space-y-4">
            {[
              { key: 'specialization', label: 'Specialization', value: user?.specialization },
              { key: 'qualification', label: 'Qualification', value: user?.qualification },
              { key: 'experience', label: 'Experience', value: user?.experience },
              { key: 'licenseNumber', label: 'License Number', value: user?.licenseNumber },
            ].map(({ key, label, value }) => (
              <div key={key}>
                <label className="block text-sm text-text-muted mb-1.5">{label}</label>
                {editing ? (
                  <input type="text" value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text focus:border-primary" />
                ) : (
                  <p className="text-text font-medium py-3 px-4 bg-background rounded-xl text-sm">{value || '—'}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* KYC Verification */}
        <Card className="p-6 lg:col-span-2 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Award className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-text">KYC Verification</h3>
              <p className="text-text-muted text-sm mt-0.5">Your profile is verified and approved by Amrith's medical board.</p>
            </div>
            <Badge variant="accent" className="text-sm px-4 py-2">
              <ShieldCheck className="w-4 h-4 mr-1" /> Verified ✓
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
