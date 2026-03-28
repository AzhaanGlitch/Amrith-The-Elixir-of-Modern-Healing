import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, SearchBar } from '../components/ui';
import { departments } from '../data/mockData';
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
        {/* Animated Background Elements for consistency */}
        <motion.div 
          className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="primary" className="mb-6 text-xs font-bold uppercase tracking-widest px-4 py-1.5 bg-white/20 text-white border-0 shadow-sm backdrop-blur-md">100% Free</Badge>
            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold mb-5 drop-shadow-md">
              AI-Powered Medical Departments
            </h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
              Browse our comprehensive range of AI diagnostic specialties. Upload your scans, answer symptom questions, and get instant AI analysis — all for free.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <SearchBar
            placeholder="Search departments or diseases..."
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
            return (
              <motion.div key={dept.id} variants={item}>
                <Card
                  className="p-6 h-full flex flex-col cursor-pointer group"
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: dept.color + '15' }}
                  >
                    <Icon className="w-7 h-7" style={{ color: dept.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-text text-lg mb-1">{dept.name}</h3>
                  <p className="text-text-muted text-sm mb-4">{dept.description}</p>
                  
                  {/* Disease list */}
                  <div className="space-y-1.5 mb-4 flex-1">
                    {dept.diseases.map(disease => (
                      <div key={disease.id} className="flex items-center gap-2 text-xs text-text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{disease.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Input types & footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border-light">
                    <div className="flex gap-1.5">
                      {dept.inputTypes.map(type => {
                        const input = inputIcons[type];
                        if (!input) return null;
                        const InputIcon = input.icon;
                        return (
                          <div key={type} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/5 text-xs text-primary font-medium">
                            <InputIcon className="w-3 h-3" />
                            {input.label}
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">No departments or diseases match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
