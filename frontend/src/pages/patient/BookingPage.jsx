import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { departments, timeSlots } from '../../data/mockData';
import { testConfigs } from '../../data/testConfig';
import ImageUploadForm from '../../components/forms/ImageUploadForm';
import SymptomQuestionnaire from '../../components/forms/SymptomQuestionnaire';
import AITriageResult from '../../components/forms/AITriageResult';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Home, Building2,
  User, MapPin, Calendar, Search, Stethoscope, AlertCircle, 
  ChevronRight, Activity
} from 'lucide-react';

const iconMap = { Stethoscope, Activity };

const STEPS = ['Select Test', 'AI Assessment', 'Triage Result', 'Schedule', 'Confirmation'];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTestId = searchParams.get('testId');

  const [selectedTestId, setSelectedTestId] = useState(initialTestId || null);
  const [answers, setAnswers] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [collectionType, setCollectionType] = useState('home');
  const [patientFor, setPatientFor] = useState('self');
  const [patientData, setPatientData] = useState({ name: '', age: '', gender: '', relation: '' });
  const [confirmed, setConfirmed] = useState(false);
  const { addToast } = useToast();
  const [search, setSearch] = useState('');

  const allTests = useMemo(() => departments.flatMap(d => 
    d.diseases.map(disease => ({
      ...disease,
      departmentId: d.id,
      departmentName: d.name,
      config: testConfigs[disease.id] || { inputType: 'TABULAR', questions: [] }
    }))
  ), []);

  const selectedTest = useMemo(() => 
    allTests.find(t => t.id === selectedTestId), 
    [selectedTestId, allTests]
  );

  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const handleConfirm = () => {
    setConfirmed(true);
    addToast('Appointment scheduled successfully! 🎉', 'success');
  };

  const handleReset = () => {
    setConfirmed(false);
    setStep(0);
    setSelectedTestId(null);
    setAnswers({});
    setUploadedFiles([]);
    setSelectedDate('');
    setSelectedTime('');
    setPatientData({ name: '', age: '', gender: '', relation: '' });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-16">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-text mb-3">Booking Confirmed!</h1>
        <p className="text-text-muted mb-8">Your AI-triaged appointment has been successfully scheduled. Our team will contact you shortly.</p>
        <Card className="p-6 text-left mb-8 border-none shadow-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border-light pb-2">
              <span className="text-text-muted text-sm font-medium">Condition</span>
              <span className="font-bold text-text">{selectedTest?.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border-light pb-2">
              <span className="text-text-muted text-sm font-medium">Patient</span>
              <span className="font-bold text-text capitalize">{patientFor === 'self' ? 'Myself' : patientData.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border-light pb-2">
              <span className="text-text-muted text-sm font-medium">Schedule</span>
              <span className="font-bold text-text">{selectedDate} at {selectedTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm font-medium">Type</span>
              <span className="font-bold text-primary capitalize">{collectionType} Collection</span>
            </div>
          </div>
        </Card>
        <Button onClick={handleReset}>
          Book Another Screening
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-black text-text mb-2">AI Diagnostic Portal</h1>
        <p className="text-text-muted">Precision medical screening powered by advanced ML models.</p>
      </div>

      {/* Sleek Step Progress - Redesigned to fit without scrolling */}
      <div className="relative mb-16 px-2 sm:px-6">
        {/* Background Line */}
        <div className="absolute top-5 left-10 right-10 h-[2px] bg-gray-100 z-0" />
        
        {/* Progress Line Animation */}
        <motion.div 
          className="absolute top-5 left-10 h-[2px] bg-primary z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / (STEPS.length - 1)) * 92}%` }} // Approx width to align with dots
        />

        <div className="flex justify-between relative z-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2 ${
                i <= step 
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-110' 
                  : 'bg-white border-gray-100 text-text-muted'
              }`}>
                {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <div className="mt-3 text-center">
                <p className={`text-[9px] font-bold uppercase tracking-tighter mb-0.5 ${i <= step ? 'text-primary' : 'text-text-muted'}`}>
                  Step {i + 1}
                </p>
                <p className={`text-[11px] font-bold sm:text-xs leading-tight max-w-[80px] mx-auto ${i <= step ? 'text-text' : 'text-text-muted opacity-40'}`}>
                  {s}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Select Test */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-xl font-heading font-bold text-text">Choose a Medical Test</h2>
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search diseases or depts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-md text-sm focus:border-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-12">
              {departments.map((dept) => {
                const filteredDiseases = dept.diseases.filter(d => 
                  d.name.toLowerCase().includes(search.toLowerCase()) ||
                  dept.name.toLowerCase().includes(search.toLowerCase())
                );
                if (filteredDiseases.length === 0) return null;

                return (
                  <div key={dept.id}>
                    <h3 className="font-heading font-bold text-text text-xl mb-6 border-l-4 border-primary pl-4">{dept.name}</h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      {filteredDiseases.map(test => (
                        <Card
                          key={test.id}
                          className={`p-6 cursor-pointer transition-all border-none shadow-md hover:shadow-lg ${
                            selectedTestId === test.id ? 'ring-2 ring-primary bg-primary/5' : 'bg-white'
                          }`}
                          onClick={() => { setSelectedTestId(test.id); handleNext(); }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-text">{test.name}</h4>
                            {selectedTestId === test.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-text-muted text-xs mb-5 line-clamp-2 leading-relaxed">{test.description}</p>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="rounded-md px-2 py-1 bg-primary/10 text-primary border-0 font-bold">
                              {testConfigs[test.id]?.inputType || 'IMAGE'}
                            </Badge>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Instant Result
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>


          </motion.div>
        )}

        {/* Step 1: AI Assessment */}
        {step === 1 && selectedTest && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="p-8 border-none shadow-xl bg-white mb-8">
              {selectedTest.config.inputType === 'IMAGE' && (
                <ImageUploadForm onUpload={setUploadedFiles} />
              )}
              {selectedTest.config.inputType === 'TABULAR' && (
                <SymptomQuestionnaire 
                  questions={selectedTest.config.questions} 
                  answers={answers} 
                  onChange={(id, val) => setAnswers(prev => ({ ...prev, [id]: val }))} 
                />
              )}
              {selectedTest.config.inputType === 'HYBRID' && (
                <div className="space-y-12">
                  <ImageUploadForm onUpload={setUploadedFiles} />
                  <div className="h-px bg-border" />
                  <SymptomQuestionnaire 
                    questions={selectedTest.config.questions} 
                    answers={answers} 
                    onChange={(id, val) => setAnswers(prev => ({ ...prev, [id]: val }))} 
                  />
                </div>
              )}
            </Card>
            <div className="flex gap-4">
              <Button variant="outline" size="lg" className="flex-1" onClick={handleBack}>Back</Button>
              <Button size="lg" className="flex-1" onClick={handleNext}>Process AI Analysis</Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: AI Result */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AITriageResult onProceed={handleNext} onReset={handleReset} />
            <div className="text-center mt-4">
              <button onClick={handleBack} className="text-sm text-text-muted hover:text-primary transition-colors">
                ← Re-evaluate Inputs
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Book Appointment */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-heading font-bold text-text mb-6">Select Schedule</h2>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {nextDates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`py-3 rounded-xl text-center border transition-all ${
                          selectedDate === date ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-text border-border'
                        }`}
                      >
                        <p className="text-[10px] font-bold opacity-70">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="text-lg font-bold">{new Date(date).getDate()}</p>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.slice(0, 9).map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedTime === time ? 'bg-primary text-white border-primary' : 'bg-white text-text border-border'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-heading font-bold text-text mb-6">Collection Preference</h2>
                  <div className="grid gap-3">
                    {[
                      { id: 'home', icon: Home, label: 'At-Home Service', desc: 'Our technician visits your location' },
                      { id: 'lab', icon: Building2, label: 'In-Person Lab', desc: 'Visit our nearest diagnostic hub' }
                    ].map(type => (
                      <Card
                        key={type.id}
                        className={`p-4 cursor-pointer transition-all ${collectionType === type.id ? 'ring-2 ring-primary bg-primary/5 border-none' : 'bg-white border-border'}`}
                        onClick={() => setCollectionType(type.id)}
                      >
                        <div className="flex items-center gap-4">
                          <type.icon className={`w-5 h-5 ${collectionType === type.id ? 'text-primary' : 'text-text-muted'}`} />
                          <div>
                            <p className="text-sm font-bold text-text">{type.label}</p>
                            <p className="text-xs text-text-muted">{type.desc}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-heading font-bold text-text mb-6">Patient Identification</h2>
                  <div className="flex gap-3 mb-6">
                    {['self', 'family'].map(type => (
                      <button
                        key={type}
                        onClick={() => setPatientFor(type)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                          patientFor === type ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-text border-border'
                        }`}
                      >
                        {type === 'self' ? 'Myself' : 'Family Member'}
                      </button>
                    ))}
                  </div>

                  {patientFor === 'family' && (
                    <Card className="p-6 space-y-4 bg-white border-border shadow-sm">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Full Name</label>
                        <input 
                          type="text" 
                          value={patientData.name}
                          onChange={e => setPatientData({...patientData, name: e.target.value})}
                          placeholder="Enter name" 
                          className="w-full py-2.5 px-4 bg-background border border-border rounded-lg text-sm" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase">Age</label>
                          <input type="number" placeholder="Years" className="w-full py-2.5 px-4 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase">Relation</label>
                          <input type="text" placeholder="e.g. Spouse" className="w-full py-2.5 px-4 bg-background border border-border rounded-lg text-sm" />
                        </div>
                      </div>
                    </Card>
                  )}

                  {collectionType === 'home' && (
                    <div className="mt-8 space-y-3">
                      <h3 className="text-sm font-bold text-text flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Service Address
                      </h3>
                      <textarea
                        rows={3}
                        className="w-full p-4 bg-white border border-border rounded-xl text-sm shadow-sm"
                        placeholder="Provide your complete pickup address..."
                        defaultValue="HSR Layout Sector 4, Bangalore, Karnataka - 560102"
                      />
                    </div>
                  )}
                </section>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <Button variant="ghost" className="flex-1" onClick={handleBack}>Modify Triage</Button>
              <Button size="lg" className="flex-[2] rounded-xl" onClick={handleNext} disabled={!selectedDate || !selectedTime}>
                Continue to Summary
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirmation Summary */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-black text-text">Final Review</h2>
                <p className="text-text-muted">Review your triaged appointment details before final confirmation.</p>
              </div>

              <Card className="p-8 border-none shadow-xl bg-white space-y-6">
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Priority Analysis</p>
                    <p className="text-lg font-bold text-text">{selectedTest?.name}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8 py-4">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Patient Details</p>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-text capitalize">{patientFor === 'self' ? 'Myself' : patientData.name}</p>
                      <p className="text-xs text-text-muted">{patientFor === 'self' ? 'Self Account Holder' : 'Family Member'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Appointment</p>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-text">{selectedDate}</p>
                      <p className="text-xs text-text-muted">{selectedTime} • {collectionType === 'home' ? 'At-Home' : 'Lab Visit'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border-light">
                  <div className="flex items-center gap-3 text-xs text-text-muted bg-gray-50 p-4 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Your AI triage data and uploaded media are securely encrypted.
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 rounded-xl h-14" onClick={handleBack}>Back</Button>
                <Button size="lg" className="flex-[2] rounded-xl h-14 text-lg" onClick={handleConfirm}>
                  Schedule Appointment
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Minimal placeholder to avoid breakage if icon doesn't exist
function ShieldCheck({ className }) {
  return <CheckCircle2 className={className} />;
}
