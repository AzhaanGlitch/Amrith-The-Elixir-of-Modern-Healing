import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/ui';
import { Edit2, Download, FileText, CheckCircle2, ChevronDown, DownloadCloud, CalendarPlus, ClipboardList, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('future');

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

  // Data will come from backend API — empty for now
  const futureVisits = [];
  const files = [];
  const notes = [];

  return (
    <div className="bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 min-h-[calc(100vh-8rem)]">
      
      {/* Top Section - Profile Cards */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        
        {/* Profile Info */}
        <div className="bg-white rounded-md border border-border-light p-6 shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-primary/20 mb-4 overflow-hidden bg-gray-50 flex items-center justify-center">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
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
              <span className="text-sm font-semibold text-text">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section - Lists */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Visits & Treatments */}
        <div className="lg:col-span-2 bg-white rounded-md border border-border-light p-6 shadow-sm">
          <div className="flex items-center gap-6 border-b border-border-light mb-6">
            <button 
              onClick={() => setActiveTab('future')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'future' ? 'border-secondary text-secondary-dark' : 'border-transparent text-text-muted hover:text-text'}`}
            >
              Upcoming Visits ({futureVisits.length})
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'past' ? 'border-secondary text-secondary-dark' : 'border-transparent text-text-muted hover:text-text'}`}
            >
              Past Visits
            </button>
          </div>

          <div className="space-y-4">
            {futureVisits.length > 0 ? (
              futureVisits.map((visit) => (
                <div key={visit.id} className={`flex items-center justify-between p-4 rounded-md ${visit.color}`}>
                  <div className="w-1/4">
                    <p className="text-xs text-text-muted">{visit.time}</p>
                    <p className="text-sm font-bold text-text">{visit.date}</p>
                  </div>
                  <div className="w-1/3 border-l border-white/40 pl-4">
                    <p className="text-xs text-text-muted">Service:</p>
                    <p className="text-sm font-bold text-text truncate">{visit.service}</p>
                  </div>
                  <div className="w-auto text-right">
                    <Badge variant="secondary" className="bg-secondary text-white font-bold tracking-wide rounded-full text-[10px] px-3">{visit.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarPlus className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
                <p className="text-text-muted text-sm mb-4">No upcoming appointments</p>
                <Link to="/patient/book" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
                  Book Your First Screening
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Files & Notes */}
        <div className="space-y-6">
          {/* Files */}
          <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text">Files</h3>
            </div>
            {files.length > 0 ? (
              <div className="space-y-3">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-muted font-medium">{file.name}</span>
                    </div>
                    <span className="text-xs text-text-muted">{file.size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">No files yet. Your medical documents will appear here after appointments.</p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text">Notes</h3>
            </div>
            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-muted font-medium">{note.name}</span>
                    </div>
                    <span className="text-xs text-text-muted">{note.size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">No notes yet. Doctor's notes will appear here after consultations.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
