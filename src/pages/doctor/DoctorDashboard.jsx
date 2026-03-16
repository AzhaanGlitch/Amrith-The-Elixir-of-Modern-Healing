import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Card, StatCard, Badge } from '../../components/ui';
import { doctorAppointments, doctorReportsInbox } from '../../data/mockData';
import {
  Users, Calendar, FileCheck, Clock, AlertTriangle, ArrowRight,
  CheckCircle2, Timer, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const statusColors = {
  waiting: { bg: 'bg-accent/15', text: 'text-accent-dark', label: 'Waiting' },
  'in-progress': { bg: 'bg-primary/10', text: 'text-primary', label: 'In Progress' },
  scheduled: { bg: 'bg-border-light', text: 'text-text-muted', label: 'Scheduled' },
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const pendingReports = doctorReportsInbox.filter(r => r.status === 'pending');
  const urgentReports = pendingReports.filter(r => r.urgent);

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text">
          Good afternoon, <span className="text-primary">{user?.name?.split(' ').slice(0, 2).join(' ')} 👋</span>
        </h1>
        <p className="text-text-muted mt-1">{user?.specialization} • Here's your day at a glance.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div variants={item}>
          <StatCard label="Today's Patients" value={doctorAppointments.length} icon={Users} color="primary" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="Pending Reports" value={pendingReports.length} icon={FileCheck} color="accent" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="This Week" value="23" icon={Calendar} color="secondary" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="Patients Seen" value="156" icon={UserCheck} color="primary" trend={12} />
        </motion.div>
      </motion.div>

      {/* Urgent Alert */}
      {urgentReports.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card className="p-4 bg-error/5 border border-error/20">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-semibold text-error">{urgentReports.length} urgent report(s) need review</span>
                <span className="text-xs text-text-muted ml-2">
                  {urgentReports.map(r => r.patientName).join(', ')}
                </span>
              </div>
              <Link to="/doctor/reports" className="text-error text-sm font-semibold hover:underline">
                Review Now →
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-text text-lg">Today's Schedule</h2>
              <Link to="/doctor/schedule" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Full Schedule <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {doctorAppointments.map((appt, i) => {
                const status = statusColors[appt.status];
                return (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      appt.status === 'in-progress' ? 'border-primary/30 bg-primary/5' : 'border-border-light bg-background hover:border-primary/20'
                    }`}
                  >
                    <div className="text-center flex-shrink-0 w-16">
                      <p className="text-sm font-bold text-primary">{appt.time}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-text text-sm truncate">{appt.patientName}</p>
                        <span className="text-xs text-text-muted">• {appt.age} yrs</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{appt.type} • {appt.notes}</p>
                    </div>
                    <Badge className={`${status.bg} ${status.text}`}>{status.label}</Badge>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reports Inbox Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-text">Reports Inbox</h3>
              <Link to="/doctor/reports" className="text-primary text-xs font-semibold hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {doctorReportsInbox.slice(0, 3).map(report => (
                <div key={report.id} className="flex items-start gap-3 p-3 bg-background rounded-xl">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${report.urgent ? 'bg-error' : 'bg-accent'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">{report.patientName}</p>
                    <p className="text-xs text-text-muted truncate">{report.testName}</p>
                  </div>
                  <Badge variant={report.status === 'pending' ? 'warning' : 'secondary'} className="ml-auto flex-shrink-0">
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
            <h3 className="font-heading font-semibold text-text mb-4">Today's Summary</h3>
            <div className="space-y-3">
              {[
                { icon: CheckCircle2, label: 'Completed', value: '1', color: 'text-secondary-dark' },
                { icon: Timer, label: 'In Progress', value: '1', color: 'text-primary' },
                { icon: Clock, label: 'Remaining', value: '3', color: 'text-accent' },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-text-secondary">
                    <Icon className={`w-4 h-4 ${color}`} /> {label}
                  </span>
                  <span className="font-bold text-text">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
