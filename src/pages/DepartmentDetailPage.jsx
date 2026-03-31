import { useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { departments } from '../data/mockData';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Upload, X, FileImage, Camera,
  Thermometer, ClipboardList, AlertCircle, Stethoscope, Brain, Eye,
  Bone, HeartPulse, Microscope, Sparkles, Wind, Activity, Shield,
  Heart, Scan, Baby, Send, Loader2, ChevronDown, ChevronUp, ImageIcon
} from 'lucide-react';

const iconMap = { Heart, Brain, Bone, Sparkles, Eye, Baby, Stethoscope, HeartPulse, Scan, Microscope, Activity, Wind };

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 = select disease, 1 = questionnaire, 2 = upload, 3 = review, 4 = submitted
  const [answers, setAnswers] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedDiseases, setExpandedDiseases] = useState({});

  const { isAuthenticated } = useAuth();
  const department = departments.find(d => d.id === parseInt(id));

  const handleDiseaseSelect = (disease) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/patient/book?testId=` + disease.id);
    } else {
      navigate(`/patient/book?testId=` + disease.id);
    }
  };

  const handleAnswerChange = (questionId, value, isCheckbox = false, option = null) => {
    setAnswers(prev => {
      if (isCheckbox) {
        const current = prev[questionId] || [];
        if (current.includes(option)) {
          return { ...prev, [questionId]: current.filter(o => o !== option) };
        } else {
          return { ...prev, [questionId]: [...current, option] };
        }
      }
      return { ...prev, [questionId]: value };
    });
  };

  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!selectedDisease) return;
    const maxFiles = selectedDisease.maxFiles || 5;
    const remaining = maxFiles - uploadedFiles.length;
    const newFiles = files.slice(0, remaining).map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  }, [uploadedFiles, selectedDisease]);

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const target = prev.find(f => f.id === fileId);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission delay — backend ML model will be integrated later
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setCurrentStep(4);
  };

  const resetForm = () => {
    setSelectedDisease(null);
    setCurrentStep(0);
    setAnswers({});
    uploadedFiles.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); });
    setUploadedFiles([]);
  };

  const toggleDiseaseExpand = (diseaseId) => {
    setExpandedDiseases(prev => ({ ...prev, [diseaseId]: !prev[diseaseId] }));
  };

  const answeredQuestions = selectedDisease
    ? selectedDisease.questions.filter(q => {
        const a = answers[q.id];
        if (Array.isArray(a)) return a.length > 0;
        return a !== undefined && a !== '';
      }).length
    : 0;

  const totalQuestions = selectedDisease ? selectedDisease.questions.length : 0;
  const allQuestionsAnswered = answeredQuestions === totalQuestions;

  if (!department) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-text">Department not found</h2>
        <Link to="/departments" className="text-primary mt-4 inline-block">← Back to Departments</Link>
      </div>
    );
  }

  const DeptIcon = iconMap[department.icon] || Stethoscope;

  const steps = ['Select Condition', 'Symptoms & History', 'Upload Data', 'Review & Submit'];

  return (
    <div className="py-12 lg:py-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link to="/departments" className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-8 hover:gap-3 transition-all">
          <ArrowLeft className="w-4 h-4" /> All Departments
        </Link>

        {/* Department Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: department.color + '15' }}>
              <DeptIcon className="w-8 h-8 opacity-80" style={{ color: department.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-text">{department.name}</h1>
              <p className="text-text-muted">{department.description} • {department.diseases.length} conditions available • <span className="text-primary font-semibold">Free</span></p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        {currentStep > 0 && currentStep < 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i + 1 <= currentStep 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'bg-gray-100 text-text-muted'
                    }`}>
                      {i + 1 <= currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className={`text-xs mt-2 font-medium hidden sm:block ${
                      i + 1 <= currentStep ? 'text-primary' : 'text-text-muted'
                    }`}>{step}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 w-12 sm:w-20 lg:w-28 mx-2 rounded-full transition-all ${
                      i + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: Disease Selection */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-text mb-2">Select a Condition</h2>
                <p className="text-text-muted">Choose the condition you'd like our AI to analyze. Each screening is tailored with specific questions and upload requirements.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {department.diseases.map((disease) => (
                  <Card key={disease.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-heading font-bold text-text">{disease.name}</h3>
                        <Badge variant="secondary" className="shrink-0 ml-2">Free</Badge>
                      </div>
                      <p className="text-text-muted text-sm mb-4 leading-relaxed">{disease.description}</p>
                      
                      {/* Input type indicators */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {disease.inputs.map(inp => (
                          <div key={inp} className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                            {inp === 'xray' && <FileImage className="w-3 h-3" />}
                            {inp === 'images' && <Camera className="w-3 h-3" />}
                            {inp === 'readings' && <Thermometer className="w-3 h-3" />}
                            {inp === 'reports' && <Upload className="w-3 h-3" />}
                            {inp === 'xray' ? 'X-Ray Upload' : inp === 'images' ? 'Image Upload' : inp === 'readings' ? 'Readings' : 'Report Upload'}
                          </div>
                        ))}
                        <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-gray-100 px-2.5 py-1 rounded-lg">
                          <ClipboardList className="w-3 h-3" />
                          {disease.questions.length} Questions
                        </div>
                      </div>

                      {/* Expandable details */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleDiseaseExpand(disease.id); }}
                        className="text-xs text-primary font-semibold flex items-center gap-1 mb-3 hover:underline cursor-pointer"
                      >
                        {expandedDiseases[disease.id] ? 'Hide details' : 'Show details'}
                        {expandedDiseases[disease.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <AnimatePresence>
                        {expandedDiseases[disease.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-3"
                          >
                            <div className="bg-background rounded-xl p-4 text-xs text-text-secondary space-y-2">
                              <p className="font-semibold text-text">What you'll need:</p>
                              <ul className="space-y-1">
                                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> Answer {disease.questions.length} symptom & history questions</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> {disease.uploadLabel}</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> Up to {disease.maxFiles} files accepted</li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button
                        onClick={() => handleDiseaseSelect(disease)}
                        className="w-full rounded-xl"
                      >
                        Start Free Screening <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1: Symptom Questionnaire */}
          {currentStep === 1 && selectedDisease && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-xl border-none">
                <div className="flex items-center gap-3 mb-6">
                  <ClipboardList className="w-7 h-7 text-primary" />
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-text">{selectedDisease.name}</h2>
                    <p className="text-text-muted text-sm">Symptom & History Questionnaire • {answeredQuestions}/{totalQuestions} answered</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="space-y-8">
                  {selectedDisease.questions.map((q, idx) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border-light pb-6 last:border-0"
                    >
                      <label className="block text-sm font-semibold text-text mb-3">
                        <span className="text-primary mr-2">Q{idx + 1}.</span>
                        {q.label}
                        {q.type !== 'checkbox' && <span className="text-error ml-1">*</span>}
                      </label>

                      {q.type === 'select' && (
                        <select
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        >
                          <option value="">Select an option...</option>
                          {q.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {q.type === 'checkbox' && (
                        <div className="flex flex-wrap gap-2">
                          {q.options.map(opt => {
                            const checked = (answers[q.id] || []).includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleAnswerChange(q.id, null, true, opt)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                                  checked
                                    ? 'bg-primary text-white border-primary shadow-md'
                                    : 'bg-white text-text-secondary border-border hover:border-primary hover:bg-primary/5'
                                }`}
                              >
                                {checked && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" />}
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'text' && (
                        <input
                          type="text"
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder={q.placeholder || ''}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      )}

                      {q.type === 'textarea' && (
                        <textarea
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder={q.placeholder || ''}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-border-light">
                  <Button variant="ghost" onClick={resetForm}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!allQuestionsAnswered}
                    className="rounded-xl"
                  >
                    Continue to Upload <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: File Upload */}
          {currentStep === 2 && selectedDisease && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-xl border-none">
                <div className="flex items-center gap-3 mb-6">
                  <Upload className="w-7 h-7 text-primary" />
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-text">Upload Your Data</h2>
                    <p className="text-text-muted text-sm">{selectedDisease.uploadLabel}</p>
                  </div>
                </div>

                {/* Upload info */}
                <div className="bg-primary/5 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-text-secondary">
                    <p className="font-semibold text-text mb-1">Upload Guidelines</p>
                    <ul className="space-y-1 list-disc list-inside text-xs">
                      <li>Upload clear, well-lit {selectedDisease.uploadType === 'xray' ? 'X-ray' : selectedDisease.uploadType === 'report' ? 'medical report' : 'image'} files</li>
                      <li>Accepted formats: JPG, PNG, PDF, DICOM</li>
                      <li>Maximum {selectedDisease.maxFiles} files allowed</li>
                      <li>Each file should be under 10MB</li>
                      <li><span className="text-primary font-semibold">Your data is encrypted and deleted after analysis</span></li>
                    </ul>
                  </div>
                </div>

                {/* Drop zone */}
                <label className={`block border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  uploadedFiles.length >= (selectedDisease.maxFiles || 5) 
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                    : 'border-primary/30 hover:border-primary hover:bg-primary/5'
                }`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.dcm"
                    onChange={handleFileUpload}
                    disabled={uploadedFiles.length >= (selectedDisease.maxFiles || 5)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    {selectedDisease.uploadType === 'xray' ? (
                      <FileImage className="w-16 h-16 text-primary/40 mb-4" />
                    ) : selectedDisease.uploadType === 'report' ? (
                      <Upload className="w-16 h-16 text-primary/40 mb-4" />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-primary/40 mb-4" />
                    )}
                    <p className="text-text font-semibold text-lg mb-1">
                      {uploadedFiles.length >= (selectedDisease.maxFiles || 5) ? 'Maximum files reached' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-text-muted text-sm">{uploadedFiles.length} / {selectedDisease.maxFiles} files uploaded</p>
                  </div>
                </label>

                {/* Uploaded files preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-semibold text-text">Uploaded Files</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {uploadedFiles.map(f => (
                        <motion.div
                          key={f.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3 bg-background rounded-xl p-3 border border-border-light"
                        >
                          {f.preview ? (
                            <img src={f.preview} alt={f.name} className="w-14 h-14 object-cover rounded-lg border border-border-light" />
                          ) : (
                            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text truncate">{f.name}</p>
                            <p className="text-xs text-text-muted">{(f.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button
                            onClick={() => removeFile(f.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-border-light">
                  <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="rounded-xl"
                  >
                    Review & Submit <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Review & Submit */}
          {currentStep === 3 && selectedDisease && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-xl border-none">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-7 h-7 text-primary" />
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-text">Review Your Submission</h2>
                    <p className="text-text-muted text-sm">Please review your answers and uploaded files before submitting for AI analysis.</p>
                  </div>
                </div>

                {/* Disease info */}
                <div className="bg-primary/5 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DeptIcon className="w-6 h-6" style={{ color: department.color }} />
                    <div>
                      <p className="font-bold text-text">{selectedDisease.name}</p>
                      <p className="text-xs text-text-muted">{department.name} Department</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">Free</Badge>
                  </div>
                </div>

                {/* Answers review */}
                <div className="mb-6">
                  <h3 className="text-lg font-heading font-bold text-text mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" /> Your Answers
                  </h3>
                  <div className="space-y-3">
                    {selectedDisease.questions.map((q, idx) => {
                      const answer = answers[q.id];
                      const displayAnswer = Array.isArray(answer) ? answer.join(', ') : answer || '—';
                      return (
                        <div key={q.id} className="bg-background rounded-xl p-4">
                          <p className="text-xs text-primary font-semibold mb-1">Q{idx + 1}. {q.label}</p>
                          <p className="text-sm text-text font-medium">{displayAnswer}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Files review */}
                <div className="mb-6">
                  <h3 className="text-lg font-heading font-bold text-text mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" /> Uploaded Files ({uploadedFiles.length})
                  </h3>
                  {uploadedFiles.length === 0 ? (
                    <div className="bg-background rounded-xl p-4 text-center text-text-muted text-sm">
                      No files uploaded (optional for some conditions)
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {uploadedFiles.map(f => (
                        <div key={f.id} className="bg-background rounded-xl p-3 text-center">
                          {f.preview ? (
                            <img src={f.preview} alt={f.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                          ) : (
                            <div className="w-full h-24 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                              <Upload className="w-8 h-8 text-primary/50" />
                            </div>
                          )}
                          <p className="text-xs text-text truncate">{f.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Privacy notice */}
                <div className="bg-emerald-50 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-800">
                    <p className="font-semibold mb-1">Privacy & Security</p>
                    <p className="text-xs">Your data is encrypted during transmission and will be automatically deleted after analysis. We do not store your medical data permanently.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-border-light">
                  <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="rounded-xl px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Submit for AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: Submission Confirmation */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-12 shadow-xl border-none text-center max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                <h2 className="text-3xl font-heading font-black text-text mb-4">Submission Received!</h2>
                <p className="text-text-muted text-lg mb-2">
                  Your <span className="font-semibold text-text">{selectedDisease?.name}</span> screening data has been submitted.
                </p>
                <p className="text-text-muted text-sm mb-8">
                  Our AI model will analyze your inputs and generate a detailed report. This feature is currently being integrated — you'll receive your results once the ML model is connected.
                </p>

                <div className="bg-primary/5 rounded-2xl p-6 mb-8 text-left">
                  <h4 className="font-semibold text-text mb-3">What happens next?</h4>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      Your symptoms and uploaded data are sent to our AI analysis pipeline
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      The trained ML model will process your inputs for disease prediction
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      You'll receive a detailed analysis report with risk assessment
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-amber-700 font-medium">Note: AI predictions are supplementary — always consult a qualified doctor for medical decisions</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetForm} className="rounded-xl">
                    Screen Another Condition
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/departments')} className="rounded-xl">
                    Browse Departments
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
