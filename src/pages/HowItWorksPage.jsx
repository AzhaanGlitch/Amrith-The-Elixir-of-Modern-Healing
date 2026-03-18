import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { Search, CalendarCheck, Home, FileBarChart, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Browse & Choose', desc: 'Search from 200+ lab tests, health packages, or book a doctor consultation. Compare prices and read test details.', color: 'from-primary to-primary-light' },
  { icon: CalendarCheck, title: 'Book & Schedule', desc: 'Pick a convenient date and time slot. Choose between home sample collection or lab visit. Secure online payment.', color: 'from-secondary to-emerald-500' },
  { icon: Home, title: 'Sample Collection', desc: 'Our certified phlebotomist visits your home, or visit any of our partner labs. Safe, hygienic, and professional.', color: 'from-accent to-amber-500' },
  { icon: FileBarChart, title: 'Get Smart Reports', desc: 'Receive digital reports on your dashboard within hours. AI-powered health summaries help you understand results at a glance.', color: 'from-purple-500 to-indigo-500' },
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-heading font-bold mb-4">
            How Amrith Works
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-2xl mx-auto">
            Simple, hassle-free healthcare in just a few steps
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`w-32 h-32 bg-gradient-to-br ${color} rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-14 h-14 text-white drop-shadow-md" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-xs font-bold text-accent tracking-widest uppercase">Step {String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-2xl font-heading font-bold text-text mt-2 mb-3">{title}</h3>
                  <p className="text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-20">
            <h3 className="text-2xl font-heading font-bold text-text mb-4">Ready to Get Started?</h3>
            <p className="text-text-muted mb-8">Book your first test in under 2 minutes</p>
            <Link to="/signup">
              <Button size="lg">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
