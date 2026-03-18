import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Menu, X, Search, ChevronDown, LogOut, User, LayoutDashboard,
  Calendar, FileText, Settings, TestTubes, Building2
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const dashboardPath = user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';

  const publicLinks = [
    { label: 'Departments', path: '/departments' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Packages', path: '/packages' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
      <nav className="max-w-7xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-4xl pointer-events-auto" role="navigation" aria-label="Main navigation">
        <div className="px-3 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="Amrith Home">
              <img src="/logo.png" alt="Amrith Logo" className="h-9 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300" />
            </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {publicLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Dashboard Quick Link */}
                <Link
                  to={dashboardPath}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-all"
                    aria-label="User menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white text-xs font-semibold flex items-center justify-center">
                      {user.avatar}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[var(--shadow-modal)] border border-border-light overflow-hidden"
                      >
                        <div className="p-4 border-b border-border-light bg-background/50">
                          <p className="font-semibold text-text text-sm">{user.name}</p>
                          <p className="text-xs text-text-muted mt-0.5 capitalize">{user.role}</p>
                        </div>
                        <div className="py-2">
                          <Link to={dashboardPath} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-all">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          {user.role === 'patient' && (
                            <>
                              <Link to="/patient/appointments" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-all">
                                <Calendar className="w-4 h-4" /> Appointments
                              </Link>
                              <Link to="/patient/reports" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-all">
                                <FileText className="w-4 h-4" /> Reports
                              </Link>
                            </>
                          )}
                          <Link
                            to={user.role === 'doctor' ? '/doctor/profile' : '/patient/profile'}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-all"
                          >
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                        </div>
                        <div className="border-t border-border-light py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-all w-full text-left"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-black bg-white rounded-3xl hover:bg-gray-100 hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 rounded-b-2xl overflow-hidden"
          >
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search tests, departments, doctors..."
                  className="w-full py-3.5 pl-12 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/50 focus:border-white/30 focus:ring-2 focus:ring-white/10 text-sm"
                  autoFocus
                  aria-label="Search across Amrith"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-black/50 backdrop-blur-md overflow-hidden rounded-b-2xl"
          >
            <div className="px-4 py-4 space-y-1">
              {publicLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                  <Link to="/login" className="block text-center px-4 py-3 rounded-xl text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-all">
                    Sign In
                  </Link>
                  <Link to="/signup" className="block text-center px-4 py-3 rounded-xl text-sm font-medium text-black bg-white hover:bg-gray-100 transition-all">
                    Get Started
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="pt-4 border-t border-white/10 space-y-1">
                  <Link to={dashboardPath} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
}
