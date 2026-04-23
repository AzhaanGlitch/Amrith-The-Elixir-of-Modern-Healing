import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PortalActions from '../components/PortalActions';
import {
  LayoutDashboard, TestTubes, Calendar, FileText, User,
  Building2, Menu, X, LogOut, ChevronLeft, Bell
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PatientLayout() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const patientLinks = [
    { label: t('portal.dashboard'), path: '/patient/dashboard', icon: LayoutDashboard },
    { label: t('home.getFreeAnalysis'), path: '/patient/book', icon: TestTubes },
    { label: t('portal.appointments'), path: '/patient/appointments', icon: Calendar },
    { label: t('portal.reports'), path: '/patient/reports', icon: FileText },
    { label: t('portal.profile'), path: '/patient/profile', icon: User },
  ];
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex">
      {/* Desktop Sidebar (Doctor's style) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 flex-col bg-primary-dark z-40 rounded-r-md shadow-2xl overflow-hidden py-8 items-center">
        <Link to="/" className="mb-12 block group cursor-pointer">
          <h1 className="text-white font-heading font-bold text-xl -rotate-90 tracking-widest mt-12 whitespace-nowrap group-hover:scale-110 transition-transform">AMRITH.</h1>
        </Link>

        <nav className="flex-1 space-y-6 w-full flex flex-col items-center mt-12" aria-label="Patient navigation">
          {patientLinks.map((link, i) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center justify-center w-12 h-12 rounded-md transition-all duration-300 ${
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
            className="flex items-center justify-center w-12 h-12 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
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
              className="fixed left-0 top-0 bottom-0 w-24 bg-primary-dark z-50 lg:hidden flex flex-col items-center py-8 rounded-r-md shadow-2xl"
            >
              <Link to="/" className="mb-12 block group cursor-pointer" onClick={() => setSidebarOpen(false)}>
                <h1 className="text-white font-heading font-bold text-xl -rotate-90 tracking-widest mt-12 whitespace-nowrap group-hover:scale-110 transition-transform">AMRITH.</h1>
              </Link>

              <nav className="flex-1 space-y-6 w-full flex flex-col items-center mt-12">
                {patientLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-md transition-all duration-300 ${
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
                  className="flex items-center justify-center w-12 h-12 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all"
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md text-text-muted hover:bg-white shadow-sm transition-all bg-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-heading font-bold text-text hidden sm:block">{t('portal.patientPortal')}</h2>
          </div>

          <div className="flex items-center gap-4">
            <PortalActions />
            <div className="hidden md:block w-px h-6 bg-border mx-2" />
            <Link to="/patient/profile" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-border flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Kate'}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </Link>
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
