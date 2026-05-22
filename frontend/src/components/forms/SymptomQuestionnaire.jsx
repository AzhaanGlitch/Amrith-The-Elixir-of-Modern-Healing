import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { symptomCategories } from '../../data/symptoms';

export default function SymptomQuestionnaire({ questions, answers, onChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(symptomCategories[0]?.id || '');

  // Flattened list of all symptoms for quick search
  const allSymptoms = symptomCategories.flatMap(cat => cat.symptoms);

  // Filter symptoms based on search query
  const filteredSymptoms = searchQuery.trim() === '' 
    ? [] 
    : allSymptoms.filter(symptom => 
        symptom.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-heading font-bold text-slate-800 dark:text-white mb-2">Symptom Assessment</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Select all symptoms you are experiencing to help our medical AI diagnose your condition precisely.</p>
      </div>

      <div className="grid gap-6 max-w-3xl mx-auto">
        {questions.map((q, idx) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="space-y-4"
          >
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              {q.label}
            </label>

            {q.type === 'symptom_selector' ? (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search symptoms (e.g. fever, headache, stomach pain...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all"
                  />
                  <div className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 18 12-12M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Selected Symptoms Badge Bar */}
                {answers[q.id] && answers[q.id].length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                      <span>Selected Symptoms ({answers[q.id].length})</span>
                      <button 
                        onClick={() => onChange(q.id, [])}
                        className="text-primary hover:underline text-[11px] font-bold lowercase hover:text-primary-dark transition-all"
                      >
                        clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                      <AnimatePresence>
                        {answers[q.id].map((symptomLabel) => (
                          <motion.span
                            key={symptomLabel}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 text-xs font-semibold shadow-sm border border-primary/20 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:hover:border-red-900 transition-all"
                            onClick={() => {
                              onChange(q.id, answers[q.id].filter(a => a !== symptomLabel));
                            }}
                          >
                            {symptomLabel}
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 18 12-12M6 6l12 12" />
                            </svg>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Search Results / Category Accordions */}
                {searchQuery.trim() !== '' ? (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Search Results</div>
                    {filteredSymptoms.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
                        {filteredSymptoms.map((symptom) => {
                          const currentAnswers = answers[q.id] || [];
                          const isChecked = currentAnswers.includes(symptom.label);
                          return (
                            <button
                              key={symptom.id}
                              onClick={() => {
                                const newAnswers = isChecked 
                                  ? currentAnswers.filter(a => a !== symptom.label)
                                  : [...currentAnswers, symptom.label];
                                onChange(q.id, newAnswers);
                              }}
                              className={`flex items-center justify-between text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${
                                isChecked 
                                  ? 'bg-primary/5 text-primary border-primary shadow-sm ring-1 ring-primary/20 dark:bg-primary/10 dark:text-white' 
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/80'
                              }`}
                            >
                              <span>{symptom.label}</span>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                isChecked ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600'
                              }`}>
                                {isChecked && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m5 13 4 4L19 7" /></svg>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">No symptoms found matching "{searchQuery}"</div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Category Navigation (Vertical Tabs) */}
                    <div className="md:col-span-1 flex flex-col gap-1.5 border-r border-slate-100 dark:border-slate-800 pr-3">
                      {symptomCategories.map((cat) => {
                        const selectedCount = cat.symptoms.filter(s => answers[q.id]?.includes(s.label)).length;
                        const isActive = activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-semibold transition-all ${
                              isActive 
                                ? 'bg-primary text-white shadow-md' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="truncate pr-2">{cat.title}</span>
                            {selectedCount > 0 && (
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isActive ? 'bg-white text-primary' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white'
                              }`}>
                                {selectedCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Category Symptoms List Grid */}
                    <div className="md:col-span-2 max-h-[380px] overflow-y-auto p-1 pr-2">
                      {symptomCategories.map((cat) => {
                        if (cat.id !== activeCategory) return null;
                        return (
                          <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-3"
                          >
                            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <span>{cat.title}</span>
                              <span className="text-[11px] font-medium lowercase text-slate-400">{cat.symptoms.length} choices</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {cat.symptoms.map((symptom) => {
                                const currentAnswers = answers[q.id] || [];
                                const isChecked = currentAnswers.includes(symptom.label);
                                return (
                                  <button
                                    key={symptom.id}
                                    onClick={() => {
                                      const newAnswers = isChecked 
                                        ? currentAnswers.filter(a => a !== symptom.label)
                                        : [...currentAnswers, symptom.label];
                                      onChange(q.id, newAnswers);
                                    }}
                                    className={`flex items-center justify-between text-left p-3 rounded-xl border text-sm font-medium transition-all ${
                                      isChecked 
                                        ? 'bg-primary/5 text-primary border-primary shadow-sm ring-1 ring-primary/20 dark:bg-primary/10 dark:text-white' 
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/80'
                                    }`}
                                  >
                                    <span>{symptom.label}</span>
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                      isChecked ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                      {isChecked && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m5 13 4 4L19 7" /></svg>}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {q.type === 'number' && (
              <input
                type="number"
                placeholder={q.placeholder || 'Enter value'}
                min={q.min}
                max={q.max}
                value={answers[q.id] || ''}
                onChange={(e) => onChange(q.id, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all"
              />
            )}

            {q.type === 'select' && (
              <select
                value={answers[q.id] || ''}
                onChange={(e) => onChange(q.id, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all"
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
                    className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      answers[q.id] === opt 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
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
                      className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all ${
                        isChecked 
                          ? 'bg-primary text-white border-primary shadow-md' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

