import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, SearchBar } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { doctorReportsInbox } from '../../data/mockData';
import { FileCheck, AlertTriangle, CheckCircle2, Eye, Clock } from 'lucide-react';

export default function DoctorReportsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { addToast } = useToast();

  const filtered = doctorReportsInbox.filter(r => {
    const matchesSearch = r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'urgent' && r.urgent) || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleReview = (id) => {
    addToast('Report marked as reviewed.', 'success');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">Reports Inbox</h1>
        <SearchBar placeholder="Search reports..." value={search} onChange={setSearch} className="sm:w-72" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'urgent', label: '🔴 Urgent' },
          { value: 'reviewed', label: 'Reviewed' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary border border-border hover:border-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`p-6 ${report.urgent ? 'border-l-4 border-l-error' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  report.urgent ? 'bg-error/10' : report.status === 'pending' ? 'bg-accent/15' : 'bg-secondary/15'
                }`}>
                  {report.urgent ? (
                    <AlertTriangle className="w-6 h-6 text-error" />
                  ) : report.status === 'pending' ? (
                    <Clock className="w-6 h-6 text-accent" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-secondary-dark" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-text">{report.patientName}</h3>
                    {report.urgent && <Badge variant="error">Urgent</Badge>}
                    <Badge variant={report.status === 'pending' ? 'warning' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-text-muted text-sm mt-1">{report.testName} • {report.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="primary">
                    <Eye className="w-4 h-4" /> View
                  </Button>
                  {report.status === 'pending' && (
                    <Button size="sm" variant="secondary" onClick={() => handleReview(report.id)}>
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileCheck className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted">No reports match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
