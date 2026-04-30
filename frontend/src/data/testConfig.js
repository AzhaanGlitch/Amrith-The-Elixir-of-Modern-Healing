/**
 * Test Configuration Mapping for Amrith AI
 * Categories: IMAGE, TABULAR, HYBRID
 */

export const testConfigs = {
  // General Medicine
  'fever': {
    inputType: 'TABULAR',
    questions: [
      { id: 'temp', label: 'Current body temperature (°F/°C)', type: 'number', placeholder: 'e.g. 101.5' },
      { id: 'duration', label: 'How many days have you had symptoms?', type: 'number', placeholder: 'e.g. 3' },
      { id: 'cough', label: 'Do you have a cough?', type: 'select', options: ['None', 'Dry', 'Productive'] },
      { id: 'throat', label: 'Are you experiencing a sore or scratchy throat?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'nasal', label: 'Runny nose, stuffy nose, or sinus pressure?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'aches', label: 'Body aches or generalized pain? (1-5)', type: 'number', min: 1, max: 5 },
      { id: 'chills', label: 'Sudden chills or night sweats?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'fatigue', label: 'Overall energy level (1-5: 1 normal, 5 bedridden)', type: 'number', min: 1, max: 5 }
    ]
  },
  'cold': {
    inputType: 'TABULAR',
    questions: [
      { id: 'temp', label: 'Current body temperature (°F/°C)', type: 'number', placeholder: 'e.g. 99.0' },
      { id: 'duration', label: 'How many days have you had symptoms?', type: 'number' },
      { id: 'cough', label: 'Do you have a cough?', type: 'select', options: ['None', 'Dry', 'Productive'] },
      { id: 'throat', label: 'Are you experiencing a sore or scratchy throat?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'nasal', label: 'Runny/stuffy nose?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'aches', label: 'Body aches? (1-5)', type: 'number', min: 1, max: 5 },
      { id: 'fatigue', label: 'Energy level (1-5)', type: 'number', min: 1, max: 5 }
    ]
  },
  'sinus': { inputType: 'HYBRID', questions: [{ id: 'pressure', label: 'Facial pain or pressure?', type: 'radio', options: ['Yes', 'No'] }] },
  'tonsillitis': { inputType: 'IMAGE' },
  'allergies': { inputType: 'TABULAR', questions: [{ id: 'trigger', label: 'Known trigger?', type: 'text' }] },

  // Cardiovascular
  'hypertension': { inputType: 'TABULAR', questions: [{ id: 'bp', label: 'Blood Pressure', type: 'text' }] },
  'heart-failure': {
    inputType: 'TABULAR',
    questions: [
      { id: 'age', label: 'What is your age?', type: 'number' },
      { id: 'gender', label: 'Biological Sex', type: 'select', options: ['Male', 'Female'] },
      { id: 'bp_sys', label: 'Resting Blood Pressure (Systolic)', type: 'number' },
      { id: 'bp_dia', label: 'Resting Blood Pressure (Diastolic)', type: 'number' },
      { id: 'chest_pain', label: 'Chest Pain Type', type: 'select', options: ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'None'] },
      { id: 'sob', label: 'Shortness of breath during routine activities?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'edema', label: 'Swelling in legs, ankles, or feet?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'fatigue', label: 'Fatigue level after minimal exertion (1-5)', type: 'number', min: 1, max: 5 },
      { id: 'palpitations', label: 'Heart racing or fluttering at rest?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'history', label: 'History of high cholesterol or diabetes?', type: 'checkbox', options: ['High Cholesterol', 'Diabetes', 'None'] }
    ]
  },
  'arrhythmia': { inputType: 'HYBRID', questions: [{ id: 'rate', label: 'Resting heart rate', type: 'number' }] },

  // Dermatology
  'skin-cancer': { inputType: 'IMAGE' },
  'fungal-infection': { inputType: 'IMAGE' },
  'eczema': { inputType: 'IMAGE' },
  'psoriasis': { inputType: 'IMAGE' },

  // Orthopedics
  'fracture': { inputType: 'IMAGE' },
  'dislocation': { inputType: 'IMAGE' },
  'arthritis': { inputType: 'IMAGE' },
  'osteoporosis': { inputType: 'IMAGE' },

  // Neurology
  'headache': {
    inputType: 'TABULAR',
    questions: [
      { id: 'intensity', label: 'Pain Intensity (1-10)', type: 'number', min: 1, max: 10 },
      { id: 'location', label: 'Pain Location', type: 'select', options: ['One side', 'Both sides', 'Front', 'Back', 'Behind eyes'] },
      { id: 'quality', label: 'Pain Quality', type: 'select', options: ['Throbbing/Pulsating', 'Dull ache', 'Sharp/Stabbing', 'Tight band-like'] },
      { id: 'aura', label: 'Visual disturbances or tingling before it starts?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'sensitivity', label: 'Light or sound makes it worse?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'nausea', label: 'Feeling nauseous or vomited?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'duration', label: 'Typical duration without medication', type: 'select', options: ['<4 hours', '4-72 hours', '>72 hours'] },
      { id: 'activity', label: 'Physical activity worsens the pain?', type: 'radio', options: ['Yes', 'No'] }
    ]
  },
  'parkinsons': { inputType: 'TABULAR', questions: [{ id: 'tremor', label: 'Do you have tremors?', type: 'radio', options: ['Yes', 'No'] }] },
  'seizures': { inputType: 'TABULAR', questions: [{ id: 'frequency', label: 'Seizure frequency', type: 'text' }] },
  'stroke-risk': { inputType: 'TABULAR', questions: [{ id: 'numbness', label: 'Sudden numbness?', type: 'radio', options: ['Yes', 'No'] }] },

  // Ophthalmology
  'myopia': { inputType: 'IMAGE' },
  'diabetic-retinopathy': { inputType: 'IMAGE' },
  'glaucoma': { inputType: 'IMAGE' },
  'cataracts': { inputType: 'IMAGE' },

  // Pulmonology
  'tuberculosis': { inputType: 'IMAGE' },
  'pneumonia': { inputType: 'IMAGE' },
  'copd': {
    inputType: 'TABULAR',
    questions: [
      { id: 'sob', label: 'How often do you feel short of breath?', type: 'select', options: ['Never', 'During exercise', 'Walking normally', 'At rest'] },
      { id: 'wheezing', label: 'Whistling/squeaky sound in chest?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'tightness', label: 'Feeling of tightness or pressure in chest?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'night', label: 'How often breathing issues wake you up at night?', type: 'select', options: ['Never', '1-2 times a month', 'Weekly', 'Nightly'] },
      { id: 'smoking', label: 'Ever smoked regularly or currently smoke?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'cough', label: 'Persistent cough, especially in morning?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'sputum', label: 'Regularly bring up phlegm/mucus?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'triggers', label: 'Worsen when exposed to cold air/dust/pollen?', type: 'radio', options: ['Yes', 'No'] }
    ]
  },
  'asthma': {
    inputType: 'TABULAR',
    questions: [
      { id: 'sob', label: 'How often do you feel short of breath?', type: 'select', options: ['Never', 'During exercise', 'Walking normally', 'At rest'] },
      { id: 'wheezing', label: 'Whistling/squeaky sound in chest?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'tightness', label: 'Feeling of tightness or pressure in chest?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'night', label: 'How often breathing issues wake you up at night?', type: 'select', options: ['Never', '1-2 times a month', 'Weekly', 'Nightly'] },
      { id: 'smoking', label: 'Ever smoked regularly or currently smoke?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'cough', label: 'Persistent cough?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'sputum', label: 'Regularly bring up phlegm/mucus?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'triggers', label: 'Worsen when exposed to triggers (cold air/dust/pollen)?', type: 'radio', options: ['Yes', 'No'] }
    ]
  },

  // Oncology
  'skin-cancer-onc': { inputType: 'IMAGE' },
  'lung-cancer': { inputType: 'HYBRID', questions: [{ id: 'smoker', label: 'Current smoker?', type: 'radio', options: ['Yes', 'No'] }] },
  'breast-cancer': { inputType: 'IMAGE' }
};
