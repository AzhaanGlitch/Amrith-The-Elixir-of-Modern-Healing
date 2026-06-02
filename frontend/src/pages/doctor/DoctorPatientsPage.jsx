import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, SearchBar, Avatar } from '../../components/ui';
import { User, Phone, Calendar, FileText, Eye, Loader2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorPatientsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('amrith_token');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setAppointments(data.appointments);
        }
      } catch (err) {
        console.error('Error fetching patients list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Compute unique patients list from appointments
  const patientsMap = {};
  appointments.forEach(app => {
    if (!app.patient) return;
    const p = app.patient;
    const patientId = p._id || p;

    if (!patientsMap[patientId]) {
      patientsMap[patientId] = {
        id: patientId,
        name: p.name || 'Patient',
        email: p.email || '',
        phone: p.phone || 'Not provided',
        age: p.age || 'N/A',
        gender: p.gender || 'N/A',
        bloodGroup: p.bloodGroup || 'N/A',
        address: p.address || 'Not provided',
        condition: app.testName,
        lastVisit: new Date(app.scheduledDate).toLocaleDateString(),
      };
    } else {
      const existingDate = new Date(patientsMap[patientId].lastVisit);
      const newDate = new Date(app.scheduledDate);
      if (newDate > existingDate) {
        patientsMap[patientId].lastVisit = newDate.toLocaleDateString();
        patientsMap[patientId].condition = app.testName;
      }
    }
  });

  const patientsList = Object.values(patientsMap);

  const filtered = patientsList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-text-muted text-sm font-semibold">Loading patient profiles...</p>
      </div>
    );
  }

  return (
    <div className="text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">My Patients</h1>
        <SearchBar placeholder="Search patients..." value={search} onChange={setSearch} className="sm:w-72" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 text-left">
        <div className={`${selectedPatient ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.length > 0 ? filtered.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`p-5 cursor-pointer transition-all bg-white border border-border-light hover:shadow-md ${
                    selectedPatient?.id === patient.id ? 'ring-2 ring-primary border-transparent' : ''
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                  hover={false}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary font-heading shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text text-sm truncate">{patient.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{patient.age} yrs • {patient.gender}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-primary/10 text-primary border-0 rounded font-bold text-[10px] px-2.5 py-0.5">{patient.condition}</Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-2 flex items-center gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5" /> Last visit: {patient.lastVisit}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )) : (
              <div className="sm:col-span-2 text-center py-16 text-text-muted bg-white border border-border-light rounded-xl shadow-sm">
                <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-semibold">No patients assigned to you yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Patient Detail Panel */}
        {selectedPatient && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="p-6 sticky top-24 bg-white border border-border-light shadow-md" hover={false}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary font-heading text-2xl mx-auto mb-3">
                  {selectedPatient.name.charAt(0)}
                </div>
                <h3 className="font-heading font-black text-text text-lg leading-tight">{selectedPatient.name}</h3>
                <p className="text-text-muted text-xs font-bold mt-1">{selectedPatient.age} yrs • {selectedPatient.gender}</p>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-border-light">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Primary Condition</p>
                  <p className="font-bold text-text text-sm">{selectedPatient.condition}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-border-light">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Phone Contact</p>
                  <p className="font-bold text-text text-sm flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {selectedPatient.phone}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-border-light">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Home Address</p>
                  <p className="font-bold text-text text-sm flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="leading-snug">{selectedPatient.address}</span>
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-border-light">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Blood Group</p>
                  <p className="font-bold text-text text-sm">{selectedPatient.bloodGroup}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to="/doctor/reports" className="w-full">
                  <Button variant="primary" size="sm" className="w-full rounded-xl h-10 font-bold flex items-center justify-center gap-1 bg-primary text-white">
                    <FileText className="w-4 h-4" /> View Diagnostic Reports
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
