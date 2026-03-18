import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light hover:shadow-lg active:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark hover:shadow-lg active:bg-secondary-dark',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
    'outline-gold': 'border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white',
    ghost: 'text-primary bg-transparent hover:bg-primary/10',
    danger: 'bg-error text-white hover:bg-red-600',
    white: 'bg-white text-primary hover:bg-gray-50 shadow-md',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
    xl: 'px-10 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Card({ children, className = '', hover = true, onClick }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 8px 24px rgba(0,109,119,0.1)' } : {}}
      className={`bg-surface rounded-2xl shadow-[var(--shadow-card)] overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/15 text-secondary-dark',
    accent: 'bg-accent/15 text-accent-dark',
    error: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    neutral: 'bg-gray-100 text-text-secondary',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-3 border-primary/20 border-t-primary rounded-full animate-spin`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-heading font-bold text-primary flex items-center gap-2"
      >
        <img src="/logo.png" alt="Amrith Logo" className="h-16 w-auto object-contain drop-shadow-lg" />
      </motion.div>
      <Spinner size="lg" />
      <p className="text-text-muted text-sm">Loading your health dashboard...</p>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className={`relative bg-surface rounded-2xl shadow-[var(--shadow-modal)] w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
      >
        <div className="sticky top-0 bg-surface flex items-center justify-between p-6 pb-4 border-b border-border-light">
          <h2 className="text-xl font-heading font-bold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {Icon && <Icon className="w-16 h-16 text-text-muted/40 mb-4" />}
      <h3 className="text-lg font-heading font-semibold text-text mb-2">{title}</h3>
      <p className="text-text-muted text-sm max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = 'primary' }) {
  const colors = {
    primary: 'from-primary to-primary-light',
    secondary: 'from-secondary to-secondary-light',
    accent: 'from-accent to-accent-light',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm mb-1">{label}</p>
          <p className="text-3xl font-heading font-bold text-text">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-secondary-dark' : 'text-error'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </Card>
  );
}

export function SearchBar({ placeholder = 'Search...', value, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 pl-12 pr-4 bg-white border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        aria-label={placeholder}
      />
    </div>
  );
}

export function Avatar({ name, size = 'md', className = '' }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-primary-light text-white font-semibold flex items-center justify-center ${className}`}>
      {initials}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-text">{title}</h2>
        {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
