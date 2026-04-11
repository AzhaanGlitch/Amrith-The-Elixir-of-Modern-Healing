import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, FileText } from 'lucide-react';

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    { title: 'Visit the Website', desc: 'Start your journey by navigating to the Amrith AI platform from any device.' },
    { title: 'Choose Disease', desc: 'Search or choose which specific disease or medical condition you want to check from our specialized departments.' },
    { title: 'Login as Patient', desc: 'Securely log in as a patient to proceed further and keep your medical data private.' },
    { title: 'Answer Symptoms', desc: 'Give some basic answers to our dynamic questionnaire regarding your current symptoms and medical history.' },
    { title: 'Upload Data', desc: 'Upload your respective medical data in the form of required images, X-rays, or medical reports.' },
    { title: 'AI Analysis', desc: 'Wait for our trained ML models to deeply analyze your symptoms and uploaded medical files.' },
    { title: 'Get Results', desc: 'Get your comprehensive preliminary results and risk assessments in just a few minutes.' },
    { title: 'Doctor Monitoring', desc: 'If logged in as a doctor, monitor all your patients and deal with cases accordingly via the doctors dashboard.' },
  ];

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
            How Amrith AI Works
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/90 max-w-2xl mx-auto font-light">
            Follow these interactive steps to understand the complete journey of AI-powered health analysis.
          </motion.p>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent hidden md:block opacity-20 rounded-full" />
          
          <div className="space-y-24">
            {steps.map(({ title, desc }, i) => (
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
                
                {/* Huge Number instead of Icon */}
                <div className="flex-1 flex justify-center md:justify-end md:group-even:justify-start w-full cursor-default">
                   <motion.div 
                     whileHover={{ rotate: 5, scale: 1.1 }}
                     transition={{ type: "spring", stiffness: 300 }}
                     className="relative z-10 bg-gradient-to-br from-primary/10 to-primary/5 w-32 h-32 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                   >
                     <span className="font-heading font-black text-6xl text-primary/40 group-hover:text-primary transition-colors duration-300">
                       {i + 1}
                     </span>
                   </motion.div>
                </div>
                
                {/* Step Content */}
                <div className="flex-1 text-center md:text-left md:group-even:text-right bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-light hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2">
                  <span className={`text-sm font-bold tracking-widest uppercase mb-2 block text-primary`}>Step {String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-3xl font-heading font-bold text-text mb-4 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-text-secondary leading-relaxed text-lg">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Video & PDF section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 pt-24 border-t border-border-light"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-black text-text mb-4">See It In Action</h2>
              <p className="text-text-muted text-xl max-w-3xl mx-auto">Watch a full walkthrough of the platform or review a comprehensive sample report.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Video Demo */}
              <div className="flex flex-col gap-6">
                <div className="w-full aspect-video bg-black/5 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                       <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                     </div>
                  </div>
                  <p className="font-semibold text-lg z-10 group-hover:opacity-0 transition-opacity">Video Demo Area</p>
                  <p className="text-sm z-10 group-hover:opacity-0 transition-opacity">(Video will be added here later)</p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-heading font-bold text-text mb-2">Platform Walkthrough</h3>
                  <p className="text-text-secondary">A complete video demonstration showcasing how patients can interact with the ML models.</p>
                </div>
              </div>

              {/* Demo PDF */}
              <div className="flex flex-col gap-6">
                <div className="w-full aspect-[16/9] bg-primary/5 rounded-3xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary/60 relative overflow-hidden group cursor-pointer hover:bg-primary/10 transition-colors">
                  <FileText className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <p className="font-semibold text-lg">Sample PDF Report</p>
                  <p className="text-sm">(PDF document will be embedded here)</p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-heading font-bold text-text mb-2">Comprehensive Demo Report</h3>
                  <p className="text-text-secondary">View a sample of the detailed analysis report generated by our advanced ML models, including risk assessments and actionable recommendations.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-32 bg-gradient-to-r from-primary/10 to-secondary/10 p-12 rounded-3xl border border-primary/20"
          >
            <h3 className="text-3xl font-heading font-bold text-text mb-4">{t('howItWorks.ctaTitle')}</h3>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">{t('howItWorks.ctaDesc')}</p>
            <Link to="/signup">
              <Button size="lg" className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {t('howItWorks.ctaBtn')} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
