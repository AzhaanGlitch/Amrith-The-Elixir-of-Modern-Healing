import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, SearchBar } from '../components/ui';
import { departments } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import {
  Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse,
  Scan, Microscope, Activity, Wind, ArrowRight, CheckCircle2, Upload,
  Camera, FileImage, Thermometer
} from 'lucide-react';

const iconMap = { Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse, Scan, Microscope, Activity, Wind };

const inputIcons = {
  images: { icon: Camera, label: 'Images' },
  xray: { icon: FileImage, label: 'X-Ray' },
  readings: { icon: Thermometer, label: 'Readings' },
  reports: { icon: Upload, label: 'Reports' },
};

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DepartmentsPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return departments.filter(d => 
      d.name.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term) ||
      d.diseases.some(dis => dis.name.toLowerCase().includes(term))
    );
  }, [search]);

  return (
    <div className="pt-24 min-h-screen bg-bg">
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/navbar_pages/departments.jpg" alt="Background" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary-dark/80" />
        </div>

        {/* Animated Background Elements for consistency */}
        <motion.div 
          className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl z-0"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl z-0"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl lg:text-6xl font-heading font-extrabold mb-5 drop-shadow-md">
              {t('depts.title')}
            </h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
              {t('depts.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <SearchBar
            placeholder={t('depts.searchPlaceholder')}
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filtered.map(dept => {
            const Icon = iconMap[dept.icon] || Stethoscope;
            const match = dept.name.match(/^(.*?)\s*\((.*)\)$/);
            const title = match ? match[1] : dept.name;
            const desc = match ? `(${match[2]})` : null;

            return (
              <motion.div key={dept.id} variants={item}>
                <Card
                  className="p-8 h-full flex flex-col cursor-pointer group text-center justify-center items-center"
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  <h3 className="font-heading font-bold text-text text-xl mb-3 group-hover:text-primary transition-colors flex flex-col items-center">
                    <span className="underline decoration-primary/30 underline-offset-8">{title}</span>
                    {desc && <span className="block text-base font-bold text-text no-underline mt-2">{desc}</span>}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">{dept.description}</p>
                  <span className="text-primary text-sm font-semibold flex items-center justify-center transition-all mt-auto pt-4 border-t border-border-light w-full">
                    {t('depts.explore')}
                  </span>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">{t('depts.noResults1')}{search}{t('depts.noResults2')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
