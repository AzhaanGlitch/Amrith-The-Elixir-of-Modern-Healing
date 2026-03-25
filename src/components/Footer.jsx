import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative text-white overflow-hidden" role="contentinfo">
      {/* Background image with purple tint + blur */}
      <div className="absolute inset-0 z-0">
        <img
          src="/footer.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'blur(1px) brightness(0.60) saturate(0.8)', opacity: 0.8 }}
        />
        {/* Bright lavender tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#a78bfa]/85 via-[#c4b5fd]/70 to-[#b085f5]/80" />
        {/* Subtle dark layer only for text contrast */}
        <div className="absolute inset-0 bg-black/45" />
      </div>
      {/* Main Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img src="/logo.png" alt="Amrith Logo" className="h-10 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              The Elixir of Modern Healing. A premium AI-powered virtual hospital making quality diagnostics accessible, 
              free, and convenient for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-purple-300 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'How It Works', 'Departments', 'Blog', 'Contact'].map(item => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-300 text-sm hover:text-accent transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-purple-300 mb-4">Services</h4>
            <ul className="space-y-3">
              {['Tuberculosis AI', 'Skin Cancer AI', 'Heart Health AI', 'Virtual Consultations', 'Digital Reports'].map(item => (
                <li key={item}>
                  <span className="text-gray300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-purple-300 mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Toll Free</p>
                  <p className="text-sm text-white font-medium">1800-123-AMRITH</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Email</p>
                  <p className="text-sm text-white font-medium">hello@amrith.health</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Head Office</p>
                  <p className="text-sm text-white font-medium">Bangalore, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white text-xs">
            © 2026 Amrith Healthcare Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-white text-xs hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-white text-xs hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="#" className="text-white text-xs hover:text-gray-300 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
