import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Users, Activity, ShieldCheck, Key, 
  MoreHorizontal, ChevronDown, Calendar,
  TrendingUp, ClipboardList, Shield,
  Search, Mail, Phone, MoreVertical, FileText
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const adminName = user?.name?.split(' ')[0] || 'Admin';
  const [searchTerm, setSearchTerm] = useState('');

  // Data will come from backend API — empty for now
  const filteredDoctors = [];
  const recentActivities = [];

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      
      {/* Left Column - Main Dashboard Area */}
      <div className="flex-1 flex flex-col gap-6 w-full xl:w-2/3">
        
        {/* Welcome Banner */}
        <div className="bg-[#000000] text-white rounded-md p-8 relative overflow-hidden border border-purple-500/30 flex items-center">
          <div className="relative z-10 w-full sm:w-2/3">
            <div className="inline-block bg-white/5 rounded-md px-3 py-1.5 mb-4 border border-white/10">
              <span className="text-xs font-semibold text-white/70">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2 text-white">{t('portal.welcome')}, {adminName}!</h1>
            <p className="text-gray-400">System status: All services operational.</p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 md:w-1/2 opacity-10 flex justify-end">
            <Shield className="w-64 h-64 -mb-12 -mr-12 text-purple-500" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-[#000000] p-6 rounded-md border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('portal.totalDoctors')}</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-white">0</p>
                <p className="text-xs text-gray-500 mt-1">registered experts</p>
              </div>
            </div>
          </div>

          <div className="bg-[#000000] p-6 rounded-md border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Patients</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-white">0</p>
                <p className="text-xs text-gray-500 mt-1">registered users</p>
              </div>
            </div>
          </div>

          <div className="bg-[#000000] p-6 rounded-md border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reports & Appointments</h3>
              <ClipboardList className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-white">0</p>
                <p className="text-xs text-gray-500 mt-1">total records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor List Area */}
        <div className="bg-[#000000] rounded-md border border-white/10 overflow-hidden flex flex-col flex-1 min-h-[400px]">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-heading font-bold text-white">Verified Specialists</h2>
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Filter experts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto flex items-center justify-center p-8 text-center text-gray-500">
             {filteredDoctors.length > 0 ? (
                // Table would go here when data is fetched
                <table className="w-full text-left border-collapse">
                  {/* ... */}
                </table>
             ) : (
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 mb-3 text-gray-700" />
                  <p>No verified specialists found.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Right Column - Profile & Activity */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        
        {/* Admin Profile Overview */}
        <div className="bg-[#000000] rounded-md border border-purple-500/30 overflow-hidden">
          <div className="bg-[#000000] p-4 flex items-center justify-between text-white border-b border-white/5">
            <h3 className="font-bold tracking-wider text-xs uppercase text-purple-400">{t('portal.adminPortal')}</h3>
            <button className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-6">
              <div className="w-16 h-16 rounded-md border-2 border-white/10 overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <Shield className="w-8 h-8 text-white/20" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white leading-tight mb-0.5">{user?.name || 'System Admin'}</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Root Access</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-md w-fit">
                   <Activity className="w-3 h-3" /> System Secured
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-md">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Access Level</p>
                <p className="text-sm font-bold text-white">Full Authority</p>
              </div>
              <div className="p-3 bg-white/5 rounded-md">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Last Login</p>
                <p className="text-sm font-bold text-white">Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[#000000] rounded-md border border-white/10 flex-1 flex flex-col overflow-hidden">
          <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/5">
            <h3 className="font-bold tracking-wider text-xs text-white uppercase">{t('portal.systemLogs')}</h3>
            <button className="text-gray-500 hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            {recentActivities.length > 0 ? (
              <div className="space-y-6">
                {recentActivities.map((log, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-[10px] font-bold text-gray-600 w-14 flex-shrink-0 pt-0.5">{log.time}</span>
                    <div className="flex gap-3 w-full">
                      <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-white/30 flex-shrink-0" />
                      <div className="w-full">
                        <p className="text-sm font-medium text-gray-300 leading-tight">{log.title}</p>
                        <div className="w-full h-px border-b border-dashed border-white/5 mt-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="w-8 h-8 mb-3 opacity-50" />
                <p className="text-sm">No recent activity logs.</p>
              </div>
            )}
            
            <button className="w-full mt-auto pt-8 pb-3 border-t border-dashed border-white/10 text-gray-400 font-bold text-xs hover:text-white transition-all uppercase tracking-widest text-center">
              View All Logs
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
