import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge } from '../components/ui';
import {
  HeartPulse, Scan, Microscope, Activity, Star, Send, Shield, Zap, Award, CheckCircle2,
  Bone, Eye, Brain, TestTubes, Search, UserCheck, Stethoscope, ArrowRight, Home
} from 'lucide-react';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function HomePage() {
  const navigate = useNavigate();

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

  const virtualFacilities = [
    { title: 'Cardiovascular Health', desc: 'Leading cause of concern; evaluate heart risks through vitals screening and BP analysis.', icon: HeartPulse, color: 'text-rose-500' },
    { title: 'Blood Report Analyzer', desc: 'Scan Complete Blood Counts (CBC), glucose, and lipid profiles for instant AI medical insights.', icon: TestTubes, color: 'text-orange-500' },
    { title: 'Tuberculosis & Lungs', desc: 'Detect TB, COPD, and other pulmonary anomalies through automated chest X-Ray analysis.', icon: Scan, color: 'text-blue-600' },
    { title: 'Retinal & Eye Disease', desc: 'Early detection for glaucoma, cataracts, and diabetic retinopathy via optical scan analysis.', icon: Eye, color: 'text-teal-500' },
    { title: 'Bone Health & Density', desc: 'Screen for osteoporosis and skeletal fractures using deep learning on X-Ray imaging.', icon: Bone, color: 'text-slate-600' },
    { title: 'Skin Disease Detection', desc: 'Assess risks for melanoma and common infectious skin conditions from dermatological images.', icon: Microscope, color: 'text-purple-500' },
    { title: 'Brain & Neurology', desc: 'Screening for neurological anomalies, stroke risks, and tumors in CT/MRI scan data.', icon: Brain, color: 'text-indigo-600' },
    { title: 'General Pathology', desc: 'A broad AI evaluation for common pathology symptoms and digital preliminary diagnosis.', icon: Activity, color: 'text-yellow-600' },
  ];

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
                <span className="block text-6xl sm:text-8xl lg:text-[9.5rem] mb-4 uppercase tracking-[0.1em] text-[#b085f5] drop-shadow-lg leading-none">AMRITH</span>
                <span className="block text-xl sm:text-2xl lg:text-[1.6rem] text-[#5b3b98] font-bold tracking-widest pl-2">
                  THE ELIXIR OF MODERN HEALING
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-base sm:text-lg text-[#5b3b98] mb-12 leading-relaxed max-w-xl mx-auto font-medium"
              >
                Access a complete AI-powered virtual hospital and doctor consultations,<br className="hidden sm:block" /> 
                all from the comfort of your home. Quality, instantaneous healthcare<br className="hidden sm:block" /> 
                completely free of cost.
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
                  className="!border-white/40 !text-white hover:!bg-purple-500/20 group bg-black/20 backdrop-blur-sm rounded-full px-8 py-3.5 shadow-md flex items-center text-sm font-semibold tracking-wide"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  I'm a Patient
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/signup?role=doctor')}
                  className="!border-white/40 !text-white hover:!bg-purple-500/20 group bg-black/20 backdrop-blur-sm rounded-full px-8 py-3.5 shadow-md flex items-center text-sm font-semibold tracking-wide"
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  I'm a Doctor
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
      </section>

      {/* AI Virtual Facilities Listing */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4 text-sm font-bold uppercase tracking-wider px-4 py-1.5">Free Virtual Facilities</Badge>
            <h2 className="text-4xl lg:text-5xl font-heading font-black text-text mb-4">Explore Our Amrith Services</h2>
            <p className="text-text-muted text-xl max-w-2xl mx-auto">Discover a vast array of specialized detection models. Login to securely upload scans and receive instantaneous results.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {virtualFacilities.map((facility, i) => {
              const Icon = facility.icon;
              return (
                <motion.div key={i} variants={item} className="h-full">
                  <Card className="group p-8 h-full flex flex-col items-center text-center transform transition-all hover:scale-[1.05] hover:shadow-2xl cursor-pointer border-none bg-white shadow-lg" onClick={() => navigate('/signup?role=patient')}>
                    <Icon className={`w-14 h-14 ${facility.color} mb-6 group-hover:scale-125 transition-all duration-300 drop-shadow-sm`} />
                    <h3 className="text-xl font-heading font-bold text-text mb-3 line-clamp-2">{facility.title}</h3>
                    <p className="text-text-muted text-sm flex-1 leading-relaxed">{facility.desc}</p>
                    <div className="mt-6 flex items-center text-primary text-sm font-black opacity-0 group-hover:opacity-100 transition-all">
                      Access Amrith Tool <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trust Badges / Why Amrith Virtual Hospital */}
      <section className="py-24 bg-gradient-to-br from-background to-background-alt border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-black text-text mb-4">Why Choose Amrith?</h2>
            <p className="text-text-muted text-xl">Pioneering accessible, digital-first healthcare for everyone.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Activity, title: 'Instant Inference', desc: 'No waiting for days. Get your preliminary analysis in seconds.', color: 'from-primary to-primary-light' },
              { icon: Shield, title: 'Privacy First', desc: 'Your medical data is encrypted and immediately discarded after analysis.', color: 'from-secondary to-secondary-dark' },
              { icon: Award, title: 'Completely Free', desc: 'Our AI programs are entirely free of cost for early adopters.', color: 'from-accent to-accent-dark' },
              { icon: Home, title: 'Hospital at Home', desc: 'Get diagnostic insights without ever leaving your living room.', color: 'from-purple-500 to-indigo-600' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={i} variants={item}>
                <Card className="p-8 text-center h-full border-none shadow-xl bg-white/50 backdrop-blur-xl">
                  <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
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
            <h2 className="text-3xl lg:text-5xl font-heading font-black text-text mb-4">Community Feedback</h2>
            <p className="text-text-muted text-xl">Help us improve by leaving your honest thoughts about our AI diagnostic tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Feedback Form */}
            <div className="md:col-span-5">
              <Card className="p-8 shadow-2xl border-primary/20 bg-gradient-to-br from-white to-primary/5">
                <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-accent fill-accent" /> Leave a Review
                </h3>
                <form onSubmit={submitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Rating</label>
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
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoverRating || newReview.rating) 
                                ? 'text-accent fill-accent' 
                                : 'text-border group-hover:text-accent/50'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Comment</label>
                    <textarea 
                      required
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-32"
                      placeholder="How accurate was the AI diagnosis? Did it help you?"
                    />
                  </div>
                  <Button type="submit" className="w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> Submit Feedback
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
                  <h4 className="text-xl font-bold text-text mb-2">No feedback yet</h4>
                  <p className="text-text-muted">Be the first to share your experience with the Amrith Virtual Hospital beta!</p>
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-white/50 mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-heading font-black mb-6">
            Step Into the Future of Healing
          </h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            The Amrith Virtual Hospital is accessible to everyone, anywhere, at zero cost. Join today and let our AI models give you peace of mind instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="white" size="xl" onClick={() => navigate('/signup')} className="rounded-full shadow-2xl px-8 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Sign Up For Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
