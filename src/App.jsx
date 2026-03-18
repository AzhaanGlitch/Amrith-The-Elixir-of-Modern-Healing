import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';

// Public Pages
import HomePage from './pages/HomePage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PackagesPage from './pages/PackagesPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookingPage from './pages/patient/BookingPage';
import PatientDepartmentsPage from './pages/patient/PatientDepartmentsPage';
import AppointmentsPage from './pages/patient/AppointmentsPage';
import ReportsPage from './pages/patient/ReportsPage';
import PatientProfilePage from './pages/patient/ProfilePage';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import DoctorReportsPage from './pages/doctor/DoctorReportsPage';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:id" element={<DepartmentDetailPage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Patient Protected Routes */}
            <Route element={
              <ProtectedRoute allowedRole="patient">
                <PatientLayout />
              </ProtectedRoute>
            }>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/book" element={<BookingPage />} />
              <Route path="/patient/departments" element={<PatientDepartmentsPage />} />
              <Route path="/patient/appointments" element={<AppointmentsPage />} />
              <Route path="/patient/reports" element={<ReportsPage />} />
              <Route path="/patient/profile" element={<PatientProfilePage />} />
            </Route>

            {/* Doctor Protected Routes */}
            <Route element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorLayout />
              </ProtectedRoute>
            }>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
              <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="/doctor/reports" element={<DoctorReportsPage />} />
              <Route path="/doctor/profile" element={<DoctorProfilePage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
