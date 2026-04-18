import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Bell, Lock } from 'lucide-react';
import { Button } from '../../components/ui';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

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
                  <div className="w-24 h-24 rounded-md bg-[#000000] border border-white/10 flex items-center justify-center text-3xl font-bold text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'Administrator'}</h2>
                    <p className="text-sm text-gray-400 mb-3">System Administrator • Since May 2026</p>
                    <Button variant="outline" size="sm" className="rounded-md">Change Avatar</Button>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || 'Amrith Admin'}
                      className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || 'admin@amrith.com'}
                      className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
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
                  <Button className="rounded-md w-full sm:w-auto">Save Changes</Button>
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
