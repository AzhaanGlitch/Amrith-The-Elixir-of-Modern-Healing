// Amrith MedTech Platform — Application Configuration Data
// This file contains ONLY structural/config data (departments, time slots).
// All user data (patients, doctors, appointments, reports) comes from the backend API.

export const departments = [
  {
    id: 6,
    name: 'General Medicine (disease related to common ailments)',
    icon: 'Stethoscope',
    description: 'Common ailment diagnosis from symptoms, images & readings',
    color: '#006D77',
    inputTypes: ['images', 'readings'],
    diseases: [
      { id: 'fever', name: 'Fever & Infection Analysis', description: 'AI assessment of fever patterns, chills, sweating, and infectious ailments.', inputs: ['readings'] },
      { id: 'common-cold', name: 'Common Cold Assessment', description: 'Screening for runny/stuffy nose, sneezing, throat irritation, and coughing.', inputs: ['readings'] },
      { id: 'sinus', name: 'Sinusitis Assessment', description: 'Diagnostic evaluation of forehead sinus pressure, congestion, and headaches.', inputs: ['readings', 'images'] },
      { id: 'tonsillitis', name: 'Tonsillitis Screen', description: 'Assessing throat soreness, swollen neck glands, patches, and swallowing difficulty.', inputs: ['images'] },
      { id: 'allergy-gm', name: 'Allergy Assessment (General)', description: 'Evaluating skin itching, rashes, watering eyes, and continuous sneezing.', inputs: ['readings'] },
      { id: 'headache', name: 'Headache Classification', description: 'Detailed screening for pressure, tension, and mild vascular headaches.', inputs: ['readings'] },
      { id: 'gerd', name: 'GERD & Acid Reflux', description: 'Analyzing symptoms of acidity, heartburn, ulcers, and chest burning.', inputs: ['readings'] },
      { id: 'chronic-cholestasis', name: 'Chronic Cholestasis', description: 'Screening for bile duct obstructions, yellowish skin, and itching.', inputs: ['readings'] },
      { id: 'drug-reaction', name: 'Drug Reaction Assessment', description: 'Evaluating adverse pharmaceutical side-effects, rashes, and body swelling.', inputs: ['readings'] },
      { id: 'peptic-ulcer', name: 'Peptic Ulcer Disease', description: 'Triage for stomach lining sores, localized belly pain, and indigestion.', inputs: ['readings'] },
      { id: 'aids', name: 'AIDS Triage Screening', description: 'Clinical screening for high-risk exposures, weight loss, and chronic malaise.', inputs: ['readings'] },
      { id: 'diabetes', name: 'Diabetes Indicator Check', description: 'Screening for polyuria, extreme hunger, weight fluctuations, and fatigue.', inputs: ['readings'] },
      { id: 'gastroenteritis', name: 'Gastroenteritis (Stomach Flu)', description: 'Assessing stomach cramps, diarrhea, nausea, vomiting, and dehydration.', inputs: ['readings'] },
      { id: 'bronchial-asthma-gm', name: 'Bronchial Asthma (Tabular)', description: 'General medicine assessment of breathlessness, coughing, and chest tightness.', inputs: ['readings'] },
      { id: 'migraine', name: 'Migraine Pattern Check', description: 'Evaluating intense throbbing headaches, visual aura, and sensory sensitivities.', inputs: ['readings'] },
      { id: 'cervical-spondylosis', name: 'Cervical Spondylosis', description: 'Screening for neck stiffness, radiating shoulder pain, and weak limbs.', inputs: ['readings'] },
      { id: 'paralysis', name: 'Paralysis & Stroke Risk', description: 'Urgent evaluation of hemiplegia risk, facial droop, and motor loss.', inputs: ['readings'] },
      { id: 'jaundice', name: 'Jaundice & Liver Check', description: 'Evaluating yellowish skin, yellowing of eyes, dark urine, and liver fatigue.', inputs: ['readings'] },
      { id: 'malaria', name: 'Malaria Fever Screen', description: 'Assessing high fever, severe shivering, body aches, and sweating cycles.', inputs: ['readings'] },
      { id: 'chicken-pox', name: 'Chicken Pox Diagnosis', description: 'Evaluating blistering skin rashes, mild fever, and lethargy.', inputs: ['readings'] },
      { id: 'dengue', name: 'Dengue Fever Triage', description: 'Checking for high fever, joint pain, back pain, and pain behind eyes.', inputs: ['readings'] },
      { id: 'typhoid', name: 'Typhoid Fever Check', description: 'Checking for high fever, abdominal pain, constipation, and toxic look.', inputs: ['readings'] },
      { id: 'hepatitis-a', name: 'Hepatitis A Screen', description: 'Triage for acute food/waterborne liver inflammation symptoms.', inputs: ['readings'] },
      { id: 'hepatitis-b', name: 'Hepatitis B Screen', description: 'Screening for chronic viral hepatitis B indicators, fatigue, and jaundice.', inputs: ['readings'] },
      { id: 'hepatitis-c', name: 'Hepatitis C Screen', description: 'Assessing exposure risk, liver soreness, and dark urine cues.', inputs: ['readings'] },
      { id: 'hepatitis-d', name: 'Hepatitis D Screen', description: 'Triage for superinfection in chronic hepatitis carriers.', inputs: ['readings'] },
      { id: 'hepatitis-e', name: 'Hepatitis E Screen', description: 'Evaluating acute waterborne liver swelling, nausea, and joint pain.', inputs: ['readings'] },
      { id: 'alcoholic-hepatitis', name: 'Alcoholic Hepatitis Screen', description: 'Evaluating abdominal distention, fluid overload, and alcohol-related liver risk.', inputs: ['readings'] },
      { id: 'piles', name: 'Hemorrhoids (Piles) Triage', description: 'Checking for anal itching, pain during bowel movements, and bleeding.', inputs: ['readings'] },
      { id: 'heart-attack-gm', name: 'Heart Attack Screening (Tabular)', description: 'Tabular screening for squeezing chest pain, dyspnea, and sweating.', inputs: ['readings'] },
      { id: 'varicose-veins', name: 'Varicose Veins Triage', description: 'Screening for swollen legs, leg heaviness, and calf vein prominence.', inputs: ['readings'] },
      { id: 'hypothyroidism', name: 'Hypothyroidism Check', description: 'Checking for slow metabolism, weight gain, cold sensitivity, and lethargy.', inputs: ['readings'] },
      { id: 'hyperthyroidism', name: 'Hyperthyroidism Check', description: 'Assessing hyperactive metabolic cues: rapid weight loss, hunger, and sweating.', inputs: ['readings'] },
      { id: 'hypoglycemia', name: 'Hypoglycemia Triage', description: 'Assessing low blood glucose indicators: shakiness, anxiety, and confusion.', inputs: ['readings'] },
      { id: 'osteoarthritis', name: 'Osteoarthritis Screening (Tabular)', description: 'Evaluating joint stiffness, movement pain, and knee swelling.', inputs: ['readings'] },
      { id: 'vertigo', name: 'Vertigo & Balance Triage', description: 'Checking for spinning sensations, unsteadiness, and nausea.', inputs: ['readings'] },
      { id: 'acne', name: 'Acne & Skin Lumps', description: 'Analyzing facial blackheads, pus-filled pimples, and skin scarring.', inputs: ['readings'] },
      { id: 'urinary-tract-infection', name: 'UTI Diagnostic Check', description: 'Diagnosing painful burning urination, urge, and bladder pressure.', inputs: ['readings'] },
      { id: 'impetigo', name: 'Impetigo Infection Check', description: 'Checking for red nose sores and yellow crust oozing lesions.', inputs: ['readings'] },
      { id: 'fungal-infection-gm', name: 'Fungal Infection (Tabular)', description: 'Checking for skin rashes, internal itching, and dischromic patches.', inputs: ['readings'] },
      { id: 'psoriasis-gm', name: 'Psoriasis (Tabular)', description: 'Evaluating skin peeling, joint pain, and silver dusting indicators.', inputs: ['readings'] },
      { id: 'hypertension-gm', name: 'Hypertension (Tabular)', description: 'Checking for elevated blood pressure symptoms, headache, and palpitations.', inputs: ['readings'] },
      { id: 'tuberculosis-gm', name: 'Tuberculosis (Tabular)', description: 'Triage for chronic cough, blood in sputum, chest pain, and night sweats.', inputs: ['readings'] },
      { id: 'pneumonia-gm', name: 'Pneumonia (Tabular)', description: 'Screening for breathlessness, high fever, and rusty sputum.', inputs: ['readings'] },
      { id: 'arthritis-gm', name: 'Arthritis General Check (Tabular)', description: 'Evaluating multi-joint swelling, walking pain, and stiffness.', inputs: ['readings'] },
    ],
  },
  {
    id: 7,
    name: 'Cardiovascular (disease related to heart)',
    icon: 'HeartPulse',
    description: 'Heart health analysis from symptoms, readings & reports',
    color: '#E53E3E',
    inputTypes: ['images', 'readings', 'reports'],
    diseases: [
      { id: 'hypertension', name: 'Hypertension Assessment', description: 'AI analysis of blood pressure readings, symptoms, and history for hypertension risk evaluation.', inputs: ['readings', 'reports'], questions: [{ id: 'q1', label: 'Latest blood pressure reading', type: 'text', placeholder: 'e.g., 140/90 mmHg' }], uploadLabel: 'Upload BP monitor readings or ECG reports', uploadType: 'report', maxFiles: 5 },
      { id: 'heart-failure', name: 'Heart Failure Risk Assessment', description: 'Comprehensive AI evaluation of heart failure risk from symptoms, reports, and medical history.', inputs: ['readings', 'reports', 'images'], questions: [{ id: 'q1', label: 'Symptoms', type: 'checkbox', options: ['Shortness of breath', 'Fatigue/Weakness', 'Swelling in legs/ankles/feet', 'Rapid/irregular heartbeat', 'Persistent cough/wheezing'] }], uploadLabel: 'Upload ECG, Echo reports, chest X-rays', uploadType: 'report', maxFiles: 10 },
      { id: 'arrhythmia', name: 'Arrhythmia Screening', description: 'AI analysis of heart rhythm patterns from symptoms and ECG data.', inputs: ['readings', 'reports'], questions: [{ id: 'q1', label: 'What type of heartbeat irregularity do you feel?', type: 'checkbox', options: ['Skipped beats', 'Racing heart', 'Slow heartbeat', 'Fluttering sensation'] }], uploadLabel: 'Upload ECG reports or smartwatch heart data', uploadType: 'report', maxFiles: 5 },
    ],
  },
  {
    id: 1,
    name: 'Dermatology (disease related to skin)',
    icon: 'Sparkles',
    description: 'AI-powered skin disease detection from images',
    color: '#D69E2E',
    inputTypes: ['images'],
    diseases: [
      { id: 'skin-cancer', name: 'Skin Cancer Screening', description: 'Upload clear images of suspicious moles, lesions, or skin patches for AI-based melanoma and carcinoma risk analysis.', inputs: ['images'], questions: [{ id: 'q1', label: 'How long have you had this skin condition?', type: 'select', options: ['Less than 1 week', '1-4 weeks', '1-3 months', '3-6 months', 'More than 6 months', 'Since birth'] }], uploadLabel: 'Upload clear, well-lit images of the affected skin area', uploadType: 'image', maxFiles: 5 },
      { id: 'fungal-infection', name: 'Fungal Infection Detection', description: 'Detect ringworm, athlete\'s foot, candidiasis and other fungal skin infections from images.', inputs: ['images'], questions: [{ id: 'q1', label: 'Where is the infection located?', type: 'checkbox', options: ['Scalp', 'Face', 'Arms/Legs', 'Torso', 'Groin area', 'Feet/Toes', 'Nails'] }], uploadLabel: 'Upload clear images of the affected skin area', uploadType: 'image', maxFiles: 5 },
      { id: 'eczema', name: 'Eczema / Dermatitis Detection', description: 'AI analysis of eczema, contact dermatitis, and related conditions from skin images.', inputs: ['images'], questions: [{ id: 'q1', label: 'Where are the affected areas?', type: 'checkbox', options: ['Hands', 'Face', 'Neck', 'Inner elbows', 'Behind knees', 'Scalp', 'Feet'] }], uploadLabel: 'Upload images showing the eczema patches', uploadType: 'image', maxFiles: 5 },
      { id: 'psoriasis', name: 'Psoriasis Screening', description: 'Identify psoriatic plaques and patches through AI image analysis.', inputs: ['images'], questions: [{ id: 'q1', label: 'Where are the psoriasis patches located?', type: 'checkbox', options: ['Elbows', 'Knees', 'Scalp', 'Lower back', 'Nails', 'Palms/Soles'] }], uploadLabel: 'Upload clear images of the psoriasis-affected skin areas', uploadType: 'image', maxFiles: 5 },
    ],
  },
  {
    id: 5,
    name: 'Orthopedics (disease related to bones & joints)',
    icon: 'Bone',
    description: 'X-ray based bone & joint condition analysis',
    color: '#DD6B20',
    inputTypes: ['xray'],
    diseases: [
      { id: 'fracture', name: 'Fracture Detection', description: 'AI-powered X-ray analysis to detect fractures, hairline cracks, and stress fractures.', inputs: ['xray'], questions: [{ id: 'q1', label: 'Which area is affected?', type: 'select', options: ['Hand/Wrist', 'Forearm', 'Upper arm/Shoulder', 'Rib cage', 'Spine', 'Hip/Pelvis', 'Thigh', 'Knee', 'Lower leg', 'Ankle/Foot'] }], uploadLabel: 'Upload X-ray image of the affected area', uploadType: 'xray', maxFiles: 5 },
      { id: 'dislocation', name: 'Dislocation Assessment', description: 'Detect joint dislocations and subluxations from X-ray imaging.', inputs: ['xray'], questions: [{ id: 'q1', label: 'Which joint is affected?', type: 'select', options: ['Shoulder', 'Elbow', 'Wrist', 'Finger', 'Hip', 'Knee', 'Ankle', 'Jaw'] }], uploadLabel: 'Upload X-ray of the affected joint', uploadType: 'xray', maxFiles: 5 },
      { id: 'arthritis', name: 'Arthritis Screening', description: 'AI analysis of joint X-rays to detect osteoarthritis, rheumatoid arthritis, and joint degeneration.', inputs: ['xray'], questions: [{ id: 'q1', label: 'Which joints are affected?', type: 'checkbox', options: ['Hands/Fingers', 'Wrists', 'Elbows', 'Shoulders', 'Hips', 'Knees', 'Ankles', 'Spine'] }], uploadLabel: 'Upload X-ray of affected joints', uploadType: 'xray', maxFiles: 5 },
      { id: 'osteoporosis', name: 'Osteoporosis Screening', description: 'Bone density analysis from X-ray imaging for osteoporosis risk detection.', inputs: ['xray'], questions: [{ id: 'q1', label: 'Age group', type: 'select', options: ['Under 50', '50-60', '60-70', '70+'] }], uploadLabel: 'Upload X-ray images (spine, hip, or wrist preferred)', uploadType: 'xray', maxFiles: 5 },
    ],
  },
  {
    id: 8,
    name: 'Neurology (disease related to brain & nerves)',
    icon: 'Brain',
    description: 'Brain & nervous system analysis from symptoms & medical data',
    color: '#805AD5',
    inputTypes: ['images', 'readings', 'reports'],
    diseases: [
      { id: 'headache', name: 'Headache & Migraine Analysis', description: 'AI classification of headache types and migraine patterns for targeted treatment guidance.', inputs: ['readings'], questions: [{ id: 'q1', label: 'Type of headache pain', type: 'select', options: ['Throbbing/Pulsating', 'Pressure/Squeezing', 'Sharp/Stabbing', 'Dull/Aching', 'Burning'] }], uploadLabel: 'Upload any relevant scan reports (CT/MRI) if available', uploadType: 'report', maxFiles: 5 },
      { id: 'parkinsons', name: 'Parkinson\'s Screening', description: 'AI assessment of Parkinson\'s disease risk based on symptoms and neurological indicators.', inputs: ['readings', 'reports'], questions: [{ id: 'q1', label: 'Motor symptoms', type: 'checkbox', options: ['Tremor (shaking)', 'Slow movement', 'Muscle stiffness', 'Balance problems'] }], uploadLabel: 'Upload neurological reports', uploadType: 'report', maxFiles: 5 },
      { id: 'seizures', name: 'Seizure & Epilepsy Assessment', description: 'AI analysis of seizure patterns and EEG data for epilepsy screening.', inputs: ['readings', 'reports'], questions: [{ id: 'q1', label: 'Type of seizure experienced', type: 'checkbox', options: ['Whole body shaking', 'Staring spells', 'Sudden jerking movements', 'Temporary confusion', 'Loss of consciousness'] }], uploadLabel: 'Upload EEG reports or MRI/CT scans', uploadType: 'report', maxFiles: 5 },
      { id: 'stroke-risk', name: 'Stroke Risk Assessment', description: 'AI evaluation of stroke risk factors and symptoms for early warning detection.', inputs: ['readings', 'reports'], questions: [{ id: 'q1', label: 'Have you experienced sudden symptoms?', type: 'checkbox', options: ['Sudden numbness', 'Sudden confusion', 'Sudden trouble speaking', 'Sudden vision problems', 'None'] }], uploadLabel: 'Upload CT/MRI scans or blood reports', uploadType: 'report', maxFiles: 5 },
    ],
  },
  {
    id: 3,
    name: 'Ophthalmology (disease related to eyes)',
    icon: 'Eye',
    description: 'AI-based eye disease detection from retinal images',
    color: '#3182CE',
    inputTypes: ['images'],
    diseases: [
      { id: 'myopia', name: 'Myopia Assessment', description: 'Evaluate myopia (nearsightedness) severity and progression through retinal/eye images.', inputs: ['images'], questions: [{ id: 'q1', label: 'When did you first notice blurry distance vision?', type: 'select', options: ['Recently', '1-6 months ago', '6-12 months ago', 'More than a year ago', 'Since childhood'] }], uploadLabel: 'Upload eye/retinal scan images', uploadType: 'image', maxFiles: 4 },
      { id: 'diabetic-retinopathy', name: 'Diabetic Retinopathy Screening', description: 'Early detection of diabetic retinopathy from fundus/retinal images using AI.', inputs: ['images'], questions: [{ id: 'q1', label: 'How long have you been diagnosed with diabetes?', type: 'select', options: ['Not diagnosed', 'Less than 1 year', '1-5 years', '5-10 years', 'More than 10 years'] }], uploadLabel: 'Upload fundus/retinal images', uploadType: 'image', maxFiles: 4 },
      { id: 'glaucoma', name: 'Glaucoma Screening', description: 'AI screening for glaucoma from optic disc and retinal images.', inputs: ['images'], questions: [{ id: 'q1', label: 'Have you noticed any vision changes?', type: 'checkbox', options: ['Tunnel vision', 'Blurred vision', 'Halos around lights', 'Eye pain', 'Redness', 'None'] }], uploadLabel: 'Upload retinal/optic disc images', uploadType: 'image', maxFiles: 4 },
      { id: 'cataracts', name: 'Cataract Detection', description: 'Detect early signs of cataracts through AI analysis of eye images.', inputs: ['images'], questions: [{ id: 'q1', label: 'Vision symptoms', type: 'checkbox', options: ['Cloudy/foggy vision', 'Difficulty seeing at night', 'Sensitivity to light/glare', 'Fading/yellowing of colors'] }], uploadLabel: 'Upload clear eye images or slit-lamp photos', uploadType: 'image', maxFiles: 4 },
    ],
  },
  {
    id: 2,
    name: 'Pulmonology (disease related to lungs & breathing)',
    icon: 'Wind',
    description: 'Chest X-ray based lung disease detection & analysis',
    color: '#4FD1C5',
    inputTypes: ['xray'],
    diseases: [
      { id: 'tuberculosis', name: 'Tuberculosis (TB) Detection', description: 'AI-powered chest X-ray analysis for tuberculosis detection and risk assessment.', inputs: ['xray'], questions: [{ id: 'q1', label: 'How long have you been coughing?', type: 'select', options: ['Less than 1 week', '1-2 weeks', '2-4 weeks', '1-3 months', 'More than 3 months'] }], uploadLabel: 'Upload your chest X-ray (PA view preferred)', uploadType: 'xray', maxFiles: 3 },
      { id: 'pneumonia', name: 'Pneumonia Detection', description: 'Detect bacterial and viral pneumonia patterns in chest X-rays using deep learning.', inputs: ['xray'], questions: [{ id: 'q1', label: 'When did your symptoms start?', type: 'select', options: ['Today', '1-3 days ago', '4-7 days ago', '1-2 weeks ago', 'More than 2 weeks ago'] }], uploadLabel: 'Upload your chest X-ray for pneumonia analysis', uploadType: 'xray', maxFiles: 3 },
      { id: 'copd', name: 'COPD Screening', description: 'Chronic Obstructive Pulmonary Disease screening using chest X-ray analysis.', inputs: ['xray'], questions: [{ id: 'q1', label: 'Do you experience shortness of breath?', type: 'select', options: ['Only during intense exercise', 'While walking upstairs', 'While walking on flat ground', 'At rest', 'No'] }], uploadLabel: 'Upload your chest X-ray for COPD analysis', uploadType: 'xray', maxFiles: 3 },
      { id: 'asthma', name: 'Asthma Assessment', description: 'AI-assisted asthma assessment based on symptoms and chest imaging.', inputs: ['xray'], questions: [{ id: 'q1', label: 'How often do you experience breathing difficulties?', type: 'select', options: ['Rarely', 'Monthly', 'Weekly', 'Daily', 'Multiple times a day'] }], uploadLabel: 'Upload chest X-ray if available', uploadType: 'xray', maxFiles: 3 },
    ],
  },
  {
    id: 4,
    name: 'Oncology (disease related to cancer)',
    icon: 'Microscope',
    description: 'AI cancer screening from medical images and scans',
    color: '#E53E3E',
    inputTypes: ['images', 'xray'],
    diseases: [
      { id: 'skin-cancer-onc', name: 'Skin Cancer Screening', description: 'Comprehensive AI analysis of skin lesions for melanoma and non-melanoma skin cancer detection.', inputs: ['images'], questions: [{ id: 'q1', label: 'ABCDE assessment', type: 'checkbox', options: ['Asymmetric shape', 'Border irregularity', 'Color variation', 'Diameter larger than 6mm', 'Evolving/changing'] }], uploadLabel: 'Upload high-resolution images of the suspicious skin lesion', uploadType: 'image', maxFiles: 5 },
      { id: 'lung-cancer', name: 'Lung Cancer Screening', description: 'AI analysis of chest X-rays and CT scans for early lung cancer detection.', inputs: ['xray', 'images'], questions: [{ id: 'q1', label: 'Smoking history', type: 'select', options: ['Never smoked', 'Former smoker (quit 5+ years)', 'Former smoker (quit <5 years)', 'Current smoker (<1 pack/day)', 'Current smoker (1+ pack/day)'] }], uploadLabel: 'Upload chest X-ray or CT scan images', uploadType: 'xray', maxFiles: 5 },
      { id: 'breast-cancer', name: 'Breast Cancer Screening', description: 'AI-assisted analysis of mammograms and breast ultrasound images for early detection.', inputs: ['images', 'xray'], questions: [{ id: 'q1', label: 'What prompted this screening?', type: 'select', options: ['Routine screening', 'Found a lump', 'Breast pain', 'Skin changes on breast', 'Nipple discharge', 'Doctor recommendation'] }], uploadLabel: 'Upload mammogram or breast ultrasound images', uploadType: 'image', maxFiles: 5 },
    ],
  },
];

// Application config exports
export const specialties = departments.map(d => ({
  name: d.name,
  icon: d.icon,
  gradient: `from-[#7e57c2] to-[#4d2c91]`,
}));

export const timeSlots = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
];

// Empty arrays — data comes from backend API
export const tests = [];
export const packages = [];
export const appointments = [];
export const reports = [];
export const doctors = [];
export const doctorAppointments = [];
export const doctorPatients = [];
export const doctorReportsInbox = [];
export const testimonials = [];
export const blogPosts = [];
