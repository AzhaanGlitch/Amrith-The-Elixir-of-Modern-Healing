import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, Button, SearchBar } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { FileCheck, AlertTriangle, CheckCircle2, Eye, Clock, X, Loader2, Download, Check } from 'lucide-react';
import { API_URL } from '../../config';

export default function DoctorReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { addToast } = useToast();

  // Modal review state
  const [selectedReport, setSelectedReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    diagnosis: '',
    recommendations: '',
    prescription: '',
    severity: 'Moderate',
    followUpDate: '',
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('amrith_token');
      if (!token) return;

      const res = await fetch(`${API_URL}/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Error fetching doctor reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleOpenReview = (report) => {
    setSelectedReport(report);
    if (report.doctorReview && report.doctorReview.reviewed) {
      setReviewForm({
        diagnosis: report.doctorReview.diagnosis || '',
        recommendations: report.doctorReview.recommendations || '',
        prescription: report.doctorReview.prescription || '',
        severity: report.doctorReview.severity || 'Moderate',
        followUpDate: report.doctorReview.followUpDate ? new Date(report.doctorReview.followUpDate).toISOString().split('T')[0] : '',
      });
    } else {
      setReviewForm({
        diagnosis: '',
        recommendations: '',
        prescription: '',
        severity: report.aiAnalysis?.riskLevel || 'Moderate',
        followUpDate: '',
      });
    }
  };

  const handleCloseReview = () => {
    setSelectedReport(null);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('amrith_token');
      const res = await fetch(`${API_URL}/reports/${selectedReport._id}/review`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm),
      });

      if (!res.ok) throw new Error('Failed to submit consultation review.');

      const data = await res.json();
      if (data.success) {
        addToast('Clinical consultation report submitted successfully! 📋', 'success');
        fetchReports(); // reload reports
        handleCloseReview();
      }
    } catch (err) {
      console.error('Review submission error:', err);
      addToast(err.message || 'Submission failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReport = async (reportId, testName) => {
    try {
      const token = localStorage.getItem('amrith_token');
      const response = await fetch(`${API_URL}/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `amrith-report-${testName.toLowerCase().replace(/\s+/g, '-')}-${reportId}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading report:', err);
    }
  };

  // Map backend reports to list item formats
  const formattedReports = reports.map(rep => {
    const isReviewed = rep.status === 'doctor-reviewed';
    const isUrgent = rep.aiAnalysis?.riskLevel === 'Critical' || rep.aiAnalysis?.riskLevel === 'High';

    return {
      ...rep,
      patientName: rep.patient?.name || 'Patient',
      patientEmail: rep.patient?.email || '',
      date: new Date(rep.createdAt).toLocaleDateString(),
      urgent: isUrgent,
      listStatus: isReviewed ? 'reviewed' : 'pending',
    };
  });

  const filtered = formattedReports.filter(r => {
    const matchesSearch = r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'urgent' && r.urgent) || 
      r.listStatus === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-text-muted text-sm font-semibold">Loading patient records...</p>
      </div>
    );
  }

  return (
    <div className="text-left relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">Reports Inbox</h1>
        <SearchBar placeholder="Search reports..." value={search} onChange={setSearch} className="sm:w-72" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All Reports' },
          { value: 'pending', label: '⏳ Pending Review' },
          { value: 'urgent', label: '🚨 Urgent Risk' },
          { value: 'reviewed', label: '✅ Reviewed' },
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
            key={report._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`p-6 border-none shadow-sm hover:shadow-md transition-all bg-white relative overflow-hidden ${report.urgent ? 'border-l-4 border-l-red-500' : ''}`} hover={false}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  report.urgent ? 'bg-red-50' : report.listStatus === 'pending' ? 'bg-amber-50' : 'bg-emerald-50'
                }`}>
                  {report.urgent ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : report.listStatus === 'pending' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-text text-base leading-snug">{report.patientName}</h3>
                    {report.urgent && <Badge variant="error" className="bg-red-100 text-red-700 border-0 rounded font-bold px-2 py-0.5 text-[10px]">Urgent</Badge>}
                    <Badge className={`border-0 rounded font-bold px-2 py-0.5 text-[10px] ${report.listStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {report.listStatus === 'pending' ? 'Pending Review' : 'Reviewed'}
                    </Badge>
                  </div>
                  <p className="text-text-muted text-xs font-semibold">{report.testName} • {report.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleOpenReview(report)} className="rounded-lg h-9 px-4 font-bold flex items-center gap-1 bg-primary text-white">
                    <Eye className="w-4 h-4" /> {report.listStatus === 'pending' ? 'Review' : 'View'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDownloadReport(report._id, report.testName)}
                    className="rounded-lg h-9 px-3 font-bold"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileCheck className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted text-sm font-semibold">No reports match this inbox filter.</p>
          </div>
        )}
      </div>

      {/* Review & Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-heading font-bold">Clinical Consultation Review</h2>
                  <p className="text-xs text-white/80 font-medium">Patient: {selectedReport.patientName} • {selectedReport.testName}</p>
                </div>
                <button onClick={handleCloseReview} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Section 1: Patient Profile & Symptoms */}
                <div className="grid sm:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-border-light text-sm">
                  <div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Patient Details</h3>
                    <div className="space-y-1 text-text font-semibold">
                      <p>Name: <span className="font-bold">{selectedReport.patientName}</span></p>
                      <p>Email: <span className="font-bold">{selectedReport.patientEmail || 'Not set'}</span></p>
                      <p>Age/Gender: <span className="font-bold">{selectedReport.patient?.age || 'N/A'} yrs / {selectedReport.patient?.gender || 'N/A'}</span></p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">AI Screening Result</h3>
                    <div className="space-y-1 text-text font-semibold">
                      <p>Prediction: <span className="font-bold text-primary">{selectedReport.aiAnalysis?.prediction || 'N/A'}</span></p>
                      <p>Confidence: <span className="font-bold">{selectedReport.aiAnalysis?.confidence || 0}%</span></p>
                      <p>Triage Risk: <span className="font-bold uppercase text-red-600">{selectedReport.aiAnalysis?.riskLevel || 'Low'}</span></p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Patient Questionnaire Inputs */}
                {selectedReport.appointment?.answers && Object.keys(selectedReport.appointment.answers).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Patient Symptoms Questionnaire</h3>
                    <div className="grid gap-2 text-xs">
                      {Object.entries(selectedReport.appointment.answers).map(([key, val]) => (
                        <div key={key} className="p-3 bg-gray-50 border border-border-light rounded-xl">
                          <p className="font-bold text-text-secondary uppercase text-[10px] tracking-wider mb-1">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="text-text font-bold text-sm">
                            {Array.isArray(val) ? val.join(', ') : String(val)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 3: Diagnostic Consultation Form */}
                <form onSubmit={handleSubmitReview} className="space-y-4 pt-4 border-t border-border-light">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Clinical Consultation Findings</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text">Medical Diagnosis *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Write professional clinical diagnosis details..."
                        value={reviewForm.diagnosis}
                        onChange={e => setReviewForm({ ...reviewForm, diagnosis: e.target.value })}
                        disabled={selectedReport.listStatus === 'reviewed'}
                        className="w-full p-3 bg-white border border-border rounded-xl text-sm outline-none focus:border-primary disabled:bg-gray-50 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text">Treatment & Recommendations *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Clinical advice, immediate guidelines..."
                        value={reviewForm.recommendations}
                        onChange={e => setReviewForm({ ...reviewForm, recommendations: e.target.value })}
                        disabled={selectedReport.listStatus === 'reviewed'}
                        className="w-full p-3 bg-white border border-border rounded-xl text-sm outline-none focus:border-primary disabled:bg-gray-50 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text">Prescription Details</label>
                    <textarea
                      rows={2}
                      placeholder="Medication names, dosage schedules (e.g. Paracetamol 500mg 1-0-1)..."
                      value={reviewForm.prescription}
                      onChange={e => setReviewForm({ ...reviewForm, prescription: e.target.value })}
                      disabled={selectedReport.listStatus === 'reviewed'}
                      className="w-full p-3 bg-white border border-border rounded-xl text-sm outline-none focus:border-primary disabled:bg-gray-50 font-medium"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text">Severity Classification</label>
                      <select
                        value={reviewForm.severity}
                        onChange={e => setReviewForm({ ...reviewForm, severity: e.target.value })}
                        disabled={selectedReport.listStatus === 'reviewed'}
                        className="w-full p-3 bg-white border border-border rounded-xl text-sm outline-none focus:border-primary disabled:bg-gray-50 font-medium"
                      >
                        <option value="Low">Low (Routine Checkup)</option>
                        <option value="Moderate">Moderate (Consult Specialist)</option>
                        <option value="High">High (Urgent Care)</option>
                        <option value="Critical">Critical (Immediate Triage)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text">Recommended Follow Up Date</label>
                      <input
                        type="date"
                        value={reviewForm.followUpDate}
                        onChange={e => setReviewForm({ ...reviewForm, followUpDate: e.target.value })}
                        disabled={selectedReport.listStatus === 'reviewed'}
                        className="w-full p-3 bg-white border border-border rounded-xl text-sm outline-none focus:border-primary disabled:bg-gray-50 font-medium"
                      />
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                    <Button variant="ghost" onClick={handleCloseReview} type="button" className="rounded-xl h-12 font-bold px-5">
                      Cancel
                    </Button>
                    {selectedReport.listStatus === 'pending' ? (
                      <Button 
                        type="submit" 
                        disabled={submitting}
                        className="rounded-xl h-12 font-bold px-8 bg-primary text-white"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-1.5">
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Check className="w-4 h-4" /> Complete Consultation
                          </span>
                        )}
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Reviewed by you
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
