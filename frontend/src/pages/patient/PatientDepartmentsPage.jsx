import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, SearchBar, Button } from '../../components/ui';
import { departments } from '../../data/mockData';
import {
  Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse,
  Scan, Microscope, Activity, Wind, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react';

const iconMap = { Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse, Scan, Microscope, Activity, Wind };

export default function PatientDepartmentsPage() {
  const [search, setSearch] = useState('');
  const [expandedDept, setExpandedDept] = useState(null);
  const navigate = useNavigate();

  const filtered = useMemo(() =>
    departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const toggleDept = (id) => {
    setExpandedDept(prev => prev === id ? null : id);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">Departments</h1>
        <SearchBar placeholder="Search departments..." value={search} onChange={setSearch} className="sm:w-72" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((dept, i) => {
          const Icon = iconMap[dept.icon] || Stethoscope;
          const isExpanded = expandedDept === dept.id;
          
          return (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="p-6 h-full flex flex-col cursor-pointer transition-shadow hover:shadow-md" onClick={() => toggleDept(dept.id)}>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: dept.color + '15' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: dept.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-text">{dept.name}</h3>
                    <p className="text-text-muted text-sm">{dept.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
                  <Badge variant="neutral">{dept.diseases.length} Tests Available</Badge>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    {isExpanded ? 'Hide Tests' : 'View Tests'} 
                    {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </Button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-dashed border-border flex flex-col gap-3"
                    >
                      {dept.diseases.map(test => (
                        <div key={test.id} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border-light transition-colors hover:border-primary">
                          <div>
                            <p className="text-sm font-semibold text-text">{test.name}</p>
                            <p className="text-xs text-text-muted line-clamp-1">{test.description}</p>
                          </div>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/patient/book?testId=${test.id}`); }} className="ml-4 shrink-0 px-3">
                            Book <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
