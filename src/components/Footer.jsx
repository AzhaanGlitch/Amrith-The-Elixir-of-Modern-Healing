import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-text text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💧</span>
              <span className="text-xl font-heading font-bold text-white">Amrith</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The Elixir of Modern Healing. Premium healthcare platform making quality diagnostics accessible, 
              affordable, and convenient for everyone.
            </p>
            <div className="flex items-center gap-2 text-accent text-sm font-medium">
              <Heart className="w-4 h-4 fill-accent" />
              Made with care for your health
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'How It Works', 'Departments', 'Packages', 'Blog', 'Contact'].map(item => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 text-sm hover:text-accent transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {['Lab Tests', 'Health Packages', 'Home Collection', 'Doctor Consultation', 'Health Reports', 'AI Health Summary'].map(item => (
                <li key={item}>
                  <span className="text-gray-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Toll Free</p>
                  <p className="text-sm text-white font-medium">1800-123-AMRITH</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-sm text-white font-medium">hello@amrith.health</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Head Office</p>
                  <p className="text-sm text-white font-medium">Bangalore, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 Amrith Healthcare Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="#" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
