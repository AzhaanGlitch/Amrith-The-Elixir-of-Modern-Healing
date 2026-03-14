import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Card, StatCard, Badge } from '../../components/ui';
import { appointments, reports } from '../../data/mockData';
import {
  TestTubes, Calendar, FileText, User, Building2, ArrowRight,
  Stethoscope, Bell, Heart, TrendingUp, Clock
} from 'lucide-react';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function PatientDashboard() {
  const { user } = useAuth();
  const upcomingAppts = appointments.filter(a => a.status === 'upcoming');
  const recentReports = reports.slice(0, 3);

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text">
          Good afternoon, <span className="text-primary">{user?.name?.split(' ')[0]} 👋</span>
        </h1>
        <p className="text-text-muted mt-1">Here's your health overview. Stay proactive about your well-being!</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div variants={item}>
          <StatCard label="Upcoming Tests" value={upcomingAppts.length} icon={Calendar} color="primary" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="Total Reports" value={reports.length} icon={FileText} color="secondary" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="Health Score" value="85/100" icon={Heart} color="primary" trend={5} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="Savings" value="₹3,200" icon={TrendingUp} color="accent" />
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Book a Test', icon: TestTubes, path: '/patient/book', gradient: 'from-primary to-primary-light' },
          { label: 'Consultation', icon: Stethoscope, path: '/patient/book', gradient: 'from-secondary to-emerald-500' },
          { label: 'View Reports', icon: FileText, path: '/patient/reports', gradient: 'from-accent to-amber-500' },
          { label: 'Appointments', icon: Calendar, path: '/patient/appointments', gradient: 'from-purple-500 to-indigo-500' },
        ].map(({ label, icon: Icon, path, gradient }, i) => (
          <motion.div key={i} variants={item}>
            <Link to={path}>
              <Card className="p-5 group cursor-pointer">
                <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-text text-sm">{label}</span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-text text-lg">Upcoming Appointments</h2>
              <Link to="/patient/appointments" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {upcomingAppts.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppts.map(appt => (
                  <div key={appt.id} className="flex items-center gap-4 p-4 bg-background rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text text-sm truncate">{appt.testName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">{appt.date}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{appt.time}</span>
                      </div>
                    </div>
                    <Badge variant="primary">{appt.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm text-center py-8">No upcoming appointments</p>
            )}
          </Card>
        </motion.div>

        {/* Recent Reports */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-text text-lg">Recent Reports</h2>
              <Link to="/patient/reports" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentReports.map(report => (
                <div key={report.id} className="flex items-center gap-4 p-4 bg-background rounded-xl">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    report.status === 'normal' ? 'bg-secondary/15' : 'bg-accent/15'
                  }`}>
                    <FileText className={`w-5 h-5 ${report.status === 'normal' ? 'text-secondary-dark' : 'text-accent'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text text-sm truncate">{report.testName}</p>
                    <p className="text-xs text-text-muted mt-0.5">{report.date} • {report.doctor}</p>
                  </div>
                  <Badge variant={report.status === 'normal' ? 'secondary' : 'warning'}>
                    {report.status === 'normal' ? '✓ Normal' : '⚠ Attention'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Health Reminders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-text">Health Reminder</h3>
              <p className="text-text-muted text-sm mt-1">
                Your Thyroid report showed slightly elevated TSH (5.8 mIU/L). Consider a follow-up test in 6 weeks. 
                <Link to="/patient/book" className="text-primary font-semibold ml-1 hover:underline">Book Follow-up →</Link>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
