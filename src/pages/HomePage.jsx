import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge } from '../components/ui';
import { departments } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import {
  HeartPulse, Scan, Microscope, Activity, Star, Send, Shield, Zap, Award, CheckCircle2,
  Bone, Eye, Brain, TestTubes, Search, UserCheck, Stethoscope, ArrowRight, Home,
  Wind, Sparkles, Upload, FileText, ClipboardList
} from 'lucide-react';
import NewsSection from '../components/NewsSection';

const iconMap = { HeartPulse, Scan, Microscope, Activity, Bone, Eye, Brain, Stethoscope, Wind, Sparkles };

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const departmentColors = {
  1: 'text-amber-500',    // Dermatology
  2: 'text-teal-500',     // Pulmonology
  3: 'text-blue-500',     // Ophthalmology
  4: 'text-rose-500',     // Oncology
  5: 'text-orange-500',   // Orthopedics
  6: 'text-emerald-600',  // General Medicine
  7: 'text-red-500',      // Cardiovascular
  8: 'text-purple-500',   // Neurology
};

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Reviews state (frontend only)
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    setReviews([{ ...newReview, id: Date.now(), date: new Date().toLocaleDateString() }, ...reviews]);
    setNewReview({ name: '', rating: 5, comment: '' });
  };

  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Section */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white overflow-hidden flex items-center pt-24 pb-16"
        style={{ backgroundImage: `url('/home_page.png')` }}
      >

        <div className="relative w-full px-6 sm:px-12 lg:px-20 xl:px-32 z-10 flex items-center justify-center">
          <div className="max-w-3xl text-center relative z-10 flex flex-col items-center">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-black leading-tight mb-8"
            >
              <span className="block text-6xl sm:text-8xl lg:text-[9.5rem] mb-4 uppercase tracking-[0.1em] text-[#b085f5] drop-shadow-lg leading-none">{t('home.heroTitle')}</span>
              <span className="block text-xl sm:text-2xl lg:text-[1.6rem] text-[#5b3b98] font-bold tracking-widest pl-2">
                {t('home.heroSubtitle')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[#5b3b98] mb-12 leading-relaxed max-w-xl mx-auto font-medium"
            >
              {t('home.heroDesc')}
            </motion.p>

            {/* Role Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                variant="outline"
                onClick={() => navigate('/signup?role=patient')}
                className="!border-white/40 !text-white hover:!bg-purple-500/20 group bg-black/20 backdrop-blur-sm rounded-md px-8 py-3.5 shadow-md flex items-center text-sm font-semibold tracking-wide"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                {t('home.imPatient')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/signup?role=doctor')}
                className="!border-white/40 !text-white hover:!bg-purple-500/20 group bg-black/20 backdrop-blur-sm rounded-md px-8 py-3.5 shadow-md flex items-center text-sm font-semibold tracking-wide"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                {t('home.imDoctor')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <NewsSection />

      {/* AI Virtual Facilities / Departments Listing */}
      {/* AI Virtual Facilities / Departments Listing */}
      <section className="py-24 bg-gradient-to-br from-background to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-black text-text mb-4">{t('home.exploreTitle')}</h2>
            <p className="text-text-muted text-xl max-w-3xl">{t('home.exploreDesc1')} {departments.reduce((acc, d) => acc + d.diseases.length, 0)}+ {t('home.exploreDesc2')} {departments.length} {t('home.exploreDesc3')}</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left side: Space for 3-4 images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 mb-12 lg:mb-0 pb-16">
              <div className="flex flex-col gap-4">
                <div className="aspect-[4/5] rounded-md overflow-hidden shadow-lg border border-border-light bg-gray-100 relative group">
                  <img src="/services/1.jpg" alt="Amrith Service 1" onError={(e) => { e.target.style.display = 'none'; }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="aspect-square rounded-md overflow-hidden shadow-lg border border-border-light bg-gray-100 relative group">
                  <img src="/services/2.jpg" alt="Amrith Service 2" onError={(e) => { e.target.style.display = 'none'; }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-12">
                <div className="aspect-square rounded-md overflow-hidden shadow-lg border border-border-light bg-gray-100 relative group">
                  <img src="/services/3.jpg" alt="Amrith Service 3" onError={(e) => { e.target.style.display = 'none'; }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="aspect-[4/5] rounded-md overflow-hidden shadow-lg border border-border-light bg-gray-100 relative group">
                  <img src="/services/4.webp" alt="Amrith Service 4" onError={(e) => { e.target.style.display = 'none'; }} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Right side: Elongated tiles of services */}
            <div className="lg:col-span-7">
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
              >
                {departments.map((dept) => {
                  const Icon = iconMap[dept.icon] || Stethoscope;
                  const colorClass = departmentColors[dept.id] || 'text-primary';
                  return (
                    <motion.div key={dept.id} variants={item}>
                      <Card className="group p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 cursor-pointer border border-border-light bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all" onClick={() => navigate(`/departments/${dept.id}`)}>
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-bold text-text mb-1.5 group-hover:text-primary transition-colors">{dept.name}</h3>
                          <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">{dept.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-primary/10 border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-black text-text mb-4">How Amrith AI Works</h2>
            <p className="text-text-muted text-xl">Follow these simple steps to get your AI-powered health analysis</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
            {/* Left side: Steps */}
            <div>
              <h3 className="text-2xl font-heading font-bold text-text mb-6">Steps</h3>
              <div className="flex flex-col gap-3">
                {[
                  'Visit the website',
                  'Search or choose which disease you want to check',
                  'Login as patient to proceed further',
                  'Give some basic answers of the questions asked on symptoms',
                  'Upload your respected data in the form of images or reports',
                  'Wait for our trained ml model to analyze',
                  'Get your results in few miniutes',
                  'If you logged in as a doctor, monitor all your patients and deal accordingly with our doctors dashboard'
                ].map((stepText, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-border-light rounded-md p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <span className="font-heading font-black text-primary/40 text-xl w-6 shrink-0">{i + 1}.</span>
                    <p className="text-text-secondary text-sm font-medium">{stepText}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Video placeholder */}
            <div className="w-full aspect-video bg-black/5 rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-16 h-16 rounded-md bg-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                   <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                 </div>
              </div>
              <p className="font-semibold text-lg z-10 group-hover:opacity-0 transition-opacity">Video Demo Area</p>
              <p className="text-sm z-10 group-hover:opacity-0 transition-opacity">(Video will be added here later)</p>
            </div>
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

            {/* Right side: PDF placeholder */}
            <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] bg-primary/5 rounded-md border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary/60 relative overflow-hidden group">
              <FileText className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform duration-300" />
              <p className="font-semibold text-lg">Sample PDF Report</p>
              <p className="text-sm">(PDF document will be embedded here)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Why Amrith Virtual Hospital */}
      <section className="py-24 bg-gradient-to-br from-background to-background-alt border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-black text-text mb-4">{t('home.whyTitle')}</h2>
            <p className="text-text-muted text-xl">{t('home.whySubtitle')}</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Activity, title: t('home.whyTitle1'), desc: t('home.whyDesc1'), iconColor: 'text-purple-500' },
              { icon: Shield, title: t('home.whyTitle2'), desc: t('home.whyDesc2'), iconColor: 'text-blue-500' },
              { icon: Award, title: t('home.whyTitle3'), desc: t('home.whyDesc3'), iconColor: 'text-amber-500' },
              { icon: Home, title: t('home.whyTitle4'), desc: t('home.whyDesc4'), iconColor: 'text-indigo-500' },
            ].map(({ icon: Icon, title, desc, iconColor }, i) => (
              <motion.div key={i} variants={item}>
                <Card className="p-8 text-center h-full border-none shadow-xl bg-white/50 backdrop-blur-xl">
                  <Icon className={`w-14 h-14 ${iconColor} mx-auto mb-6 drop-shadow-sm`} />
                  <h3 className="font-heading font-bold text-xl text-text mb-3">{title}</h3>
                  <p className="text-text-muted text-sm">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Community Feedback */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-black text-text mb-4">{t('home.feedbackTitle')}</h2>
            <p className="text-text-muted text-xl">{t('home.feedbackSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Feedback Form */}
            <div className="md:col-span-5">
              <Card className="p-8 shadow-2xl border-primary/20 bg-gradient-to-br from-white to-primary/5">
                <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-accent fill-accent" /> {t('home.leaveReview')}
                </h3>
                <form onSubmit={submitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">{t('home.yourName')}</label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder={t('home.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">{t('home.rating')}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${star <= (hoverRating || newReview.rating)
                                ? 'text-accent fill-accent'
                                : 'text-border group-hover:text-accent/50'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">{t('home.comment')}</label>
                    <textarea
                      required
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-32"
                      placeholder={t('home.commentPlaceholder')}
                    />
                  </div>
                  <Button type="submit" className="w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> {t('home.submitFeedback')}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Display Reviews */}
            <div className="md:col-span-7 flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-background rounded-3xl border border-dashed border-border-light">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Send className="w-8 h-8 text-border-dark" />
                  </div>
                  <h4 className="text-xl font-bold text-text mb-2">{t('home.noFeedback')}</h4>
                  <p className="text-text-muted">{t('home.noFeedbackDesc')}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-border-light flex gap-5"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-light text-white font-bold flex items-center justify-center text-lg mt-1 shadow-inner">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-text text-lg">{review.name}</h4>
                          <span className="text-xs text-text-muted font-medium">{review.date}</span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-text-secondary leading-relaxed">{review.comment}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
