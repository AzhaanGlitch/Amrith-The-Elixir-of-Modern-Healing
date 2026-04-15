import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Edit2, ChevronDown, MoreHorizontal, Calendar, Activity, Pill, User, Users, ClipboardList } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const doctorName = user?.name?.split(' ')[0] || 'Nicholls';

  const scheduledEvents = [
    { time: '2:00 pm', title: 'Meeting with chief physician Dr. Williams', color: 'bg-primary' },
    { time: '2:30 pm', title: 'Consultation with Mr. White', color: 'bg-secondary' },
    { time: '3:00 pm', title: 'Consultation with Mrs. Maisy', color: 'bg-accent' },
    { time: '3:30 pm', title: "Examination of Mrs. Lee's freckle", color: 'bg-emerald-400' },
    { time: '4:00 pm', title: 'Meeting with gastroenterologist Dr. Alice', color: 'bg-purple-400' },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      
      {/* Left Column - Main Dashboard Area */}
      <div className="flex-1 flex flex-col gap-6 w-full xl:w-2/3">
        
        {/* Welcome Banner */}
        <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-sm flex items-center">
          <div className="relative z-10 w-full sm:w-2/3">
            <div className="inline-block bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 mb-4 border border-white/20">
              <span className="text-xs font-semibold text-white/90">Apr 13, 2026 • 2:12 pm</span>
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2">Good Day, Dr. {doctorName}!</h1>
            <p className="text-white/80">Have a Nice Monday!</p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 md:w-1/2 opacity-30 sm:opacity-100 flex justify-end">
            <div className="relative w-full h-full">
              <img src="/logo.png" alt="Doctor Decoration" className="absolute right-4 bottom-[-20%] w-64 h-64 object-contain opacity-20 invert" />
              {/* Fake pills/icons decoration */}
              <div className="absolute top-8 right-32 w-4 h-4 bg-white/40 rounded-sm rotate-45" />
              <div className="absolute bottom-12 right-48 w-6 h-6 rounded-full border-2 border-white/30" />
              <div className="absolute top-1/2 right-12 w-8 h-2 bg-white/30 rounded-full -rotate-12" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border-light relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">OFFLINE WORK</h3>
              <MoreHorizontal className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-text">27</p>
                <p className="text-xs text-text-muted mt-1">hospital patients</p>
              </div>
              <div className="mb-1 text-error text-xs font-bold bg-error/10 px-2 py-0.5 rounded-md">-6% than average</div>
            </div>
            {/* Fake SVG Chart */}
            <div className="mt-4 h-12 w-full">
               <svg viewBox="0 0 100 30" className="w-full h-full stroke-error fill-error/10" preserveAspectRatio="none">
                 <path d="M0,5 Q10,15 20,25 T40,20 T60,5 T80,15 T100,0 L100,30 L0,30 Z" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border-light relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">ONLINE WORK</h3>
              <MoreHorizontal className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-text">9</p>
                <p className="text-xs text-text-muted mt-1">online consultations</p>
              </div>
              <div className="mb-1 text-secondary-dark text-xs font-bold bg-secondary/15 px-2 py-0.5 rounded-md">+12% than average</div>
            </div>
            {/* Fake SVG Chart */}
            <div className="mt-4 h-12 w-full">
               <svg viewBox="0 0 100 30" className="w-full h-full stroke-secondary-dark fill-transparent" preserveAspectRatio="none">
                 <path d="M0,25 Q15,20 30,25 T60,10 T80,5 T100,10" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border-light relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">LABORATORY WORK</h3>
              <MoreHorizontal className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-heading font-black text-text">19</p>
                <p className="text-xs text-text-muted mt-1">laboratory analysys</p>
              </div>
              <div className="mb-1 text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-md">+0% than average</div>
            </div>
            {/* Fake SVG Line */}
            <div className="mt-4 h-12 w-full flex items-center relative">
               <div className="w-full h-1 bg-primary/20 rounded-full relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-2/3 bg-primary rounded-full"></div>
               </div>
               <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-2 gap-6 flex-1">
          {/* Scheduled Events */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border-light flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">MY SCHEDULED EVENTS</h3>
              <button className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">
                Today <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-8 flex-1">
              {/* Fake Donut Chart */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path className="text-accent/20" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-primary" strokeDasharray="60, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-accent" strokeDasharray="15, 100" strokeDashoffset="-65" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-secondary" strokeDasharray="10, 100" strokeDashoffset="-85" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-heading font-black text-text leading-none mt-1">95<span className="text-lg">%</span></span>
                  <span className="text-[10px] text-text-muted font-bold uppercase mt-1">BUSYNESS</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xl font-heading font-black text-text">25</p>
                  <p className="text-xs text-text-muted">Consultations</p>
                </div>
                <div>
                  <p className="text-xl font-heading font-black text-text">10</p>
                  <p className="text-xs text-text-muted">Laboratory analyzes</p>
                </div>
                <div>
                  <p className="text-xl font-heading font-black text-text">3</p>
                  <p className="text-xs text-text-muted">Meetings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plans Done */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border-light flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">MY PLANS DONE</h3>
              <button className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">
                Today <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-6 flex-1">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-text">Consultations</span>
                  <span className="font-bold text-text">64%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[64%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-text">Analysys</span>
                  <span className="font-bold text-text">50%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[50%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-text">Meetings</span>
                  <span className="font-bold text-text">33%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[33%] rounded-full"></div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 border-2 border-dashed border-border text-primary font-bold rounded-2xl hover:bg-primary/5 hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
              Add plan <span className="text-lg leading-none">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Profile & Calendar */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-border-light overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <h3 className="font-bold tracking-wider text-sm">MY PROFILE</h3>
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 border-b border-border-light pb-6 mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-primary/10 overflow-hidden flex-shrink-0 bg-gray-50">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Doctor'}&backgroundColor=e2e8f0`} alt="Doctor" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-text leading-tight mb-1">Dr. {user?.name || 'Alisha Nicholls'}</h2>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">DERMATOLOGIST</p>
                <p className="text-sm text-text-muted flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Bottrop, Germany
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Date Birth</p>
                <p className="text-sm font-bold text-text">17.07.86</p>
              </div>
              <div className="border-x border-border-light px-2">
                <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Blood</p>
                <p className="text-sm font-bold text-text">A(II) Rh+</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Working Hours</p>
                <p className="text-sm font-bold text-text text-primary">9pm - 5am</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Calendar */}
        <div className="bg-white rounded-3xl shadow-sm border border-border-light flex-1 flex flex-col overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <h3 className="font-bold tracking-wider text-sm">MY CALENDAR</h3>
            <button className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/30 transition-colors">
              April <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            {/* Week view */}
            <div className="flex justify-between mb-8">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={day} className={`flex flex-col items-center justify-center w-10 h-14 rounded-2xl ${i === 1 ? 'bg-primary text-white shadow-md' : 'text-text-muted'}`}>
                  <span className="text-[10px] font-bold uppercase mb-1">{day}</span>
                  <span className={`text-sm font-bold ${i === 1 ? 'text-white' : 'text-text'}`}>{12 + i}</span>
                </div>
              ))}
            </div>

            {/* Events List */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-text-muted uppercase">APRIL, 13</h4>
                <MoreHorizontal className="w-5 h-5 text-text-muted" />
              </div>
              <div className="space-y-5">
                {scheduledEvents.map((event, i) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
