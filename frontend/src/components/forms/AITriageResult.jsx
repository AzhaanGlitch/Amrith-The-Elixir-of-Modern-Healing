import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  // Helper utility to convert a File object to a clean base64 data string
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const token = localStorage.getItem('amrith_token');
      
      // Extract base64 image data directly from client state variables if present
      let clientSideImageBase64 = null;
      if (uploadedFiles && uploadedFiles.length > 0) {
        const structuralFileObj = uploadedFiles.find(f => f.file || f.preview);
        if (structuralFileObj && structuralFileObj.file) {
          try {
            clientSideImageBase64 = await getBase64(structuralFileObj.file);
          } catch (e) {
            console.error('Error parsing uploaded image to base64 context:', e);
          }
        } else if (structuralFileObj && structuralFileObj.preview) {
          clientSideImageBase64 = structuralFileObj.preview;
        }
      }

      // Merge image data safely into payload details wrapper
      const trackingDetails = {
        ...(result.details || {}),
        uploadedImageBase64: clientSideImageBase64 || result.details?.uploadedImageBase64 || null
      };

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
          details: trackingDetails,
          modelVersion: result.modelVersion,
        }),
      });

      if (!response.ok) throw new Error('Download execution routing rejected by system server.');
      
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
      console.error('Download processing failure:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-8 border border-black bg-white p-12 text-center select-none !rounded-none">
        <div className="inline-block w-8 h-8 border-2 border-[#4d2c91] border-t-transparent animate-spin mb-4 !rounded-none"></div>
        <div className="font-mono text-xs uppercase tracking-widest text-black mb-1">
          [ PIPELINE_RUN: CORE_ML_PARSE ]
        </div>
        <h3 className="text-md font-bold text-black uppercase tracking-wider">Analyzing Patient Metrics</h3>
        <p className="text-gray-500 text-xs max-w-xs mx-auto mt-2 leading-relaxed">
          Evaluating structural datasets, historical alignment models, and multi-spectral parameters.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-8 border border-black bg-white p-8 !rounded-none">
        <div className="text-xs font-mono text-black font-bold uppercase mb-2 text-center tracking-wider">
          ✖ SYSTEM EXCEPTION OCCURRED
        </div>
        <p className="text-gray-700 font-mono text-xs bg-gray-50 border border-gray-200 p-4 mb-6 whitespace-pre-wrap text-left leading-relaxed">
          {error}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onReset} className="px-4 py-2 text-xs font-bold border border-black uppercase hover:bg-gray-100 transition-colors !rounded-none">
            Return
          </button>
          <button onClick={() => window.location.reload()} className="px-4 py-2 text-xs font-bold bg-[#4d2c91] text-white uppercase hover:bg-black transition-colors !rounded-none">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const confidence = result.confidence || 50;
  const isHighRisk = result.riskLevel?.toUpperCase() === 'HIGH' || result.riskLevel?.toUpperCase() === 'CRITICAL';

  return (
    <div className="max-w-4xl mx-auto my-6 p-4">
      <div className="border border-black bg-white shadow-sm !rounded-none flex flex-col">
        
        {/* Module Operational Control Header */}
        <div className="bg-gray-50 border-b border-black px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#4d2c91]" />
            <span className="text-xs font-mono font-bold text-black tracking-wider uppercase">
              AMRITH CLINICAL DECISION MATRIX // EVALUATOR
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
            <span>CORE_VER: {result.modelVersion || 'v1.0.4'}</span>
            <span className="text-gray-300">|</span>
            <span>ID: {testId?.substring(0, 8).toUpperCase() || 'N/A'}</span>
          </div>
        </div>

        {/* Dashboard Work Area Layout */}
        <div className="p-6 lg:p-8 space-y-6">
          
          {/* Top Analytics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-black !rounded-none">
            <div className="col-span-1 p-6 bg-gray-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  CALIBRATION CONFIDENCE
                </span>
                <div className="text-5xl font-mono font-bold text-black tracking-tighter">
                  {confidence}<span className="text-xl text-gray-400">%</span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  RISK ASSESSMENT STRATA
                </span>
                <span className={`inline-block px-2 py-0.5 text-xs font-mono font-bold uppercase border ${
                  isHighRisk ? 'bg-black text-white border-black' : 'bg-white text-black border-black'
                } !rounded-none`}>
                  {result.riskLevel || 'LOW'} RISK
                </span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#4d2c91] font-bold uppercase tracking-widest block mb-1">
                  PRIMARY PREDICTIVE ANALYSIS CLASSIFICATION
                </span>
                <h2 className="text-2xl font-bold text-black uppercase tracking-tight font-sans">
                  {result.prediction || 'UNKNOWN CONDITIONS CLUSTER'}
                </h2>
                <p className="text-gray-600 text-xs mt-3 leading-relaxed max-w-xl">
                  The analytical matrix matches input telemetry variables at a high operational confidence index. Cross-referencing against structural datasets suggests the noted target indicator profile.
                </p>
              </div>
              {result.fallback && (
                <div className="mt-4 p-2 bg-gray-50 border border-gray-200 text-[10px] font-mono text-gray-500">
                  ⚠️ HEURISTIC FAILSAFE MODE ACTIVATED: Fallback processing rules applied.
                </div>
              )}
            </div>
          </div>

          {/* Analysis Split Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              {result.details?.top_predictions && result.details.top_predictions.length > 0 && (
                <div className="border border-black p-5 space-y-4 !rounded-none">
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                      DIFFERENTIAL VECTOR PROBABILITY DISTRIBUTION
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {result.details.top_predictions.slice(0, 4).map((pred, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-medium text-black">
                            <span className="font-mono text-gray-400 mr-2">{i + 1}.</span>
                            {pred.disease}
                          </span>
                          <span className="font-mono font-bold text-black">{pred.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 border border-gray-200 !rounded-none">
                          <div className="bg-[#4d2c91] h-full" style={{ width: `${pred.confidence}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.details?.recommendations && result.details.recommendations.length > 0 && (
                <div className="border border-black p-5 space-y-3 !rounded-none">
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                      INDICATED CLINICAL GUIDELINES & STEPS
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-black">
                    {result.details.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 items-start leading-relaxed">
                        <span className="font-mono font-bold text-[#4d2c91]">{i + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              {result.details?.ai_precautions && result.details.ai_precautions.length > 0 && (
                <div className="border border-black p-5 bg-white space-y-3 !rounded-none">
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                      CONTRAINDICATIONS & SAFETY WARNINGS
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {result.details.ai_precautions.map((prec, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-black font-bold font-mono">•</span>
                        <span>{prec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.details?.ai_medications && result.details.ai_medications.length > 0 && (
                <div className="border border-black p-5 bg-white space-y-3 !rounded-none">
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                      INDICATED PHARMACOLOGICAL REGISTRY
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {result.details.ai_medications.map((med, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-[#4d2c91] font-bold font-mono">{i + 1}.</span>
                        <span>{med}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Screening Disclosure */}
          <div className="border border-gray-300 p-4 bg-gray-50 !rounded-none">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1 text-black">
              CRITICAL SCREENING DISCLOSURE
            </span>
            <p className="text-[10px] text-gray-500 leading-relaxed text-justify">
              Preliminary telemetry analysis parameters using automated modeling matrices. This layout does not replace formal pathology evaluation registries. Authentication by licensed medical staff members is required.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-gray-50 border-t border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <button onClick={onReset} className="text-xs font-mono font-bold text-gray-500 hover:text-black px-2 py-1 uppercase tracking-wider">
              [ Clear Matrix Screen ]
            </button>
          </div>
          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
            <button 
              onClick={handleDownloadReport}
              disabled={downloading}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-black bg-white hover:bg-gray-100 text-black !rounded-none disabled:opacity-50"
            >
              {downloading ? 'Compiling File...' : 'Download Analysis Record'}
            </button>
            <button onClick={() => onProceed(result)} className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#4d2c91] text-white hover:bg-black !rounded-none">
              Proceed to Routing Consultation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}