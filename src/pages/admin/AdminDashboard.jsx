import { useState } from 'react';
import { doctors } from '../../data/mockData';
import { Search, MoreVertical, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/5">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Doctors</h3>
          <p className="text-3xl font-heading font-bold text-white">{doctors.length}</p>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/5">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Active Today</h3>
          <p className="text-3xl font-heading font-bold text-white">{Math.floor(doctors.length * 0.8)}</p>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/5">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Pending Approvals</h3>
          <p className="text-3xl font-heading font-bold text-white">0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-heading font-bold text-white">Registered Doctors</h2>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search doctors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Doctor</th>
                <th className="px-6 py-4 font-medium">Specialization</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Experience</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDoctors.map((doctor, index) => (
                <tr key={index} className="hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#222] border border-white/10 overflow-hidden flex-shrink-0">
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{doctor.name}</p>
                        <p className="text-xs text-gray-500">{doctor.education}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {doctor.specialization}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Mail className="w-3 h-3" />
                        {doctor.name.split(' ')[0].toLowerCase()}@amrith.com
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone className="w-3 h-3" />
                        +91 98765 43210
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {doctor.experience}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <ShieldCheck className="w-4 h-4" />
                      Verified
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDoctors.length === 0 && (
            <div className="p-12 text-center text-gray-500 text-sm">
              No doctors found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
