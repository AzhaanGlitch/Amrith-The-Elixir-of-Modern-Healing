import { Link } from 'react-router-dom';
import { Mail, Phone, Github, Linkedin } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
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



          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-purple-300 mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Call at</p>
                  <p className="text-sm text-white font-medium">+91 7983595318</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Email</p>
                  <a href="mailto:azhaanalisiddiqui15@gmail.com" className="text-sm text-white font-medium hover:text-accent transition-colors">azhaanalisiddiqui15@gmail.com</a>
                </div>
              </li>
              <li className="pt-2">
                <p className="text-sm text-gray-300 mb-3">Follow Us</p>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/AzhaanGlitch" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2.5 rounded-full hover:bg-accent hover:text-white transition-all duration-300 group">
                    <Github className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://www.linkedin.com/in/azhaanalisiddiqui/" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2.5 rounded-full hover:bg-accent hover:text-white transition-all duration-300 group">
                    <Linkedin className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </a>
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
        </div>
      </div>
    </footer>
  );
}
