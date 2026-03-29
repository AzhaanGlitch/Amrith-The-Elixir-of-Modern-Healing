import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Search, CalendarCheck, Home, FileBarChart, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Browse & Choose', desc: 'Search from 200+ lab tests, health packages, or book a doctor consultation. Compare prices and read test details.', color: 'text-primary' },
  { icon: CalendarCheck, title: 'Book & Schedule', desc: 'Pick a convenient date and time slot. Choose between home sample collection or lab visit. Secure online payment.', color: 'text-secondary' },
  { icon: Home, title: 'Sample Collection', desc: 'Our certified phlebotomist visits your home, or visit any of our partner labs. Safe, hygienic, and professional.', color: 'text-accent' },
  { icon: FileBarChart, title: 'Get Smart Reports', desc: 'Receive digital reports on your dashboard within hours. AI-powered health summaries help you understand results at a glance.', color: 'text-purple-500' },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-24 min-h-screen bg-bg">
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-24 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-6 drop-shadow-lg">
            How Amrith Works
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/90 max-w-2xl mx-auto font-light">
            Simple, hassle-free healthcare designed around you. Your journey to better health in four simple steps.
          </motion.p>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent hidden md:block opacity-20 rounded-full" />
          
          <div className="space-y-24">
            {steps.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`flex flex-col md:flex-row items-center gap-12 group ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''} relative`}
              >
                {/* Timeline Dot */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary z-10 shadow-lg group-hover:scale-125 group-hover:border-secondary transition-all duration-300" />
                
                <div className="flex-1 flex justify-center md:justify-end md:group-even:justify-start w-full cursor-default">
                   <motion.div 
                     whileHover={{ rotate: 10, scale: 1.1 }}
                     transition={{ type: "spring", stiffness: 300 }}
                     className="relative z-10 bg-white/5 p-6 rounded-full"
                   >
                     <Icon className={`w-32 h-32 ${color} drop-shadow-xl transition-all duration-300 group-hover:brightness-110`} strokeWidth={1.5} />
                   </motion.div>
                </div>
                
                <div className="flex-1 text-center md:text-left md:group-even:text-right bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-light hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2">
                  <span className={`text-sm font-bold tracking-widest uppercase mb-2 block ${color}`}>Step {String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-3xl font-heading font-bold text-text mb-4 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-text-secondary leading-relaxed text-lg">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-32 bg-gradient-to-r from-primary/10 to-secondary/10 p-12 rounded-3xl border border-primary/20"
          >
            <h3 className="text-3xl font-heading font-bold text-text mb-4">Ready to Prioritize Your Health?</h3>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">Join thousands of others who manage their healthcare effectively in under 2 minutes.</p>
            <Link to="/signup">
              <Button size="lg" className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
