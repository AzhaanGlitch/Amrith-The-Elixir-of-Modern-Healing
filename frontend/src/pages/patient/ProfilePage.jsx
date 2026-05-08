import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, Button, Avatar, Badge } from '../../components/ui';
import { User, Phone, Mail, MapPin, Heart, Shield, Bell, Edit3, Plus, Save } from 'lucide-react';

export default function PatientProfilePage() {
  const { user, updateUserData } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const calculateAge = (dob) => {
    if (!dob) return 'Not set';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Initialize form data when editing starts
  const startEditing = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '', // Won't actually update email via this endpoint but keeps form happy
      address: user?.address || '',
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
      // Validate size (e.g., max 2MB)
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
      <h1 className="text-2xl font-heading font-bold text-text mb-6">My Profile</h1>

      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative group">
            {editing ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-gray-50 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                {formData.profileImage || user?.profileImage ? (
                  <img src={formData.profileImage || user?.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-primary/40" />
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
          <div className="flex-1 mt-2 sm:mt-0">
            <h2 className="text-xl font-heading font-bold text-text">{user?.name}</h2>
            <p className="text-text-muted text-sm mt-1">{user?.email}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <Badge variant="primary">Blood Group: {user?.bloodGroup || 'Not set'}</Badge>
              <Badge variant="secondary">Age: {user?.age || calculateAge(user?.dob)}</Badge>
              <Badge variant="neutral">{user?.gender || 'Not set'}</Badge>
            </div>
          </div>
          <Button variant={editing ? 'primary' : 'outline'} size="sm" onClick={() => editing ? handleSave() : startEditing()} disabled={isSaving}>
            {isSaving ? 'Saving...' : editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-background rounded-xl p-1 mb-6 w-fit overflow-x-auto">
        {['personal', 'family', 'medical', 'notifications'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text'
            }`}
          >
            {tab === 'notifications' ? 'Preferences' : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === 'personal' && (
          <Card className="p-6">
            <h3 className="font-heading font-semibold text-text mb-4">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { key: 'name', label: 'Full Name', value: user?.name, icon: User },
                { key: 'phone', label: 'Phone', value: user?.phone, icon: Phone },
                { key: 'address', label: 'Address', value: user?.address, icon: MapPin },
              ].map(({ key, label, value, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-text-muted mb-1.5 flex items-center gap-1.5">
                    <Icon className="w-4 h-4" /> {label}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text focus:border-primary"
                    />
                  ) : (
                    <p className="text-text font-medium py-3 px-4 bg-background rounded-xl">{value || '—'}</p>
                  )}
                </div>
              ))}
              <div>
                 <label className="block text-sm font-medium text-text-muted mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> Email
                 </label>
                 <p className="text-text font-medium py-3 px-4 bg-background rounded-xl opacity-70">{user?.email}</p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'family' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-text">Family Members</h3>
              <Button size="sm" variant="outline"><Plus className="w-4 h-4" /> Add Member</Button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Rajan Kumar', relation: 'Father', age: 55 },
                { name: 'Priya Rajan', relation: 'Mother', age: 52 },
              ].map((member, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-xl">
                  <Avatar name={member.name} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-text text-sm">{member.name}</p>
                    <p className="text-text-muted text-xs">{member.relation} • Age {member.age}</p>
                  </div>
                  <Button size="sm" variant="ghost"><Edit3 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'medical' && (
          <Card className="p-6">
            <h3 className="font-heading font-semibold text-text mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> Medical History
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Blood Group</label>
                <p className="text-text font-medium py-3 px-4 bg-background rounded-xl">{user?.bloodGroup || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Allergies</label>
                <p className="text-text font-medium py-3 px-4 bg-background rounded-xl">None reported</p>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Chronic Conditions</label>
                <p className="text-text font-medium py-3 px-4 bg-background rounded-xl">None</p>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Insurance Provider</label>
                <p className="text-text font-medium py-3 px-4 bg-background rounded-xl">Star Health Insurance</p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card className="p-6">
            <h3 className="font-heading font-semibold text-text mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Notification Preferences
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Appointment Reminders', desc: 'Get reminded before your appointments', checked: true },
                { label: 'Report Ready Alerts', desc: 'Notified when your reports are available', checked: true },
                { label: 'Health Tips & Offers', desc: 'Receive personalized health tips and special offers', checked: false },
                { label: 'SMS Notifications', desc: 'Receive updates via SMS', checked: true },
              ].map(({ label, desc, checked }, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl">
                  <div>
                    <p className="font-medium text-text text-sm">{label}</p>
                    <p className="text-text-muted text-xs">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-border rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
