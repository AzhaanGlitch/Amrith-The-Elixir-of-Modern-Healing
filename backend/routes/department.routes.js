import express from 'express';

const router = express.Router();

// ─── Department & Disease Data ───────────────────────────────
// This mirrors the frontend mockData.js departments structure
// so the backend is the single source of truth

const departments = [
  {
    id: 6, name: 'General Medicine', icon: 'Stethoscope',
    description: 'Common ailment diagnosis from symptoms, images & readings',
    color: '#006D77',
    diseases: ['fever', 'cold', 'sinus', 'tonsillitis', 'allergies'],
  },
  {
    id: 7, name: 'Cardiovascular', icon: 'HeartPulse',
    description: 'Heart health analysis from symptoms, readings & reports',
    color: '#E53E3E',
    diseases: ['hypertension', 'heart-failure', 'arrhythmia'],
  },
  {
    id: 1, name: 'Dermatology', icon: 'Sparkles',
    description: 'AI-powered skin disease detection from images',
    color: '#D69E2E',
    diseases: ['skin-cancer', 'fungal-infection', 'eczema', 'psoriasis'],
  },
  {
    id: 5, name: 'Orthopedics', icon: 'Bone',
    description: 'X-ray based bone & joint condition analysis',
    color: '#DD6B20',
    diseases: ['fracture', 'dislocation', 'arthritis', 'osteoporosis'],
  },
  {
    id: 8, name: 'Neurology', icon: 'Brain',
    description: 'Brain & nervous system analysis from symptoms & medical data',
    color: '#805AD5',
    diseases: ['headache', 'parkinsons', 'seizures', 'stroke-risk'],
  },
  {
    id: 3, name: 'Ophthalmology', icon: 'Eye',
    description: 'AI-based eye disease detection from retinal images',
    color: '#3182CE',
    diseases: ['myopia', 'diabetic-retinopathy', 'glaucoma', 'cataracts'],
  },
  {
    id: 2, name: 'Pulmonology', icon: 'Wind',
    description: 'Chest X-ray based lung disease detection & analysis',
    color: '#4FD1C5',
    diseases: ['tuberculosis', 'pneumonia', 'copd', 'asthma'],
  },
  {
    id: 4, name: 'Oncology', icon: 'Microscope',
    description: 'AI cancer screening from medical images and scans',
    color: '#E53E3E',
    diseases: ['skin-cancer-onc', 'lung-cancer', 'breast-cancer'],
  },
];

// ─── GET /api/departments ────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: departments.length,
    departments,
  });
});

// ─── GET /api/departments/:id ────────────────────────────────
router.get('/:id', (req, res) => {
  const dept = departments.find(d => d.id === parseInt(req.params.id));

  if (!dept) {
    return res.status(404).json({ error: 'Department not found' });
  }

  res.json({ success: true, department: dept });
});

export default router;
