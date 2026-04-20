import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../../components/ui';
import { Edit2, Download, FileText, CheckCircle2, ChevronDown, DownloadCloud } from 'lucide-react';

export default function PatientDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('future');

  const futureVisits = [
    { id: 1, date: '26 Jun 2023', time: '11.00-12.30', service: 'Treatment and cleaning of canals', doctor: 'Oksana Ma...', status: 'Scheduled', color: 'bg-primary/10 border-l-4 border-primary' },
    { id: 2, date: '27 Jul 2023', time: '11.00-12.30', service: 'Teeth whitening', doctor: 'Max Oched...', status: 'Scheduled', color: 'bg-secondary/10 border-l-4 border-secondary' },
  ];

  const files = [
    { name: 'Check Up Result.pdf', size: '123kb', active: false },
    { name: 'Check Up Result.pdf', size: '123kb', active: true },
    { name: 'Medical Prescriptions.pdf', size: '123kb', active: false },
    { name: 'Check Up Result.pdf', size: '123kb', active: false },
  ];

  const notes = [
    { name: 'Note 31.06.23.pdf', size: '123kb' },
    { name: 'Note 23.06.23.pdf', size: '123kb' },
  ];

  return (
    <div className="bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 min-h-[calc(100vh-8rem)]">
      
      {/* Top Section - Profile Cards */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        
        {/* Profile Info */}
        <div className="bg-white rounded-md border border-border-light p-6 shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-primary/20 mb-4 overflow-hidden bg-gray-50">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Kate'}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="text-xl font-heading font-bold text-text mb-2">{user?.name || 'Kate Prokopchuk'}</h2>
          <p className="text-sm text-primary font-semibold mb-1">+91 (093) 23 45 678</p>
          <p className="text-sm text-text-muted">katepro@gmail.com</p>
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
              <span className="text-sm font-semibold text-text">23. 07. 1994</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Address:</span>
              <span className="text-sm font-semibold text-text text-right max-w-[150px]">Lviv, Chornovola street, 67</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Registration Date:</span>
              <span className="text-sm font-semibold text-text">Thursday, May 25</span>
            </div>
          </div>
        </div>

        {/* Anamnesis */}
        <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-text">Anamnesis</h3>
            <button className="text-primary hover:text-primary-dark transition-colors"><Edit2 className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Allergies:</span>
              <span className="text-sm font-semibold text-text">Nuts, pollen</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Chronic diseases:</span>
              <span className="text-sm font-semibold text-text">Asthma</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Blood type:</span>
              <span className="text-sm font-semibold text-text">I+</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-sm text-text-muted">Past illnesses or injuries:</span>
              <span className="text-sm font-semibold text-text text-right max-w-[150px]">Corona virus</span>
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
              Future visits (2)
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'past' ? 'border-secondary text-secondary-dark' : 'border-transparent text-text-muted hover:text-text'}`}
            >
              Past visits (15)
            </button>
            <button 
              onClick={() => setActiveTab('planned')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'planned' ? 'border-secondary text-secondary-dark' : 'border-transparent text-text-muted hover:text-text'}`}
            >
              Planned treatments
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === 'future' && futureVisits.map((visit) => (
              <div key={visit.id} className={`flex items-center justify-between p-4 rounded-md ${visit.color}`}>
                <div className="w-1/4">
                  <p className="text-xs text-text-muted">{visit.time}</p>
                  <p className="text-sm font-bold text-text">{visit.date}</p>
                </div>
                <div className="w-1/3 border-l border-white/40 pl-4">
                  <p className="text-xs text-text-muted">Service:</p>
                  <p className="text-sm font-bold text-text truncate">{visit.service}</p>
                </div>
                <div className="w-1/4 border-l border-white/40 pl-4">
                  <p className="text-xs text-text-muted">Doctor:</p>
                  <p className="text-sm font-semibold text-primary truncate">{visit.doctor}</p>
                </div>
                <div className="w-auto text-right">
                  <p className="text-xs text-text-muted mb-1">Status:</p>
                  <Badge variant="secondary" className="bg-secondary text-white font-bold tracking-wide rounded-full text-[10px] px-3">{visit.status}</Badge>
                </div>
              </div>
            ))}
            {activeTab !== 'future' && (
              <div className="text-center py-8 text-text-muted">No records available for this tab.</div>
            )}
          </div>
        </div>

        {/* Files & Notes */}
        <div className="space-y-6">
          {/* Files */}
          <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text">Files</h3>
              <button className="flex items-center gap-1 border border-secondary text-secondary-dark px-3 py-1 rounded-full text-xs font-bold hover:bg-secondary hover:text-white transition-all">
                DOWNLOAD
              </button>
            </div>
            <div className="space-y-3">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 ${file.active ? 'text-primary' : 'text-text-muted'}`} />
                    <span className={`text-sm ${file.active ? 'text-primary font-bold' : 'text-text-muted font-medium'}`}>{file.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">{file.size}</span>
                    {file.active && (
                      <div className="flex items-center gap-2">
                        <DownloadCloud className="w-4 h-4 text-primary cursor-pointer hover:text-primary-dark" />
                        <CheckCircle2 className="w-4 h-4 text-error cursor-pointer" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-md border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text">Notes</h3>
              <button className="flex items-center gap-1 border border-secondary text-secondary-dark px-3 py-1 rounded-full text-xs font-bold hover:bg-secondary hover:text-white transition-all">
                DOWNLOAD
              </button>
            </div>
            <div className="space-y-3">
              {notes.map((note, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-muted font-medium">{note.name}</span>
                  </div>
                  <span className="text-xs text-text-muted">{note.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
