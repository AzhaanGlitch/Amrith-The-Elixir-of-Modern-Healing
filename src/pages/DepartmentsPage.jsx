import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, SearchBar, SectionHeader } from '../components/ui';
import { departments } from '../data/mockData';
import {
  Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse,
  Scan, Microscope, Activity, Wind, ArrowRight
} from 'lucide-react';

const iconMap = { Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse, Scan, Microscope, Activity, Wind };

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DepartmentsPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() =>
    departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-text mb-3">Medical Departments</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Browse our comprehensive range of medical specialties and find the right tests for your health needs.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <SearchBar
            placeholder="Search departments..."
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
                  <p className="text-text-muted text-sm mb-4 flex-1">{dept.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral">{dept.testsCount} Tests</Badge>
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
            <p className="text-text-muted text-lg">No departments match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
