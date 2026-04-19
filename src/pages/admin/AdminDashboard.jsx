import { useAuth } from '../../context/AuthContext';
import { doctors } from '../../data/mockData';
import { motion } from 'framer-motion';
import { 
  Users, Activity, ShieldCheck, Key, 
  MoreHorizontal, ChevronDown, Calendar,
  TrendingUp, ClipboardList, Shield,
  Search, Mail, Phone, MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const adminName = user?.name?.split(' ')[0] || 'Admin';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentActivities = [
    { time: '10:30 am', title: 'Generated access code for Dr. Sarah', type: 'code' },
    { time: '11:45 am', title: 'Verified new registration: Dr. Michael', type: 'verify' },
    { time: '01:20 pm', title: 'Updated system security protocols', type: 'system' },
    { time: '02:00 pm', title: 'Meeting with hospital board', type: 'meeting' },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      
      {/* Left Column - Main Dashboard Area */}
      <div className="flex-1 flex flex-col gap-6 w-full xl:w-2/3">
        
        {/* Welcome Banner */}
        <div className="bg-[#000000] text-white rounded-md p-8 relative overflow-hidden border border-purple-500/30 flex items-center">
          <div className="relative z-10 w-full sm:w-2/3">
            <div className="inline-block bg-white/5 rounded-md px-3 py-1.5 mb-4 border border-white/10">
              <span className="text-xs font-semibold text-white/70">May 13, 2026 • 2:12 pm</span>
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
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-white">{doctors.length}</p>
                <p className="text-xs text-gray-500 mt-1">registered experts</p>
              </div>
              <div className="mb-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded-md">+4% increase</div>
            </div>
            <div className="mt-4 h-12 w-full">
               <svg viewBox="0 0 100 30" className="w-full h-full stroke-emerald-400 fill-emerald-400/5" preserveAspectRatio="none">
                 <path d="M0,25 Q15,20 30,25 T60,10 T80,5 T100,10 L100,30 L0,30 Z" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>
          </div>

          <div className="bg-[#000000] p-6 rounded-md border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('portal.active')} NOW</h3>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-white">{Math.floor(doctors.length * 0.6)}</p>
                <p className="text-xs text-gray-500 mt-1">doctors online</p>
              </div>
              <div className="mb-1 text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-md">+12% peak</div>
            </div>
            <div className="mt-4 h-12 w-full">
               <svg viewBox="0 0 100 30" className="w-full h-full stroke-primary fill-transparent" preserveAspectRatio="none">
                 <path d="M0,15 Q10,5 20,15 T40,25 T60,15 T80,5 T100,15" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>
          </div>

          <div className="bg-[#000000] p-6 rounded-md border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">CODE USAGE</h3>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-white">42</p>
                <p className="text-xs text-gray-500 mt-1">codes generated</p>
              </div>
              <div className="mb-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">8 pending</div>
            </div>
            <div className="mt-4 h-12 w-full flex items-center relative">
               <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-[84%] bg-amber-400 rounded-full"></div>
               </div>
               <div className="absolute left-[84%] top-1/2 -translate-y-1/2 w-3 h-3 bg-black border-2 border-amber-400 rounded-md"></div>
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

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a] text-gray-500 text-[10px] uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Doctor Profile</th>
                  <th className="px-6 py-4 font-bold">Field</th>
                  <th className="px-6 py-4 font-bold">Experience</th>
                  <th className="px-6 py-4 font-bold text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDoctors.slice(0, 5).map((doctor, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#111] border border-white/10 overflow-hidden">
                          <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{doctor.name}</p>
                          <p className="text-[10px] text-gray-500">{doctor.education}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-gray-300">{doctor.specialization}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {doctor.experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        Active
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <Shield className="w-8 h-8 text-white/20" />
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
                <p className="text-sm font-bold text-white">10m ago</p>
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
          
          <div className="p-6 flex-1">
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
            
            <button className="w-full mt-8 py-3 border border-dashed border-white/10 text-gray-400 font-bold text-xs rounded-md hover:bg-white/5 hover:border-white/20 transition-all uppercase tracking-widest">
              View All Logs
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
