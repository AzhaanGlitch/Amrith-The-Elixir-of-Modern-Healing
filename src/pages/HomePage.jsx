import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, Badge, SearchBar } from '../components/ui';
import { departments, specialties, testimonials, tests } from '../data/mockData';
import {
  Search, ArrowRight, Shield, Clock, Home, Star, ChevronLeft, ChevronRight,
  Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse, Scan,
  Microscope, Activity, Wind, Leaf, Users, Award, Zap, CheckCircle2,
  TestTubes, Smile, UserCheck, CalendarDays, FileOutput, MousePointerClick, Building2
} from 'lucide-react';

const iconMap = { Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse, Scan, Microscope, Activity, Wind, Leaf };

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

  const popularTests = tests.filter(t => t.popular);
  const visibleSpecialties = 5;
  const maxSpIndex = Math.max(0, specialties.length - visibleSpecialties);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white overflow-hidden flex items-center pt-24 pb-16"
        style={{ backgroundImage: `url('/home_page.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/50 to-transparent" />
        
        <div className="relative w-full px-6 sm:px-12 lg:px-20 xl:px-32 z-10 flex items-center justify-between">
          <div className="max-w-3xl text-left relative z-10">

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-heading font-black leading-[1.1] tracking-tight mb-8"
              >
                <span className="block text-6xl sm:text-7xl lg:text-[8rem] mb-2 uppercase tracking-widest text-white drop-shadow-lg leading-none">AMRITH</span>
                <span className="block text-3xl sm:text-4xl lg:text-[3rem] text-white/80 font-bold tracking-tight mb-1">
                  The Elixir of
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-[4.5rem] text-secondary drop-shadow-sm font-black leading-none">
                  Modern Healing
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-xl"
              >
                Book lab tests, health packages, and doctor consultations, all from the comfort of your home. 
                Quality diagnostics at transparent prices.
              </motion.p>

              {/* Hero Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="max-w-xl mb-10"
              >
                <div className="relative flex items-center w-full">
                  <Search className="absolute left-5 w-5 h-5 text-text-muted z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for tests, packages, or specialties..."
                    className="w-full py-4 lg:py-4.5 pl-14 pr-32 bg-white rounded-2xl text-text text-base shadow-xl focus:ring-4 focus:ring-secondary/30 outline-none border-0 placeholder:text-text-muted"
                    aria-label="Search for health tests and services"
                  />
                  <button
                    onClick={() => navigate('/departments')}
                    className="absolute right-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-light transition-all hidden sm:block shadow-md"
                  >
                    Search
                  </button>
                </div>
              </motion.div>

              {/* Role Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-start"
              >
                <Button
                  variant="white"
                  size="lg"
                  onClick={() => navigate('/signup?role=patient')}
                  className="group"
                >
                  <UserCheck className="w-5 h-5 text-primary" />
                  I'm a Patient
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/signup?role=doctor')}
                  className="!border-white/30 !text-white hover:!bg-white/10 group bg-white/5 backdrop-blur-sm"
                >
                  <Stethoscope className="w-5 h-5" />
                  I'm a Doctor
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        
        {/* 3D Model Absolute Container */}
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, type: 'spring', damping: 20 }}
          className="hidden lg:flex absolute -right-[60vw] xl:-right-[55vw] top-1/2 -translate-y-1/2 w-[150vw] h-[150vh] pointer-events-none z-0"
        >
          <model-viewer
            src="/medical_equipment.glb"
            alt="3D Medical Equipment Model"
            auto-rotate
            interaction-prompt="none"
            shadow-intensity="1"
            exposure="1.2"
            autoplay
            style={{ width: '100%', height: '100%', outline: 'none' }}
            camera-orbit="0deg 75deg 85%"
          >
            <div slot="poster" className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent flex items-center justify-center rounded-full animate-spin opacity-30" />
            </div>
          </model-viewer>
        </motion.div>
      </section>

      {/* Featured Specialties Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-text mb-3">Explore Specialties</h2>
            <p className="text-text-muted text-lg">Browse healthcare services across medical disciplines</p>
          </div>

          <div className="relative w-full overflow-hidden py-4 px-4 -mx-4 sm:px-0 sm:mx-0" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            >
              {[...specialties, ...specialties].map((spec, i) => {
                const Icon = iconMap[spec.icon] || Heart;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className={`flex-shrink-0 w-52 bg-gradient-to-br ${spec.gradient} rounded-2xl p-6 text-white cursor-pointer shadow-lg`}
                    onClick={() => navigate('/departments')}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-semibold text-sm leading-tight">{spec.name}</h3>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Tests */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-text mb-3">Popular Tests</h2>
              <p className="text-text-muted text-lg">Most booked health tests by our patients</p>
            </div>
            <Link to="/departments" className="hidden sm:flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {popularTests.slice(0, 8).map(test => (
              <motion.div key={test.id} variants={item}>
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={test.homeCollection ? 'secondary' : 'primary'}>
                      {test.homeCollection ? (
                        <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Home</span>
                      ) : (
                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Lab</span>
                      )}
                    </Badge>
                    {test.fasting && <Badge variant="warning">Fasting</Badge>}
                  </div>
                  <h3 className="font-heading font-semibold text-text mb-2 line-clamp-2">{test.name}</h3>
                  <p className="text-text-muted text-xs mb-4 line-clamp-2 flex-1">{test.description}</p>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <span className="text-xl font-heading font-bold text-primary">₹{test.price}</span>
                      <span className="text-sm text-text-muted line-through ml-2">₹{test.originalPrice}</span>
                    </div>
                    <span className="text-xs text-secondary-dark font-semibold bg-secondary/10 px-2 py-1 rounded-lg">
                      {Math.round((1 - test.price / test.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    Report in {test.reportTime}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Badges / Why Amrith */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-text mb-3">Why Choose Amrith?</h2>
            <p className="text-text-muted text-lg">Setting new standards in healthcare quality</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Shield, title: 'NABL Accredited Labs', desc: 'All tests processed in certified, quality-assured laboratories.', color: 'from-primary to-primary-light' },
              { icon: Home, title: 'Free Home Collection', desc: 'Trained phlebotomists at your doorstep at your preferred time.', color: 'from-secondary to-secondary-dark' },
              { icon: Zap, title: 'Quick Digital Reports', desc: 'Get accurate results delivered digitally within hours, not days.', color: 'from-accent to-accent-dark' },
              { icon: Award, title: 'Best Price Guarantee', desc: 'Up to 60% savings on lab tests compared to direct walk-ins.', color: 'from-purple-500 to-indigo-600' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={i} variants={item}>
                <Card className="p-8 text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-text mb-2">{title}</h3>
                  <p className="text-text-muted text-sm">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-background to-background-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-text mb-3">How It Works</h2>
            <p className="text-text-muted text-lg">Simple, hassle-free healthcare in 4 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />
            
            {[
              { step: '01', title: 'Choose a Test', desc: 'Browse 200+ tests and health packages.', icon: <Search className="w-8 h-8 text-primary" /> },
              { step: '02', title: 'Book & Pay', desc: 'Pick your slot and pay securely online.', icon: <CalendarDays className="w-8 h-8 text-secondary-dark" /> },
              { step: '03', title: 'Sample Collection', desc: 'At home or visit our nearest center.', icon: <Home className="w-8 h-8 text-accent" /> },
              { step: '04', title: 'Get Reports', desc: 'Digital reports with AI health insights.', icon: <FileOutput className="w-8 h-8 text-indigo-500" /> },
            ].map(({ step, title, desc, icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative z-10"
              >
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-5 border border-border-light">
                  {icon}
                </div>
                <span className="text-xs font-bold text-accent tracking-widest uppercase">Step {step}</span>
                <h3 className="font-heading font-bold text-text mt-2 mb-2">{title}</h3>
                <p className="text-text-muted text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-text mb-3">What Our Users Say</h2>
            <p className="text-text-muted text-lg">Real feedback from patients and doctors</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.id} variants={item}>
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-accent fill-accent' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light text-white text-xs font-semibold flex items-center justify-center">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
            Ready to Take Charge of Your Health?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Join 50,000+ patients who trust Amrith for their healthcare needs. 
            Book your first test today and experience premium healthcare reimagined.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="white" size="xl" onClick={() => navigate('/signup')}>
              <CheckCircle2 className="w-5 h-5" />
              Get Started Free
            </Button>
            <Button variant="outline" size="xl" className="!border-white/30 !text-white hover:!bg-white/10" onClick={() => navigate('/departments')}>
              Browse Tests
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
