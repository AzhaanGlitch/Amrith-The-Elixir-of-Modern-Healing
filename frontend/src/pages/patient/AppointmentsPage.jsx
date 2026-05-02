import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, EmptyState } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { appointments } from '../../data/mockData';
import { Calendar, Clock, MapPin, X, RefreshCw, CalendarX } from 'lucide-react';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { addToast } = useToast();
  const tabs = ['upcoming', 'completed', 'cancelled'];

  const filtered = appointments.filter(a => a.status === activeTab);

  const handleCancel = (id) => {
    addToast('Appointment cancelled successfully.', 'warning');
  };

  const handleReschedule = (id) => {
    addToast('Reschedule feature coming soon!', 'info');
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text mb-6">My Appointments</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-background rounded-xl p-1 mb-8 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((appt, i) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    activeTab === 'upcoming' ? 'bg-primary/10' :
                    activeTab === 'completed' ? 'bg-secondary/15' : 'bg-gray-100'
                  }`}>
                    <Calendar className={`w-6 h-6 ${
                      activeTab === 'upcoming' ? 'text-primary' :
                      activeTab === 'completed' ? 'text-secondary-dark' : 'text-text-muted'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-text">{appt.testName}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-text-muted">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {appt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {appt.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {appt.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={appt.type === 'Package' ? 'accent' : 'primary'}>{appt.type}</Badge>
                    <span className="font-bold text-primary">₹{appt.price}</span>
                  </div>
                </div>
                {activeTab === 'upcoming' && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-border-light">
                    <Button size="sm" variant="outline" onClick={() => handleReschedule(appt.id)}>
                      <RefreshCw className="w-4 h-4" /> Reschedule
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleCancel(appt.id)}>
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarX}
          title={`No ${activeTab} appointments`}
          description={activeTab === 'upcoming' ? 'Book a test to get started!' : `Your ${activeTab} appointments will appear here.`}
        />
      )}
    </div>
  );
}
