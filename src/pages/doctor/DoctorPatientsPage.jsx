import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, SearchBar, Avatar } from '../../components/ui';
import { doctorPatients } from '../../data/mockData';
import { User, Phone, Calendar, FileText, Eye } from 'lucide-react';

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filtered = doctorPatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">My Patients</h1>
        <SearchBar placeholder="Search patients..." value={search} onChange={setSearch} className="sm:w-72" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`${selectedPatient ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`p-5 cursor-pointer transition-all ${
                    selectedPatient?.id === patient.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar name={patient.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text text-sm">{patient.name}</h3>
                      <p className="text-xs text-text-muted">{patient.age} yrs • {patient.gender}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="primary">{patient.condition}</Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Last visit: {patient.lastVisit}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Patient Detail Panel */}
        {selectedPatient && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <Avatar name={selectedPatient.name} size="xl" className="mx-auto mb-3" />
                <h3 className="font-heading font-bold text-text text-lg">{selectedPatient.name}</h3>
                <p className="text-text-muted text-sm">{selectedPatient.age} yrs • {selectedPatient.gender}</p>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-background rounded-xl">
                  <p className="text-xs text-text-muted mb-1">Condition</p>
                  <p className="font-medium text-text text-sm">{selectedPatient.condition}</p>
                </div>
                <div className="p-3 bg-background rounded-xl">
                  <p className="text-xs text-text-muted mb-1">Phone</p>
                  <p className="font-medium text-text text-sm">{selectedPatient.phone}</p>
                </div>
                <div className="p-3 bg-background rounded-xl">
                  <p className="text-xs text-text-muted mb-1">Last Visit</p>
                  <p className="font-medium text-text text-sm">{selectedPatient.lastVisit}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="primary" size="sm" className="w-full">
                  <Eye className="w-4 h-4" /> View Full Record
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="w-4 h-4" /> View Reports
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
