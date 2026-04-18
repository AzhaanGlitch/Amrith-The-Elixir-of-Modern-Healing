import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function PortalActions({ dark = false }) {
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Language Selector */}
      <div ref={langRef} className="relative">
        <button
          onClick={() => setLangOpen(!langOpen)}
          className={`group relative w-10 h-10 flex items-center justify-center rounded-md transition-all ${
            dark 
              ? 'text-white/70 hover:text-white hover:bg-white/10 border border-white/5 bg-black' 
              : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100 border border-border bg-white shadow-sm'
          }`}
          aria-label="Change Language"
        >
          <Globe className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-full mt-2 w-44 bg-white/95 backdrop-blur-xl rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden z-50`}
            >
              <div className="py-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all ${
                      language === lang.code
                        ? 'bg-purple-50 text-purple-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {language === lang.code && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Donate Button */}
      <Link 
        to="/contact" 
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all group ${
          dark 
            ? 'text-white/70 hover:text-white hover:bg-white/10 border border-white/5 bg-black' 
            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100 border border-border bg-white shadow-sm'
        }`}
        title="Donate"
      >
        <Heart className="w-5 h-5 group-hover:fill-red-500 transition-colors" />
      </Link>
    </div>
  );
}
