import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { Card, Button } from '../ui';

export default function AITriageResult({ onProceed, onReset }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Simulate AI Processing
    const timer = setTimeout(() => {
      setResult({
        score: Math.floor(Math.random() * 40) + 30, // Random risk score 30-70
        risk: 'Moderate',
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        message: 'Based on the AI triage, your symptoms indicate a moderate priority for medical consultation.'
      });
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-heading font-bold text-text mb-2">Analyzing Your Data</h3>
        <p className="text-text-muted max-w-xs mx-auto">Our ML models are processing your inputs to provide an immediate priority assessment.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto py-6"
    >
      <Card className={`p-8 border-none shadow-xl relative overflow-hidden ${result.bg}`}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${result.bg} border ${result.border}`}>
              <ShieldCheck className={`w-6 h-6 ${result.color}`} />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-text">AI Triage Result</h3>
              <p className="text-text-muted text-xs font-medium uppercase tracking-wider">Analysis Complete</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-6xl font-heading font-black ${result.color}`}>{result.score}%</span>
              <span className="text-text-muted text-lg mb-2 font-medium">Risk Score</span>
            </div>
            <p className="text-text-secondary leading-relaxed font-medium">
              {result.message}
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white flex gap-3 items-start">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              <span className="font-bold text-text block mb-1">Medical Disclaimer:</span>
              This is an AI-powered screening tool designed for triage and informational purposes only. It does not constitute a clinical diagnosis. Always consult a qualified physician for medical decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onProceed} 
              className="flex-[2] h-14 rounded-xl text-lg group"
            >
              Proceed to Booking
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={onReset} 
              className="flex-1 h-14 rounded-xl border-white/40 bg-white/20 hover:bg-white text-text transition-all"
            >
              Screen Another
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/40 rounded-full blur-3xl" />
      </Card>
    </motion.div>
  );
}
