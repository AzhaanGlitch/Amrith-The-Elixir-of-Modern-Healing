import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../components/ui';
import { packages, tests } from '../data/mockData';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function PackagesPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-heading font-bold mb-4">
            Health Packages
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-2xl mx-auto">
            Comprehensive health packages at unbeatable prices. Save up to 50% compared to individual tests.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-8">
            {packages.map((pkg, i) => {
              const pkgTests = pkg.tests.map(tid => tests.find(t => t.id === tid)).filter(Boolean);
              return (
                <motion.div key={pkg.id} variants={item}>
                  <Card className={`p-8 h-full flex flex-col ${i === 0 ? 'ring-2 ring-primary relative' : ''}`}>
                    {pkg.badge && (
                      <Badge variant={pkg.badge === 'Best Seller' ? 'accent' : pkg.badge === 'Recommended' ? 'primary' : 'secondary'} className="mb-4 self-start">
                        {pkg.badge}
                      </Badge>
                    )}
                    <h3 className="text-xl font-heading font-bold text-text mb-2">{pkg.name}</h3>
                    <p className="text-text-muted text-sm mb-6">{pkg.description}</p>

                    <div className="space-y-3 mb-6 flex-1">
                      {pkgTests.map(t => (
                        <div key={t.id} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                          <span className="text-sm text-text-secondary">{t.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border-light pt-6 flex items-end justify-between">
                      <div>
                        <span className="text-3xl font-heading font-bold text-primary">₹{pkg.price}</span>
                        <span className="text-lg text-text-muted line-through ml-2">₹{pkg.originalPrice}</span>
                        <p className="text-xs text-secondary-dark font-semibold mt-1">
                          Save ₹{pkg.originalPrice - pkg.price} ({Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF)
                        </p>
                      </div>
                      <Link to="/login">
                        <Button>
                          Book Now <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
