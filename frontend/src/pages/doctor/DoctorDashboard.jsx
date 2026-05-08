import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { Edit2, ChevronDown, MoreHorizontal, Calendar, Activity, Pill, User, Users, ClipboardList, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const doctorName = user?.name?.split(' ')[0] || 'Doctor';

  // Data will come from backend API — empty for now
  const scheduledEvents = [];

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full min-h-0">
      
      {/* Left Column - Main Dashboard Area */}
      <div className="flex-1 flex flex-col gap-6 w-full xl:w-2/3">
        
        {/* Welcome Banner */}
        <div className="bg-primary rounded-md p-8 text-white relative overflow-hidden shadow-sm flex items-center">
          <div className="relative z-10 w-full sm:w-2/3">
            <div className="inline-block bg-white/20 backdrop-blur-md rounded-md px-3 py-1.5 mb-4 border border-white/20">
              <span className="text-xs font-semibold text-white/90">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2">{t('portal.welcome')}, Dr. {doctorName}!</h1>
            <p className="text-white/80">Have a great day at work!</p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 md:w-1/2 opacity-30 sm:opacity-100 flex justify-end">
            <div className="relative w-full h-full">
              <img src="/logo.png" alt="Doctor Decoration" className="absolute right-4 bottom-[-20%] w-64 h-64 object-contain opacity-20 invert" />
              <div className="absolute top-8 right-32 w-4 h-4 bg-white/40 rounded-sm rotate-45" />
              <div className="absolute bottom-12 right-48 w-6 h-6 rounded-full border-2 border-white/30" />
              <div className="absolute top-1/2 right-12 w-8 h-2 bg-white/30 rounded-full -rotate-12" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-md shadow-sm border border-border-light relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">TOTAL PATIENTS</h3>
              <Users className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-text">0</p>
                <p className="text-xs text-text-muted mt-1">assigned patients</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm border border-border-light relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">PENDING REPORTS</h3>
              <ClipboardList className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-text">0</p>
                <p className="text-xs text-text-muted mt-1">awaiting review</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm border border-border-light relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">APPOINTMENTS</h3>
              <Calendar className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-text">0</p>
                <p className="text-xs text-text-muted mt-1">upcoming today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-2 gap-6 flex-1">
          {/* Scheduled Events */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-border-light flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">MY SCHEDULED EVENTS</h3>
              <button className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">
                Today <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-8 flex-1">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
                <p className="text-text-muted text-sm">No scheduled events for today.</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-border-light flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">QUICK ACTIONS</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              <Link to="/doctor/reports" className="flex items-center gap-3 p-4 rounded-xl border border-border-light hover:border-primary transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ClipboardList className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-text text-sm">Review Pending Reports</h4>
                  <p className="text-xs text-text-muted">Analyze AI diagnostic results</p>
                </div>
              </Link>
              
              <Link to="/doctor/patients" className="flex items-center gap-3 p-4 rounded-xl border border-border-light hover:border-secondary transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                  <Users className="w-5 h-5 text-secondary-dark group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-text text-sm">Patient Directory</h4>
                  <p className="text-xs text-text-muted">View all assigned patients</p>
                </div>
              </Link>
              
              <Link to="/doctor/schedule" className="flex items-center gap-3 p-4 rounded-xl border border-border-light hover:border-accent transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Calendar className="w-5 h-5 text-accent group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-text text-sm">Manage Schedule</h4>
                  <p className="text-xs text-text-muted">Update availability</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Profile & Calendar */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-md shadow-sm border border-border-light overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <h3 className="font-bold tracking-wider text-sm uppercase">{t('portal.profile')}</h3>
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 border-b border-border-light pb-6 mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-primary/10 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Doctor" className="w-full h-full object-cover" />
                ) : (
                  <Stethoscope className="w-10 h-10 text-primary/40" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-text leading-tight mb-1">Dr. {user?.name || 'Doctor'}</h2>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{user?.specialization || 'SPECIALIST'}</p>
                <p className="text-sm text-text-muted flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {user?.address || 'Location not set'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Experience</p>
                <p className="text-sm font-bold text-text">{user?.experience || 'Not set'}</p>
              </div>
              <div className="border-l border-border-light px-2">
                <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Status</p>
                <p className="text-sm font-bold text-text text-emerald-500">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Calendar */}
        <div className="bg-white rounded-md shadow-sm border border-border-light flex-1 flex flex-col overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <h3 className="font-bold tracking-wider text-sm">MY CALENDAR</h3>
            <button className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/30 transition-colors">
              {new Date().toLocaleString('default', { month: 'long' })} <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            {/* Events List */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-text-muted uppercase">{new Date().toLocaleString('default', { month: 'long', day: 'numeric' }).toUpperCase()}</h4>
                <MoreHorizontal className="w-5 h-5 text-text-muted" />
              </div>
              <div className="space-y-5">
                {scheduledEvents.length > 0 ? scheduledEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-xs font-bold text-text-muted w-16 flex-shrink-0 pt-0.5">{event.time}</span>
                    <div className="flex gap-3 w-full">
                      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${event.color}`} />
                      <div className="w-full">
                        <p className="text-sm font-semibold text-text leading-tight">{event.title}</p>
                        <div className="w-full h-px border-b border-dashed border-border mt-2" />
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-text-muted text-center py-8">Your schedule is clear for today.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
