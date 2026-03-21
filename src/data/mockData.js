// Mock data for the Amrith MedTech platform

export const departments = [
  { id: 1, name: 'Cardiology', icon: 'Heart', description: 'Heart & cardiovascular care', testsCount: 24, color: '#E53E3E' },
  { id: 2, name: 'Neurology', icon: 'Brain', description: 'Brain & nervous system', testsCount: 18, color: '#805AD5' },
  { id: 3, name: 'Orthopedics', icon: 'Bone', description: 'Bones, joints & muscles', testsCount: 15, color: '#DD6B20' },
  { id: 4, name: 'Dermatology', icon: 'Sparkles', description: 'Skin, hair & nail care', testsCount: 12, color: '#D69E2E' },
  { id: 5, name: 'Ophthalmology', icon: 'Eye', description: 'Eye & vision care', testsCount: 10, color: '#3182CE' },
  { id: 6, name: 'Pediatrics', icon: 'Baby', description: 'Child healthcare', testsCount: 20, color: '#38B2AC' },
  { id: 7, name: 'General Medicine', icon: 'Stethoscope', description: 'Primary care & wellness', testsCount: 30, color: '#006D77' },
  { id: 8, name: 'Gynecology', icon: 'HeartPulse', description: "Women's health & fertility", testsCount: 16, color: '#ED64A6' },
  { id: 9, name: 'Radiology', icon: 'Scan', description: 'Imaging & diagnostics', testsCount: 22, color: '#4A5568' },
  { id: 10, name: 'Pathology', icon: 'Microscope', description: 'Lab tests & blood work', testsCount: 45, color: '#2D3748' },
  { id: 11, name: 'Endocrinology', icon: 'Activity', description: 'Hormones & metabolism', testsCount: 14, color: '#9F7AEA' },
  { id: 12, name: 'Pulmonology', icon: 'Wind', description: 'Lungs & respiratory care', testsCount: 11, color: '#4FD1C5' },
];

export const tests = [
  { id: 1, departmentId: 10, name: 'Complete Blood Count (CBC)', price: 399, originalPrice: 599, description: 'Comprehensive blood analysis including RBC, WBC, Hemoglobin, Platelets, and more.', homeCollection: true, fasting: false, reportTime: '6 hours', popular: true },
  { id: 2, departmentId: 10, name: 'Lipid Profile', price: 499, originalPrice: 799, description: 'Complete cholesterol panel — Total, LDL, HDL, VLDL, Triglycerides.', homeCollection: true, fasting: true, reportTime: '8 hours', popular: true },
  { id: 3, departmentId: 10, name: 'Thyroid Function Test (TFT)', price: 599, originalPrice: 899, description: 'TSH, T3, T4 — Complete thyroid health assessment.', homeCollection: true, fasting: false, reportTime: '12 hours', popular: true },
  { id: 4, departmentId: 10, name: 'HbA1c (Glycated Hemoglobin)', price: 449, originalPrice: 699, description: 'Average blood sugar over 3 months. Essential for diabetes management.', homeCollection: true, fasting: false, reportTime: '6 hours', popular: false },
  { id: 5, departmentId: 10, name: 'Liver Function Test (LFT)', price: 549, originalPrice: 849, description: 'SGOT, SGPT, Bilirubin & more — Comprehensive liver health panel.', homeCollection: true, fasting: true, reportTime: '8 hours', popular: false },
  { id: 6, departmentId: 10, name: 'Kidney Function Test (KFT)', price: 549, originalPrice: 799, description: 'Creatinine, BUN, Uric Acid — Complete renal panel.', homeCollection: true, fasting: false, reportTime: '8 hours', popular: false },
  { id: 7, departmentId: 1, name: 'ECG (Electrocardiogram)', price: 299, originalPrice: 499, description: '12-lead ECG to check heart rhythm and electrical activity.', homeCollection: false, fasting: false, reportTime: '30 minutes', popular: true },
  { id: 8, departmentId: 1, name: '2D Echocardiography', price: 1999, originalPrice: 2999, description: 'Ultrasound imaging of heart structure and function.', homeCollection: false, fasting: false, reportTime: '1 hour', popular: true },
  { id: 9, departmentId: 1, name: 'Cardiac Stress Test (TMT)', price: 1499, originalPrice: 2499, description: 'Treadmill test to evaluate heart performance under exercise stress.', homeCollection: false, fasting: false, reportTime: '2 hours', popular: false },
  { id: 10, departmentId: 9, name: 'Chest X-Ray', price: 349, originalPrice: 599, description: 'Digital X-ray imaging of chest, lungs, heart, and airways.', homeCollection: false, fasting: false, reportTime: '1 hour', popular: true },
  { id: 11, departmentId: 9, name: 'MRI Brain', price: 4999, originalPrice: 7999, description: 'High-resolution magnetic resonance imaging of the brain.', homeCollection: false, fasting: false, reportTime: '24 hours', popular: false },
  { id: 12, departmentId: 9, name: 'CT Scan Abdomen', price: 3999, originalPrice: 5999, description: 'Detailed computed tomography imaging of the abdomen.', homeCollection: false, fasting: true, reportTime: '24 hours', popular: false },
  { id: 13, departmentId: 7, name: 'Full Body Health Checkup', price: 2499, originalPrice: 4999, description: 'Comprehensive health screening — 70+ tests covering all major organs.', homeCollection: true, fasting: true, reportTime: '48 hours', popular: true },
  { id: 14, departmentId: 7, name: 'Vitamin D Test', price: 599, originalPrice: 899, description: 'Measure 25-hydroxy vitamin D levels in blood.', homeCollection: true, fasting: false, reportTime: '12 hours', popular: true },
  { id: 15, departmentId: 7, name: 'Vitamin B12 Test', price: 549, originalPrice: 799, description: 'Assess vitamin B12 (cobalamin) levels for nerve and blood health.', homeCollection: true, fasting: false, reportTime: '12 hours', popular: false },
  { id: 16, departmentId: 11, name: 'Insulin Fasting', price: 599, originalPrice: 899, description: 'Fasting insulin levels to evaluate insulin resistance.', homeCollection: true, fasting: true, reportTime: '12 hours', popular: false },
  { id: 17, departmentId: 8, name: 'Pap Smear', price: 799, originalPrice: 1299, description: 'Cervical cancer screening test.', homeCollection: false, fasting: false, reportTime: '72 hours', popular: true },
  { id: 18, departmentId: 5, name: 'Comprehensive Eye Exam', price: 699, originalPrice: 999, description: 'Complete vision and eye health assessment.', homeCollection: false, fasting: false, reportTime: '30 minutes', popular: true },
];

export const packages = [
  { id: 1, name: 'Essential Health Package', tests: [1, 2, 3, 5, 6], price: 1999, originalPrice: 3799, description: 'Our most popular package — CBC, Lipid, Thyroid, Liver, and Kidney panels.', badge: 'Best Seller' },
  { id: 2, name: 'Heart Care Package', tests: [1, 2, 7, 8], price: 2499, originalPrice: 4299, description: 'Complete cardiac evaluation with blood work, ECG, and Echo.', badge: 'Recommended' },
  { id: 3, name: 'Diabetes Wellness Package', tests: [1, 2, 4, 6, 16], price: 1799, originalPrice: 3199, description: 'Comprehensive diabetes monitoring — CBC, Lipid, HbA1c, KFT, Insulin.', badge: null },
  { id: 4, name: 'Women\'s Health Package', tests: [1, 2, 3, 17, 14], price: 2299, originalPrice: 3999, description: 'Tailored for women — Blood work, Thyroid, Pap Smear, Vitamin D.', badge: 'Popular' },
];

export const specialties = [
  { name: 'Heart Care', icon: 'Heart', gradient: 'from-[#7e57c2] to-[#4d2c91]' },
  { name: 'Brain & Spine', icon: 'Brain', gradient: 'from-[#8c9eff] to-[#5870cb]' },
  { name: 'Bone & Joint', icon: 'Bone', gradient: 'from-[#b085f5] to-[#7e57c2]' },
  { name: 'Skin Care', icon: 'Sparkles', gradient: 'from-[#e1bee7] to-[#b085f5]' },
  { name: 'Eye Care', icon: 'Eye', gradient: 'from-[#c0cfff] to-[#8c9eff]' },
  { name: 'Child Health', icon: 'Baby', gradient: 'from-[#a280df] to-[#4d2c91]' },
  { name: 'Lab Tests', icon: 'Microscope', gradient: 'from-[#d3c0ff] to-[#8c9eff]' },
  { name: 'Wellness', icon: 'Leaf', gradient: 'from-[#7e57c2] to-[#b085f5]' },
  { name: 'Women', icon: 'HeartPulse', gradient: 'from-[#e6d4fa] to-[#a280df]' },
  { name: 'Imaging', icon: 'Scan', gradient: 'from-[#8c9eff] to-[#b085f5]' },
];

export const testimonials = [
  { id: 1, name: 'Priya Sharma', role: 'Patient', text: 'Amrith made booking my annual checkup incredibly easy. The home sample collection was punctual and professional. Reports were available the same day!', rating: 5, avatar: 'PS' },
  { id: 2, name: 'Dr. Rajesh Kumar', role: 'Doctor', text: 'As a physician, I appreciate how Amrith streamlines my workflow. Patient reports are organized, and the dashboard keeps me on top of my schedule.', rating: 5, avatar: 'RK' },
  { id: 3, name: 'Ananya Gupta', role: 'Patient', text: 'The prices are transparent and affordable. I saved 50% on my family\'s health packages compared to going directly to the lab. Highly recommend!', rating: 5, avatar: 'AG' },
  { id: 4, name: 'Vikram Patel', role: 'Patient', text: 'I was skeptical about online health platforms, but Amrith\'s attention to detail and quality won me over. The AI health summaries are a game-changer.', rating: 4, avatar: 'VP' },
];

export const timeSlots = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
];

export const appointments = [
  { id: 1, testName: 'Complete Blood Count (CBC)', date: '2026-03-20', time: '09:00 AM', status: 'upcoming', type: 'Lab Test', location: 'Home Collection', price: 399 },
  { id: 2, testName: 'Lipid Profile', date: '2026-03-20', time: '09:00 AM', status: 'upcoming', type: 'Lab Test', location: 'Home Collection', price: 499 },
  { id: 3, testName: '2D Echocardiography', date: '2026-03-22', time: '11:00 AM', status: 'upcoming', type: 'Diagnostic', location: 'Amrith Lab, Koramangala', price: 1999 },
  { id: 4, testName: 'Thyroid Function Test', date: '2026-03-10', time: '10:00 AM', status: 'completed', type: 'Lab Test', location: 'Home Collection', price: 599 },
  { id: 5, testName: 'Full Body Checkup', date: '2026-02-15', time: '08:00 AM', status: 'completed', type: 'Package', location: 'Amrith Lab, HSR Layout', price: 2499 },
  { id: 6, testName: 'Vitamin D Test', date: '2026-03-05', time: '02:00 PM', status: 'cancelled', type: 'Lab Test', location: 'Home Collection', price: 599 },
];

export const reports = [
  { id: 1, testName: 'Complete Blood Count (CBC)', date: '2026-03-10', status: 'normal', doctor: 'Dr. Meera Iyer', summary: 'All values within normal range. Hemoglobin 14.2 g/dL, WBC 7200/μL.', pdfUrl: '#' },
  { id: 2, testName: 'Thyroid Function Test', date: '2026-03-10', status: 'attention', doctor: 'Dr. Suresh Nair', summary: 'TSH slightly elevated at 5.8 mIU/L. T3 and T4 within normal limits. Follow-up recommended.', pdfUrl: '#' },
  { id: 3, testName: 'Lipid Profile', date: '2026-02-15', status: 'normal', doctor: 'Dr. Meera Iyer', summary: 'Total Cholesterol 185 mg/dL. LDL 110, HDL 52. Triglycerides 115. Good overall profile.', pdfUrl: '#' },
  { id: 4, testName: 'Full Body Health Checkup', date: '2026-02-15', status: 'normal', doctor: 'Dr. Anjali Verma', summary: 'Comprehensive checkup completed. 68 out of 70 parameters normal. Minor Vitamin D deficiency noted.', pdfUrl: '#' },
];

export const doctorAppointments = [
  { id: 1, patientName: 'Priya Sharma', age: 32, type: 'Follow-up', time: '09:00 AM', status: 'waiting', notes: 'Thyroid follow-up' },
  { id: 2, patientName: 'Arjun Mehta', age: 45, type: 'New Consultation', time: '09:30 AM', status: 'in-progress', notes: 'Chest pain evaluation' },
  { id: 3, patientName: 'Lakshmi Devi', age: 58, type: 'Follow-up', time: '10:00 AM', status: 'scheduled', notes: 'Diabetes management' },
  { id: 4, patientName: 'Rohit Verma', age: 27, type: 'New Consultation', time: '10:30 AM', status: 'scheduled', notes: 'Chronic fatigue' },
  { id: 5, patientName: 'Sakshi Kapoor', age: 38, type: 'Report Review', time: '11:00 AM', status: 'scheduled', notes: 'MRI Brain results discussion' },
];

export const doctorPatients = [
  { id: 1, name: 'Priya Sharma', age: 32, gender: 'Female', lastVisit: '2026-03-15', condition: 'Hypothyroidism', phone: '+91 98765 43210' },
  { id: 2, name: 'Arjun Mehta', age: 45, gender: 'Male', lastVisit: '2026-03-18', condition: 'Hypertension', phone: '+91 87654 32109' },
  { id: 3, name: 'Lakshmi Devi', age: 58, gender: 'Female', lastVisit: '2026-03-12', condition: 'Type 2 Diabetes', phone: '+91 76543 21098' },
  { id: 4, name: 'Rohit Verma', age: 27, gender: 'Male', lastVisit: '2026-03-18', condition: 'Under Investigation', phone: '+91 65432 10987' },
  { id: 5, name: 'Sakshi Kapoor', age: 38, gender: 'Female', lastVisit: '2026-03-10', condition: 'Migraine', phone: '+91 54321 09876' },
  { id: 6, name: 'Deepak Joshi', age: 62, gender: 'Male', lastVisit: '2026-03-01', condition: 'COPD', phone: '+91 43210 98765' },
];

export const doctorReportsInbox = [
  { id: 1, patientName: 'Priya Sharma', testName: 'Thyroid Function Test', date: '2026-03-17', status: 'pending', urgent: false },
  { id: 2, patientName: 'Arjun Mehta', testName: 'Cardiac Stress Test', date: '2026-03-17', status: 'pending', urgent: true },
  { id: 3, patientName: 'Lakshmi Devi', testName: 'HbA1c', date: '2026-03-16', status: 'reviewed', urgent: false },
  { id: 4, patientName: 'Sakshi Kapoor', testName: 'MRI Brain', date: '2026-03-16', status: 'pending', urgent: true },
];

export const blogPosts = [
  { id: 1, title: '10 Warning Signs Your Heart Needs Attention', category: 'Heart Health', readTime: '5 min', date: 'Mar 15, 2026', excerpt: 'Learn the critical warning signs that indicate your heart may need medical evaluation. Early detection saves lives.' },
  { id: 2, title: 'Understanding Your Blood Test Results', category: 'Lab Tests', readTime: '8 min', date: 'Mar 12, 2026', excerpt: 'A comprehensive guide to interpreting common blood test parameters like CBC, LFT, and KFT.' },
  { id: 3, title: 'The Importance of Annual Health Checkups', category: 'Wellness', readTime: '4 min', date: 'Mar 10, 2026', excerpt: 'Why preventive health screenings are your best investment. See what tests you should be getting at every age.' },
  { id: 4, title: 'Managing Thyroid Disorders: A Complete Guide', category: 'Endocrinology', readTime: '7 min', date: 'Mar 8, 2026', excerpt: 'Everything you need to know about hypothyroidism, hyperthyroidism, and how to manage your thyroid health.' },
  { id: 5, title: 'Vitamin D Deficiency: The Silent Epidemic', category: 'Nutrition', readTime: '6 min', date: 'Mar 5, 2026', excerpt: 'Over 75% of Indians are Vitamin D deficient. Learn about symptoms, testing, and treatment options.' },
  { id: 6, title: 'Diabetes Prevention: Lifestyle Changes That Work', category: 'Diabetes', readTime: '6 min', date: 'Mar 1, 2026', excerpt: 'Evidence-based lifestyle modifications to prevent Type 2 Diabetes and manage prediabetes effectively.' },
];
