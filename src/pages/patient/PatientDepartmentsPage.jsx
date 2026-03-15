import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, SearchBar, Button } from '../../components/ui';
import { departments, tests } from '../../data/mockData';
import {
  Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse,
  Scan, Microscope, Activity, Wind, ArrowRight
} from 'lucide-react';

const iconMap = { Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse, Scan, Microscope, Activity, Wind };

export default function PatientDepartmentsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">Departments</h1>
        <SearchBar placeholder="Search departments..." value={search} onChange={setSearch} className="sm:w-72" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((dept, i) => {
          const Icon = iconMap[dept.icon] || Stethoscope;
          const deptTests = tests.filter(t => t.departmentId === dept.id);
          return (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="p-6 h-full flex flex-col group">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: dept.color + '15' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: dept.color }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text">{dept.name}</h3>
                    <p className="text-text-muted text-sm">{dept.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
                  <Badge variant="neutral">{dept.testsCount} Tests Available</Badge>
                  <Link to="/patient/book">
                    <Button size="sm">
                      Book Now <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
