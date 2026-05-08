import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Bell, Lock, Edit3 } from 'lucide-react';
import { Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

export default function AdminProfilePage() {
  const { user, updateUserData } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profileImage: user?.profileImage || ''
  });
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your admin profile and security preferences.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-[#000000] border border-white/5 rounded-md p-8 shadow-xl">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                  <div className="relative group w-24 h-24 rounded-md bg-[#000000] border border-white/10 flex items-center justify-center text-3xl font-bold text-white overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
                    {formData.profileImage || user?.profileImage ? (
                      <img src={formData.profileImage || user?.profileImage} alt="Admin" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'A'
                    )}
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 className="w-5 h-5 text-white mb-1" />
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'Administrator'}</h2>
                    <p className="text-sm text-gray-400 mb-3">System Administrator</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email || ''}
                      readOnly
                      className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Role</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#000000] border border-white/10 rounded-md text-gray-400 cursor-not-allowed">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Root Administrator</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="rounded-md w-full sm:w-auto" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <h3 className="text-lg font-bold text-white">Security Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3 text-white" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="rounded-md">Update Password</Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 text-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Notification preferences coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
