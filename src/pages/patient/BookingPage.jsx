import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { departments, timeSlots } from '../../data/mockData';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Home, Building2,
  User, MapPin, CreditCard, QrCode, Calendar
} from 'lucide-react';

const STEPS = ['Select Test', 'Date & Time', 'Patient Details', 'Payment'];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTestId = searchParams.get('testId');

  const [selectedTests, setSelectedTests] = useState(initialTestId ? [initialTestId] : []);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [collectionType, setCollectionType] = useState('home');
  const [patientFor, setPatientFor] = useState('self');
  const [confirmed, setConfirmed] = useState(false);
  const { addToast } = useToast();

  // Combine all diseases into tests, giving them properties so they work like tests
  const allTests = departments.flatMap(d => 
    d.diseases.map(disease => ({
      ...disease,
      departmentId: d.id,
      departmentName: d.name,
      price: 0,
      originalPrice: 1500, // mock value to show savings
      homeCollection: disease.inputs.includes('images') || disease.inputs.includes('report'),
      reportTime: 'Instant AI'
    }))
  );

  const totalPrice = selectedTests.reduce((sum, id) => {
    const t = allTests.find(x => x.id === id);
    return sum + (t?.price || 0);
  }, 0);

  const toggleTest = (id) => {
    setSelectedTests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const handleConfirm = () => {
    setConfirmed(true);
    addToast('Booking confirmed! 🎉 Check your appointments.', 'success');
  };

  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-16">
        <div className="w-24 h-24 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-secondary" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-text mb-3">Booking Confirmed!</h1>
        <p className="text-text-muted mb-8">Your appointment has been successfully booked. Check your email and SMS for details.</p>
        <Card className="p-6 text-left mb-8">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Tests</span>
              <span className="font-medium text-text">{selectedTests.length} test(s)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Date</span>
              <span className="font-medium text-text">{selectedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Time</span>
              <span className="font-medium text-text">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Collection</span>
              <span className="font-medium text-text capitalize">{collectionType}</span>
            </div>
            <div className="border-t border-border-light pt-3 flex justify-between">
              <span className="font-semibold text-text">Total Paid</span>
              <span className="font-bold text-primary text-lg">₹{totalPrice}</span>
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-32 h-32 bg-background rounded-xl flex items-center justify-center border border-border">
            <QrCode className="w-16 h-16 text-text-muted" />
          </div>
        </div>
        <p className="text-xs text-text-muted mb-6">Booking ID: AMR-2026-{Math.floor(Math.random() * 9000 + 1000)}</p>
        <Button onClick={() => { setConfirmed(false); setStep(0); setSelectedTests([]); }}>
          Book Another Test
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text mb-6">Book a Test</h1>

      {/* Step Progress */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              i <= step ? 'bg-primary text-white' : 'bg-border text-text-muted'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${i <= step ? 'text-primary' : 'text-text-muted'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Tests */}
      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-heading font-semibold text-text mb-4">Select Tests</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {allTests.map(test => {
              const isSelected = selectedTests.includes(test.id);
              return (
                <Card
                  key={test.id}
                  className={`p-5 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                  onClick={() => toggleTest(test.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text text-sm">{test.name}</h3>
                        <Badge variant="primary" className="text-[10px] py-0 px-1.5">{test.departmentName}</Badge>
                      </div>
                      <p className="text-text-muted text-xs mb-2 line-clamp-2">{test.description}</p>
                      <div className="flex gap-2">
                        <Badge variant={test.homeCollection ? 'secondary' : 'neutral'}>
                          {test.homeCollection ? 'Virtual' : 'Lab'}
                        </Badge>
                        <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {test.reportTime}</span>
                      </div>
                    </div>
                    <div className="text-right ml-2 shrink-0">
                      <p className="font-bold text-primary">{test.price === 0 ? 'Free' : `₹${test.price}`}</p>
                      {test.originalPrice > 0 && <p className="text-xs text-text-muted line-through">₹{test.originalPrice}</p>}
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-primary mt-2 ml-auto" />}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {selectedTests.length > 0 && (
            <div className="mt-6 p-4 bg-white rounded-xl border border-border-light flex items-center justify-between sticky bottom-4 shadow-lg">
              <div>
                <span className="text-sm text-text-muted">{selectedTests.length} test(s) selected</span>
                <span className="ml-3 font-bold text-primary text-lg">{totalPrice === 0 ? 'Free' : `₹${totalPrice}`}</span>
              </div>
              <Button onClick={() => setStep(1)}>
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Step 2: Date & Time */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-heading font-semibold text-text mb-4">Choose Date</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            {nextDates.map(date => {
              const d = new Date(date);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = d.getDate();
              const month = d.toLocaleDateString('en-US', { month: 'short' });
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-20 py-4 rounded-xl text-center border-2 transition-all ${
                    selectedDate === date
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-white text-text hover:border-primary'
                  }`}
                >
                  <p className="text-xs font-medium opacity-70">{dayName}</p>
                  <p className="text-xl font-bold mt-1">{dayNum}</p>
                  <p className="text-xs mt-1">{month}</p>
                </button>
              );
            })}
          </div>

          <h2 className="text-lg font-heading font-semibold text-text mb-4">Choose Time Slot</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
                  selectedTime === time
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-text-secondary hover:border-primary'
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-heading font-semibold text-text mb-4">Collection Type</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { value: 'home', icon: Home, label: 'Home Collection', desc: 'Sample pickup from your address' },
              { value: 'lab', icon: Building2, label: 'Visit Lab', desc: 'Walk in to nearest Amrith center' },
            ].map(({ value, icon: Icon, label, desc }) => (
              <Card
                key={value}
                className={`p-5 cursor-pointer ${collectionType === value ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                onClick={() => setCollectionType(value)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">{label}</p>
                    <p className="text-text-muted text-xs">{desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime}>
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Patient Details */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-heading font-semibold text-text mb-4">Patient Information</h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {['self', 'family'].map(type => (
              <Card
                key={type}
                className={`p-5 cursor-pointer ${patientFor === type ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                onClick={() => setPatientFor(type)}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-medium text-text text-sm capitalize">
                    {type === 'self' ? 'Booking for Myself' : 'Booking for Family Member'}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {patientFor === 'family' && (
            <Card className="p-6 mb-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Full Name</label>
                  <input type="text" placeholder="Family member name" className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Age</label>
                  <input type="number" placeholder="Age" className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Gender</label>
                  <select className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text focus:border-primary">
                    <option>Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Relation</label>
                  <input type="text" placeholder="e.g., Father, Spouse" className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary" />
                </div>
              </div>
            </Card>
          )}

          {collectionType === 'home' && (
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Collection Address
              </h3>
              <textarea
                rows={3}
                placeholder="Enter your complete address for home sample collection..."
                className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted resize-none focus:border-primary"
                defaultValue="42, 3rd Cross, HSR Layout, Bangalore - 560102"
              />
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>
              Continue to Payment <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Payment */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-heading font-semibold text-text mb-6">Order Summary</h2>

          <Card className="p-6 mb-6">
            <div className="space-y-3">
              {selectedTests.map(id => {
                const test = allTests.find(t => t.id === id);
                return (
                  <div key={id} className="flex justify-between items-center py-2 border-b border-border-light last:border-0">
                    <span className="text-sm text-text">{test?.name}</span>
                    <div className="text-right">
                      <span className="font-semibold text-text">{test?.price === 0 ? 'Free' : `₹${test?.price}`}</span>
                      {test?.originalPrice > 0 && <span className="text-xs text-text-muted line-through ml-2">₹{test?.originalPrice}</span>}
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between pt-3 border-t-2 border-border">
                <span className="font-bold text-text">Total</span>
                <span className="font-bold text-primary text-xl">{totalPrice === 0 ? 'Free' : `₹${totalPrice}`}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Appointment Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-text-muted">Date:</span> <span className="font-medium text-text ml-2">{selectedDate}</span></div>
              <div><span className="text-text-muted">Time:</span> <span className="font-medium text-text ml-2">{selectedTime}</span></div>
              <div><span className="text-text-muted">Type:</span> <span className="font-medium text-text ml-2 capitalize">{collectionType} Collection</span></div>
              <div><span className="text-text-muted">For:</span> <span className="font-medium text-text ml-2 capitalize">{patientFor}</span></div>
            </div>
          </Card>

          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {['UPI / GPay', 'Credit Card', 'Net Banking'].map(method => (
                <button key={method} className="py-3 px-4 bg-white rounded-xl border border-border text-sm font-medium text-text hover:border-primary transition-all">
                  {method}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-4">🔒 Payment secured by Razorpay. 100% safe & encrypted.</p>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button size="lg" onClick={handleConfirm}>
              {totalPrice === 0 ? 'Confirm Booking' : `Pay ₹${totalPrice} & Confirm`}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
