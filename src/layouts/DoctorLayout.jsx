import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, CalendarClock, FileCheck, UserCog,
  Menu, X, LogOut, ChevronLeft, Bell, ShieldCheck
} from 'lucide-react';

const doctorLinks = [
  { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
  { label: 'My Patients', path: '/doctor/patients', icon: Users },
  { label: 'Schedule', path: '/doctor/schedule', icon: CalendarClock },
  { label: 'Reports Inbox', path: '/doctor/reports', icon: FileCheck },
  { label: 'Profile', path: '/doctor/profile', icon: UserCog },
];

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 flex-col bg-primary-dark z-40 rounded-r-[40px] shadow-2xl overflow-hidden py-8 items-center">
        <div className="mb-12">
          <h1 className="text-white font-heading font-bold text-xl -rotate-90 tracking-widest mt-12 whitespace-nowrap">AMRITH.</h1>
        </div>

        <nav className="flex-1 space-y-6 w-full flex flex-col items-center mt-12" aria-label="Doctor navigation">
          {doctorLinks.map((link, i) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                  active
                    ? 'bg-white/20 text-white shadow-lg shadow-white/10'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title={link.label}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
                {active && (
                  <motion.div layoutId="activeDot" className="absolute -left-6 w-2 h-8 bg-white rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-12 h-12 rounded-2xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay (Keeping similar logic for mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-24 bg-primary-dark z-50 lg:hidden flex flex-col items-center py-8 rounded-r-[40px] shadow-2xl"
            >
              <div className="mb-12">
                <h1 className="text-white font-heading font-bold text-xl -rotate-90 tracking-widest mt-12 whitespace-nowrap">AMRITH.</h1>
              </div>

              <nav className="flex-1 space-y-6 w-full flex flex-col items-center mt-12">
                {doctorLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                        active
                          ? 'bg-white/20 text-white shadow-lg shadow-white/10'
                          : 'text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-12 h-12 rounded-2xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-24 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#f4f7fe]/90 backdrop-blur-md px-6 sm:px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-text-muted hover:bg-white shadow-sm transition-all bg-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Title */}
            <div className="relative w-full hidden sm:block">
              <h2 className="text-2xl font-heading font-bold text-text">Doctors Portal</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary relative hover:bg-primary/5 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white" />
            </button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary hover:bg-primary/5 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
