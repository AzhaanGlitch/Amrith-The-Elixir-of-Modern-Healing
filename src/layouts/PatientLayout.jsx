import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, TestTubes, Calendar, FileText, User,
  Building2, Menu, X, LogOut, ChevronLeft, Bell
} from 'lucide-react';

const patientLinks = [
  { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
  { label: 'Book a Test', path: '/patient/book', icon: TestTubes },
  { label: 'Departments', path: '/patient/departments', icon: Building2 },
  { label: 'Appointments', path: '/patient/appointments', icon: Calendar },
  { label: 'Reports', path: '/patient/reports', icon: FileText },
  { label: 'Profile', path: '/patient/profile', icon: User },
];

export default function PatientLayout() {
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
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-border-light">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-text hover:bg-gray-50 transition-all"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Amrith Logo" className="h-8 w-auto object-contain" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-text-muted hover:text-primary hover:bg-primary/5 transition-all" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
            <Link to="/patient/profile" className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary-dark text-white text-xs font-semibold flex items-center justify-center">
                {user?.avatar || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-text">{user?.name?.split(' ')[0]}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 flex-col bg-white border-r border-border-light z-30 overflow-y-auto">
          <nav className="flex-1 p-4 space-y-1" aria-label="Patient navigation">
            {patientLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-primary bg-primary/8 shadow-sm'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
                  {link.label}
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border-light">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-primary hover:bg-primary/5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-error hover:bg-error/5 transition-all w-full text-left"
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
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-xl"
              >
                <div className="flex items-center justify-between p-4 border-b border-border-light">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Amrith Logo" className="h-8 w-auto object-contain" />
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-gray-100 transition-all"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {patientLinks.map(link => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? 'text-primary bg-primary/8'
                            : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-border-light">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-error hover:bg-error/5 transition-all w-full text-left"
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
