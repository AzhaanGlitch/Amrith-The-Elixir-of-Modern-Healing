import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '../components/ui';
import { departments } from '../data/mockData';
import { CheckCircle2, ArrowRight, Shield, Sparkles, HeartPulse, Brain, Scan } from 'lucide-react';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const screeningBundles = [
  {
    id: 1,
    name: 'Complete Wellness Screening',
    description: 'A comprehensive AI health check covering cardiovascular, neurological, and general medicine assessments.',
    badge: 'Most Popular',
    deptIds: [6, 7, 8],
    icon: HeartPulse,
  },
  {
    id: 2,
    name: 'Full Body Imaging Analysis',
    description: 'Upload X-rays and medical images for AI analysis across orthopedic, pulmonary, and oncology departments.',
    badge: 'Recommended',
    deptIds: [2, 4, 5],
    icon: Scan,
  },
  {
    id: 3,
    name: 'Skin & Eye Care Bundle',
    description: 'Comprehensive dermatological and ophthalmological AI screening from uploaded images.',
    badge: null,
    deptIds: [1, 3],
    icon: Sparkles,
  },
  {
    id: 4,
    name: 'Neuro & Cardio Screening',
    description: 'Combined neurological and cardiovascular risk assessment using symptoms, readings, and medical reports.',
    badge: 'Advanced',
    deptIds: [7, 8],
    icon: Brain,
  },
];

export default function PackagesPage() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-heading font-bold mb-4">
            AI Screening Bundles
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-2xl mx-auto">
            Comprehensive multi-department health screenings powered by AI — completely free. Choose a bundle or screen individual conditions.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-8">
            {screeningBundles.map((bundle, i) => {
              const bundleDepts = bundle.deptIds.map(did => departments.find(d => d.id === did)).filter(Boolean);
              const totalConditions = bundleDepts.reduce((acc, d) => acc + d.diseases.length, 0);
              const BundleIcon = bundle.icon;

              return (
                <motion.div key={bundle.id} variants={item}>
                  <Card className={`p-8 h-full flex flex-col ${i === 0 ? 'ring-2 ring-primary relative' : ''}`}>
                    {bundle.badge && (
                      <Badge variant={bundle.badge === 'Most Popular' ? 'accent' : bundle.badge === 'Recommended' ? 'primary' : 'secondary'} className="mb-4 self-start">
                        {bundle.badge}
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <BundleIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-text">{bundle.name}</h3>
                    </div>
                    
                    <p className="text-text-muted text-sm mb-6">{bundle.description}</p>

                    <div className="space-y-3 mb-6 flex-1">
                      {bundleDepts.map(dept => (
                        <div key={dept.id}>
                          <p className="text-sm font-semibold text-text mb-1.5">{dept.name}</p>
                          <div className="space-y-1 pl-1">
                            {dept.diseases.map(disease => (
                              <div key={disease.id} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                <span className="text-xs text-text-secondary">{disease.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border-light pt-6 flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-heading font-bold text-primary">Free</span>
                        <p className="text-xs text-text-muted mt-1">
                          {totalConditions} conditions • {bundleDepts.length} departments
                        </p>
                      </div>
                      <Button onClick={() => navigate(`/departments/${bundle.deptIds[0]}`)}>
                        Start Screening <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <Card className="p-6 bg-emerald-50 border-emerald-100 shadow-none">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-1">100% Free & Secure</h4>
                  <p className="text-sm text-emerald-700">All AI screenings are completely free. Your medical data is encrypted during transmission and automatically deleted after analysis. We never sell or share your health information.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
