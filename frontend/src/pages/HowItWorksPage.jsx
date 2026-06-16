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
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/navbar_pages/how_it_works.jpg" alt="Background" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary-dark/80" />
        </div>

        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl z-0"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl z-0"
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
          
          <div className="relative">
            {/* Vertical Timeline Line - Scoped to steps only */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-secondary to-accent hidden md:block opacity-10 rounded-full -z-0" />
            
            <div className="space-y-24 relative z-10">
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
                  <div className="flex-1 text-center md:text-left md:group-even:text-right bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-light hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2">
                    <span className={`text-sm font-bold tracking-widest uppercase mb-2 block text-primary`}>Step {String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-3xl font-heading font-bold text-text mb-4 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-text-secondary leading-relaxed text-lg">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interactive Video & PDF section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 pt-24 border-t border-border-light relative z-10"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-black text-text mb-4">See It In Action</h2>
              <p className="text-text-muted text-xl max-w-3xl mx-auto">Watch a full walkthrough of the platform or review a comprehensive sample report.</p>
            </div>

            {/* Centered Video Element */}
            <div className="w-full max-w-6xl mx-auto aspect-video bg-black rounded-xl border border-border shadow-2xl overflow-hidden mb-24">
              <video 
                src="/amrith_demo_video.mp4" 
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left side: Text Description for PDF */}
              <div>
                <h3 className="text-2xl font-heading font-bold text-text mb-4">Comprehensive Demo Report</h3>
                <p className="text-text-muted text-lg leading-relaxed mb-6">
                  After the machine learning model analyzes your uploaded symptoms, images, and reports, you receive a highly detailed, instantly generated health analysis report.
                </p>
                <p className="text-text-muted text-lg leading-relaxed">
                  This comprehensive document includes risk assessments, precise breakdowns of detected anomalies, and actionable medical recommendations. You can download and share this with your primary care physician for a seamless transition to physical care.
                </p>
              </div>

              {/* Right side: PDF display */}
              <div className="w-full h-[600px] bg-white rounded-none border border-border shadow-xl overflow-hidden relative">
                <div className="w-full h-full bg-slate-100">
                  <object 
                    data="/amrith_report.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                    type="application/pdf" 
                    className="w-full h-full"
                  >
                    <iframe 
                      src="/amrith_report.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                      title="Amrith Demo Report"
                      className="w-full h-full border-none"
                    >
                      <div className="p-6 text-center">
                        <p className="text-text-secondary mb-4">Your browser does not support viewing PDFs directly.</p>
                        <a 
                          href="/amrith_report.pdf" 
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md font-semibold"
                        >
                          Download PDF Report
                        </a>
                      </div>
                    </iframe>
                  </object>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-32 bg-gradient-to-r from-primary/10 to-secondary/10 p-12 rounded-3xl border border-primary/20 relative z-10"
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
