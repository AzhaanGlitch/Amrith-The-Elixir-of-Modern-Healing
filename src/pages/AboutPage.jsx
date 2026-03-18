import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { Heart, Shield, Users, Award, Target, Sparkles } from 'lucide-react';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-heading font-bold mb-4">
            About Amrith
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-2xl mx-auto">
            Redefining healthcare accessibility through technology, transparency, and trust.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-text mb-6">Our Mission</h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                At Amrith, we believe quality healthcare shouldn't be a privilege. Named after the mythical "Amrit" — 
                the nectar of immortality — we strive to bring the elixir of modern healing to every doorstep.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                We connect patients with NABL-accredited labs and experienced doctors, 
                making diagnostic testing affordable, transparent, and accessible. Our AI-powered health insights 
                help patients understand their reports, not just receive them.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '50K+', label: 'Patients Served' },
                  { value: '200+', label: 'Lab Tests' },
                  { value: '500+', label: 'Expert Doctors' },
                  { value: '15+', label: 'Cities' },
                ].map((s, i) => (
                  <div key={i} className="bg-background rounded-xl p-4">
                    <p className="text-2xl font-heading font-bold text-primary">{s.value}</p>
                    <p className="text-text-muted text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 flex items-center justify-center">
              <div className="text-center flex flex-col items-center">
                <img src="/logo.png" alt="Amrith Logo" className="h-32 w-auto object-contain drop-shadow-md mb-6" />
                <p className="text-2xl font-heading font-bold text-primary">The Elixir of</p>
                <p className="text-2xl font-heading font-bold text-accent">Modern Healing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-heading font-bold text-text mb-3">Our Core Values</h2>
            <p className="text-text-muted text-lg">What drives us every single day</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Patient First', desc: 'Every decision is made keeping our patients\' well-being at the center.', color: 'from-red-400 to-pink-500' },
              { icon: Shield, title: 'Quality Assured', desc: 'NABL-accredited partners, strict SOPs, and zero-compromise standards.', color: 'from-primary to-primary-light' },
              { icon: Target, title: 'Transparency', desc: 'No hidden charges. What you see is what you pay. Always.', color: 'from-accent to-amber-500' },
              { icon: Users, title: 'Accessibility', desc: 'Premium healthcare made affordable and available across India.', color: 'from-secondary to-emerald-500' },
              { icon: Sparkles, title: 'Innovation', desc: 'AI-powered insights, digital reports, and smart health monitoring.', color: 'from-purple-400 to-indigo-500' },
              { icon: Award, title: 'Trust', desc: 'Built on trust, backed by expertise, verified by results.', color: 'from-blue-400 to-cyan-500' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={i} variants={item}>
                <Card className="p-8 h-full text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-text text-lg mb-2">{title}</h3>
                  <p className="text-text-muted text-sm">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Join the Amrith Family</h2>
          <p className="text-white/80 mb-8">Experience healthcare the way it should be.</p>
          <Link to="/signup">
            <Button variant="white" size="lg">Get Started Today</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
