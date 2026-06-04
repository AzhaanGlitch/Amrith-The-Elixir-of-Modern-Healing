import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, AlertTriangle, Info, ArrowRight, HeartPulse, Activity, CheckCircle, Download, ShieldAlert, Pill } from 'lucide-react';
import { Card, Button } from '../ui';

export default function AITriageResult({ testId, inputType, answers, uploadedFiles, onProceed, onReset }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchTriageResult = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('amrith_token');
        if (!token) {
          throw new Error('User authentication token not found. Please log in.');
        }

        // Build FormData payload
        const formData = new FormData();
        formData.append('testId', testId);
        formData.append('inputType', inputType || 'TABULAR');
        formData.append('answers', JSON.stringify(answers));

        if (uploadedFiles && uploadedFiles.length > 0) {
          uploadedFiles.forEach((fileObj) => {
            if (fileObj.file) {
              formData.append('files', fileObj.file);
            }
          });
        }

        const response = await fetch('http://localhost:5000/api/ml/predict', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to generate diagnostic prediction.');
        }

        const data = await response.json();
        
        if (data.success) {
          setResult(data);
        } else {
          throw new Error('Backend returned unsuccessful prediction.');
        }
      } catch (err) {
        console.error('AI Triage Fetch Error:', err);
        setError(err.message || 'An unexpected error occurred during prediction.');
      } finally {
        setLoading(false);
      }
    };

    fetchTriageResult();
  }, [testId, inputType, answers, uploadedFiles]);

  // Download triage report
  const handleDownloadReport = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const token = localStorage.getItem('amrith_token');
      const response = await fetch('http://localhost:5000/api/reports/download-triage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prediction: result.prediction,
          confidence: result.confidence,
          riskLevel: result.riskLevel,
          details: result.details,
          modelVersion: result.modelVersion,
        }),
      });

      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `amrith-triage-report-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <HeartPulse className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-text mb-2">Analyzing Clinical Data</h3>
        <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
          Amrith's ML model is processing your medical indicators, checklist answers, and file attachments to generate a precision diagnostic result...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto py-8 text-center"
      >
        <Card className="p-8 border border-red-200 bg-red-50 rounded-2xl" hover={false}>
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-800 mb-2">Triage Analysis Failed</h3>
          <p className="text-red-700 text-sm mb-6 leading-relaxed">
            {error}
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={onReset} variant="outline" className="px-6 rounded-xl">
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()} className="px-6 rounded-xl">
              Retry Connection
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Formatting risk visual states
  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'Critical':
        return {
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          circleColor: 'rgb(220, 38, 38)',
          badgeBg: 'bg-red-600',
        };
      case 'High':
        return {
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          circleColor: 'rgb(234, 88, 12)',
          badgeBg: 'bg-orange-600',
        };
      case 'Moderate':
        return {
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          circleColor: 'rgb(217, 119, 6)',
          badgeBg: 'bg-amber-600',
        };
      default:
        return {
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          circleColor: 'rgb(5, 150, 105)',
          badgeBg: 'bg-emerald-600',
        };
    }
  };

  const riskStyle = getRiskStyle(result.riskLevel);
  const confidence = result.confidence || 50;

  // Circular progress SVG values
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-4"
    >
      <Card className="p-8 border border-border-light shadow-xl relative overflow-hidden rounded-2xl bg-white" hover={false}>
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-light pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border ${riskStyle.border}`}>
                <ShieldCheck className={`w-5 h-5 ${riskStyle.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-black text-text">AI Clinical Diagnosis</h3>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Precision Screening Completed</p>
              </div>
            </div>
            {result.fallback && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 border border-amber-300 text-amber-700 animate-pulse">
                Heuristic Fallback
              </span>
            )}
          </div>

          {/* Results Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Visual Risk Ring */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-gray-200"
                    strokeWidth={stroke}
                    stroke="currentColor"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  <motion.circle
                    className="transition-all duration-1000 ease-out"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    stroke={riskStyle.circleColor}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-text leading-none">{confidence}%</span>
                  <span className="text-[9px] font-bold text-text-muted uppercase mt-0.5">Confidence</span>
                </div>
              </div>
              <span className={`mt-3 text-sm font-black uppercase tracking-wider px-3 py-1 rounded-full text-white ${riskStyle.badgeBg} shadow-sm`}>
                {result.riskLevel} Risk
              </span>
            </div>

            {/* AI Diagnosis Details */}
            <div className="col-span-1 sm:col-span-2 space-y-2">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Top Detected Condition</div>
              <h4 className="text-xl font-black text-text leading-tight">
                {result.prediction}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed font-medium">
                Our model indicates a {confidence}% probability match with the clinical symptoms submitted.
              </p>
            </div>
          </div>

          {/* Tabular Differential Diagnoses (General Medicine List) */}
          {result.details && result.details.top_predictions && result.details.top_predictions.length > 0 && (
            <div className="space-y-3 bg-background-alt p-5 rounded-2xl border border-border-light shadow-inner">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-primary" />
                Differential Diagnostic Distribution
              </div>
              <div className="space-y-2.5">
                {result.details.top_predictions.slice(0, 3).map((pred, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text">
                      <span className="truncate pr-2">{pred.disease}</span>
                      <span className="shrink-0">{pred.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.confidence}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="bg-primary h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Recommendations */}
          {result.details && result.details.recommendations && result.details.recommendations.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Immediate Action Recommendations
              </div>
              <div className="grid gap-2">
                {result.details.recommendations.map((rec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex gap-2.5 items-start p-3 bg-background-alt border border-border-light rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-text-secondary leading-normal">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* AI-Generated Insights Grid */}
          {result.details && ((result.details.ai_precautions && result.details.ai_precautions.length > 0) || 
                             (result.details.ai_medications && result.details.ai_medications.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Precautions Column */}
              {result.details.ai_precautions && result.details.ai_precautions.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    AI-Suggested Safety Precautions
                  </div>
                  <div className="grid gap-2">
                    {result.details.ai_precautions.map((prec, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex gap-2.5 items-start p-3 bg-amber-50/50 border border-amber-100 rounded-xl"
                      >
                        <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-text-secondary leading-normal">{prec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications Column */}
              {result.details.ai_medications && result.details.ai_medications.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-500" />
                    AI-Suggested Medications
                  </div>
                  <div className="grid gap-2">
                    {result.details.ai_medications.map((med, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex gap-2.5 items-start p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-text-secondary leading-normal">{med}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}


          {/* Medical Disclaimer Banner */}
          <div className="bg-background-alt rounded-xl p-4 border border-border-light flex gap-3 items-start">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-black text-text block">AI Screening Disclaimer</span>
              <p className="text-[10px] text-text-muted leading-relaxed font-medium">
                This is an automated machine learning screening tool designed for initial triage and clinical routing. It is not an official clinical diagnosis or a replacement for emergency professional care. Please consult a registered physician to analyze these results.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              onClick={() => onProceed(result)} 
              className="flex-[2] h-13 rounded-xl text-sm font-bold tracking-wide group bg-primary hover:bg-primary-dark shadow-md shadow-primary/20 hover:shadow-lg transition-all"
            >
              Proceed to Booking
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownloadReport}
              disabled={downloading}
              className="flex-1 h-13 rounded-xl text-sm font-bold transition-all"
            >
              <Download className="w-4 h-4 mr-1" />
              {downloading ? 'Preparing...' : 'Download Report'}
            </Button>
            <Button 
              variant="ghost"
              onClick={onReset} 
              className="flex-1 h-13 rounded-xl text-sm font-bold text-text-muted hover:text-text hover:bg-background-alt transition-all"
            >
              Screen Another
            </Button>
          </div>
        </div>

        {/* Premium blur decorations */}
        <div className="absolute top-[-25%] right-[-15%] w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-25%] left-[-15%] w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </Card>
    </motion.div>
  );
}
