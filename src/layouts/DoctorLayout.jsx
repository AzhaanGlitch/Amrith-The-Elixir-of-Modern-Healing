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
    <div className="min-h-screen bg-background-alt">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-text/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Amrith Logo" className="h-8 w-auto object-contain brightness-0 invert" />
              <span className="hidden sm:inline text-xs font-medium text-accent bg-accent/15 px-2 py-0.5 rounded-full">Doctor</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
            </button>
            <Link to="/doctor/profile" className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white text-xs font-semibold flex items-center justify-center">
                {user?.avatar || 'D'}
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-white">{user?.name?.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 flex-col bg-text border-r border-white/10 z-30 overflow-y-auto">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/20 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-accent">Verified Practitioner</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1" aria-label="Doctor navigation">
            {doctorLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-white bg-primary/30'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-accent' : ''}`} />
                  {link.label}
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/8 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
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
                className="fixed left-0 top-0 bottom-0 w-72 bg-text z-50 lg:hidden flex flex-col shadow-xl"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Amrith Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {doctorLinks.map(link => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? 'text-white bg-primary/30'
                            : 'text-white/60 hover:text-white hover:bg-white/8'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
