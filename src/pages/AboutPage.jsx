import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { Heart, Shield, Users, Award, Target, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="pt-24 min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl flex-shrink-0"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl flex-shrink-0"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl xl:text-6xl font-heading font-bold mb-6 drop-shadow-lg">
            {t('about.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/90 max-w-2xl mx-auto font-light">
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 relative bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-text mb-8 relative inline-block">
                {t('about.missionTitle')}
                <div className="absolute -bottom-2 left-0 w-1/2 h-1.5 bg-primary/20 rounded-full"></div>
                <div className="absolute -bottom-2 left-0 w-1/4 h-1.5 bg-primary rounded-full"></div>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                {t('about.missionP1')}
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                {t('about.missionP2')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '50K+', label: t('about.stat1') },
                  { value: '200+', label: t('about.stat2') },
                  { value: '500+', label: t('about.stat3') },
                  { value: '15+', label: t('about.stat4') },
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-border-light shadow-sm rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <p className="text-3xl font-heading font-bold text-primary mb-1">{s.value}</p>
                    <p className="text-text-secondary font-medium text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center flex flex-col items-center">
                <img src="/logo.png" alt="Amrith Logo" className="h-92 lg:h-100 w-auto object-contain drop-shadow-xl mb-4 hover:scale-105 transition-transform duration-500" />
                <p className="text-lg font-heading font-semibold text-primary leading-tight hover:text-primary-dark transition-colors">{t('about.elixirOf')}</p>
                <p className="text-lg font-heading font-semibold text-accent leading-tight hover:text-accent-dark transition-colors">{t('about.modernHealing')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-text mb-4">{t('about.valuesTitle')}</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto font-light">{t('about.valuesSubtitle')}</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: t('about.val1Title'), desc: t('about.val1Desc'), color: 'text-pink-500' },
              { icon: Shield, title: t('about.val2Title'), desc: t('about.val2Desc'), color: 'text-primary' },
              { icon: Target, title: t('about.val3Title'), desc: t('about.val3Desc'), color: 'text-amber-500' },
              { icon: Users, title: t('about.val4Title'), desc: t('about.val4Desc'), color: 'text-emerald-500' },
              { icon: Sparkles, title: t('about.val5Title'), desc: t('about.val5Desc'), color: 'text-indigo-500' },
              { icon: Award, title: t('about.val6Title'), desc: t('about.val6Desc'), color: 'text-cyan-500' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={i} variants={item} whileHover={{ y: -8 }} className="h-full">
                <Card className="p-10 h-full text-center transition-all duration-300 hover:shadow-2xl border border-border-light bg-white group rounded-3xl cursor-default">
                  <div className={`mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out flex justify-center`}>
                    <Icon className={`w-14 h-14 ${color}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-bold text-text text-xl mb-3 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-text-secondary text-base leading-relaxed">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
