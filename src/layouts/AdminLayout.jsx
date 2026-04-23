import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PortalActions from '../components/PortalActions';
import {
  LayoutDashboard, Key, User,
  Menu, X, LogOut, ChevronLeft, Bell
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AdminLayout() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const adminLinks = [
    { label: t('portal.adminDashboard'), path: '/admin/dashboard', icon: LayoutDashboard },
    { label: t('portal.accessGenerator'), path: '/admin/generator', icon: Key },
    { label: t('portal.profile'), path: '/admin/profile', icon: User },
  ];
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-[#000000] flex text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 flex-col bg-[#000000] z-40 rounded-r-md shadow-2xl overflow-hidden py-8 items-center border-r border-[#333]">
        <Link to="/" className="mb-12 block group cursor-pointer">
          <h1 className="text-white font-heading font-bold text-xl -rotate-90 tracking-widest mt-12 whitespace-nowrap group-hover:scale-110 transition-transform">AMRITH.</h1>
        </Link>

        <nav className="flex-1 space-y-6 w-full flex flex-col items-center mt-12" aria-label="Admin navigation">
          {adminLinks.map((link, i) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center justify-center w-12 h-12 rounded-md transition-all duration-300 ${
                  active
                    ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
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
            className="flex items-center justify-center w-12 h-12 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-24 bg-[#000000] z-50 lg:hidden flex flex-col items-center py-8 rounded-r-md shadow-2xl border-r border-[#333]"
            >
              <Link to="/" className="mb-12 block group cursor-pointer" onClick={() => setSidebarOpen(false)}>
                <h1 className="text-white font-heading font-bold text-xl -rotate-90 tracking-widest mt-12 whitespace-nowrap group-hover:scale-110 transition-transform">AMRITH.</h1>
              </Link>

              <nav className="flex-1 space-y-6 w-full flex flex-col items-center mt-12">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-md transition-all duration-300 ${
                        active
                          ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                          : 'text-white/40 hover:text-white hover:bg-white/5'
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
                  className="flex items-center justify-center w-12 h-12 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-24 flex flex-col min-h-screen bg-[#000000]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#000000]/90 backdrop-blur-md px-6 sm:px-10 h-24 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full hidden sm:block">
              <h2 className="text-2xl font-heading font-bold text-white">{t('portal.adminPortal')}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <PortalActions dark />
            <Link to="/admin/profile" className="flex items-center gap-2 pl-2">
              <div className="w-10 h-10 rounded-full bg-[#000000] border border-white/10 flex items-center justify-center overflow-hidden">
                <span className="text-sm font-bold text-gray-300">A</span>
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
