import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, Button, Avatar, Badge } from '../../components/ui';
import { ShieldCheck, User, Phone, Mail, Award, Edit3, Save, Briefcase } from 'lucide-react';

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text mb-6">Profile & Settings</h1>

      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar name={user?.name} size="xl" />
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
          <Button variant={editing ? 'primary' : 'outline'} size="sm" onClick={() => editing ? handleSave() : setEditing(true)}>
            {editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
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
              { label: 'Full Name', value: user?.name, icon: User },
              { label: 'Email', value: user?.email, icon: Mail },
              { label: 'Phone', value: user?.phone, icon: Phone },
            ].map(({ label, value, icon: Icon }, i) => (
              <div key={i}>
                <label className="block text-sm text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </label>
                {editing ? (
                  <input type="text" defaultValue={value} className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text focus:border-primary" />
                ) : (
                  <p className="text-text font-medium py-3 px-4 bg-background rounded-xl text-sm">{value || '—'}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Professional Info */}
        <Card className="p-6">
          <h3 className="font-heading font-semibold text-text mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Professional Details
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Specialization', value: user?.specialization },
              { label: 'Qualification', value: user?.qualification },
              { label: 'Experience', value: user?.experience },
              { label: 'License Number', value: 'MCI-98765' },
            ].map(({ label, value }, i) => (
              <div key={i}>
                <label className="block text-sm text-text-muted mb-1.5">{label}</label>
                {editing ? (
                  <input type="text" defaultValue={value} className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text focus:border-primary" />
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
