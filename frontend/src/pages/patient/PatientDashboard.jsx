import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/ui';
import { Edit2, Download, FileText, CheckCircle2, CalendarPlus, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';

export default function PatientDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('future');
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateAge = (dob) => {
    if (!dob) return 'Not set';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('amrith_token');
        if (!token) return;

        // Fetch appointments
        const appRes = await fetch(`${API_URL}/appointments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const appData = await appRes.json();
        if (appData.success) {
          setAppointments(appData.appointments);
        }

        // Fetch reports
        const repRes = await fetch(`${API_URL}/reports`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const repData = await repRes.json();
        if (repData.success) {
          setReports(repData.reports);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  // Process and sort appointments
  const futureVisits = appointments
    .filter(app => app.status !== 'completed' && app.status !== 'cancelled')
    .map(app => {
      let colorClass = 'bg-[#E6F0FA] text-[#0066CC]'; // default pending blue
      if (app.status === 'confirmed') colorClass = 'bg-[#EBF7EE] text-[#2E7D32]';
      if (app.status === 'in-progress') colorClass = 'bg-[#FFF9E6] text-[#B78103]';

      return {
        id: app._id,
        date: new Date(app.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        time: app.scheduledTime,
        service: app.testName,
        status: app.status.toUpperCase(),
        color: colorClass,
      };
    });

  const pastVisits = appointments
    .filter(app => app.status === 'completed' || app.status === 'cancelled')
    .map(app => {
      let colorClass = 'bg-gray-100 text-gray-600'; // default completed gray
      if (app.status === 'cancelled') colorClass = 'bg-[#FFEBEE] text-[#C62828]';

      return {
        id: app._id,
        date: new Date(app.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        time: app.scheduledTime,
        service: app.testName,
        status: app.status.toUpperCase(),
        color: colorClass,
      };
    });

  const displayedVisits = activeTab === 'future' ? futureVisits : pastVisits;

  // Process notes from reviewed doctor reports
  const doctorNotes = reports
    .filter(rep => rep.doctorReview && rep.doctorReview.reviewed)
    .map(rep => ({
      id: rep._id,
      title: `${rep.testName} - Dr. ${rep.doctor?.name || 'Specialist'}`,
      date: new Date(rep.doctorReview.reviewedAt).toLocaleDateString(),
      diagnosis: rep.doctorReview.diagnosis,
      prescription: rep.doctorReview.prescription,
      recommendations: rep.doctorReview.recommendations,
    }));

  if (loading) {
    return (
      <div className="bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-text-muted text-sm font-semibold">Synchronizing medical dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 min-h-[calc(100vh-8rem)]">
      
      {/* Top Section - Profile Cards */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        
        {/* Profile Info */}
        <div className="bg-white rounded-md border border-border-light p-6 shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-primary/20 mb-4 overflow-hidden bg-gray-50 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-12 h-12 text-primary/40" />
            )}
          </div>
          <h2 className="text-xl font-heading font-bold text-text mb-2">{user?.name || 'New Patient'}</h2>
          <p className="text-sm text-primary font-semibold mb-1">{user?.phone || 'No phone added'}</p>
          <p className="text-sm text-text-muted">{user?.email || 'No email added'}</p>
        </div>

        {/* General Information */}
        <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-text">{t('portal.profile')}</h3>
            <button className="text-primary hover:text-primary-dark transition-colors"><Edit2 className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Date of birth:</span>
              <span className="text-sm font-semibold text-text">{user?.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Address:</span>
              <span className="text-sm font-semibold text-text text-right max-w-[150px]">{user?.address || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Gender:</span>
              <span className="text-sm font-semibold text-text">{user?.gender || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-text">Medical Info</h3>
            <button className="text-primary hover:text-primary-dark transition-colors"><Edit2 className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Blood Group:</span>
              <span className="text-sm font-semibold text-text">{user?.bloodGroup || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Age:</span>
              <span className="text-sm font-semibold text-text">{user?.age || calculateAge(user?.dob)}</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Member Since:</span>
              <span className="text-sm font-semibold text-text">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section - Lists */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Visits & Treatments */}
        <div className="lg:col-span-2 bg-white rounded-md border border-border-light p-6 shadow-sm">
          <div className="flex items-center gap-6 border-b border-border-light mb-6 font-heading">
            <button 
              onClick={() => setActiveTab('future')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'future' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
            >
              Upcoming Visits ({futureVisits.length})
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'past' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
            >
              Past Visits ({pastVisits.length})
            </button>
          </div>

          <div className="space-y-4">
            {displayedVisits.length > 0 ? (
              displayedVisits.map((visit) => (
                <div key={visit.id} className={`flex items-center justify-between p-4 rounded-xl border border-transparent shadow-sm hover:shadow-md transition-all ${visit.color}`}>
                  <div className="w-1/4">
                    <p className="text-xs opacity-70 font-semibold">{visit.time}</p>
                    <p className="text-sm font-black">{visit.date}</p>
                  </div>
                  <div className="w-1/3 border-l border-current/25 pl-4">
                    <p className="text-xs opacity-70 font-semibold">Service:</p>
                    <p className="text-sm font-black truncate">{visit.service}</p>
                  </div>
                  <div className="w-auto text-right">
                    <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-text font-black tracking-wide rounded-full text-[10px] px-3 border border-current/15">{visit.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarPlus className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
                <p className="text-text-muted text-sm mb-4">No appointments in this category</p>
                {activeTab === 'future' && (
                  <Link to="/patient/book" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                    Book Your First Screening
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Files & Notes */}
        <div className="space-y-6 text-left">
          {/* Files / Reports */}
          <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text">Medical Reports</h3>
            </div>
            {reports.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {reports.map((rep) => (
                  <div key={rep._id} className="flex items-center justify-between p-2.5 bg-background-alt hover:bg-gray-50 border border-border-light rounded-xl transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text truncate">{rep.testName}</p>
                        <p className="text-[9px] text-text-muted font-bold uppercase tracking-tighter">
                          {rep.status === 'doctor-reviewed' ? 'Reviewed' : 'AI Completed'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadReport(rep._id, rep.testName)}
                      className="p-1.5 hover:bg-primary/10 rounded-lg text-primary hover:text-primary-dark transition-all shrink-0"
                      title="Download HTML Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">No reports yet. Documents will appear here after diagnostic screening.</p>
            )}
          </div>

          {/* Doctor Notes */}
          <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text">Doctor Consult Notes</h3>
            </div>
            {doctorNotes.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {doctorNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-background-alt border border-border-light rounded-xl space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-primary truncate max-w-[130px]">{note.title}</span>
                      <span className="text-[9px] text-text-muted font-semibold shrink-0">{note.date}</span>
                    </div>
                    <div className="text-[11px] text-text leading-relaxed font-semibold">
                      <span className="text-text-muted block text-[9px] uppercase font-bold">Diagnosis</span>
                      {note.diagnosis || 'No formal diagnosis provided'}
                    </div>
                    {note.prescription && (
                      <div className="text-[11px] text-text leading-relaxed font-semibold">
                        <span className="text-text-muted block text-[9px] uppercase font-bold">Prescription</span>
                        {note.prescription}
                      </div>
                    )}
                    {note.recommendations && (
                      <div className="text-[11px] text-text leading-relaxed font-semibold">
                        <span className="text-text-muted block text-[9px] uppercase font-bold">Recommendations</span>
                        {note.recommendations}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">No specialist notes yet. Clinical consultation feedback will appear here.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
