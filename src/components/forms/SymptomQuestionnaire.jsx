import React from 'react';
import { motion } from 'framer-motion';

export default function SymptomQuestionnaire({ questions, answers, onChange }) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-heading font-bold text-text mb-2">Symptom Assessment</h3>
        <p className="text-text-muted text-sm">Please provide accurate information to help our AI triage your condition.</p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        {questions.map((q, idx) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="space-y-3"
          >
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                {idx + 1}
              </span>
              {q.label}
            </label>

            {q.type === 'number' && (
              <input
                type="number"
                placeholder={q.placeholder || 'Enter value'}
                min={q.min}
                max={q.max}
                value={answers[q.id] || ''}
                onChange={(e) => onChange(q.id, e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            )}

            {q.type === 'select' && (
              <select
                value={answers[q.id] || ''}
                onChange={(e) => onChange(q.id, e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="">Select Option</option>
                {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}

            {q.type === 'radio' && (
              <div className="flex gap-3">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => onChange(q.id, opt)}
                    className={`flex-1 py-3 px-4 rounded-md border text-sm font-medium transition-all ${
                      answers[q.id] === opt 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white text-text border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'checkbox' && (
              <div className="flex flex-wrap gap-2">
                {q.options.map(opt => {
                  const currentAnswers = answers[q.id] || [];
                  const isChecked = currentAnswers.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        const newAnswers = isChecked 
                          ? currentAnswers.filter(a => a !== opt)
                          : [...currentAnswers, opt];
                        onChange(q.id, newAnswers);
                      }}
                      className={`py-2 px-4 rounded-md border text-xs font-medium transition-all ${
                        isChecked 
                          ? 'bg-primary text-white border-primary shadow-md' 
                          : 'bg-white text-text border-border hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'text' && (
              <input
                type="text"
                placeholder={q.placeholder || 'Enter details'}
                value={answers[q.id] || ''}
                onChange={(e) => onChange(q.id, e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
