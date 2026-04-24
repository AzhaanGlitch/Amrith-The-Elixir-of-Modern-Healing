import React, { useState, useCallback } from 'react';
import { Upload, X, FileImage, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploadForm({ onUpload, maxFiles = 5 }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.slice(0, maxFiles - files.length).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    }));
    
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  }, [files, maxFiles, onUpload]);

  const removeFile = (id) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-heading font-bold text-text mb-2">Upload Images</h3>
        <p className="text-text-muted text-sm">Please upload clear images (X-rays, skin photos, or retinal scans) for AI analysis.</p>
      </div>

      <label className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
        files.length >= maxFiles 
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
          : 'border-primary/30 hover:border-primary hover:bg-primary/5'
      }`}>
        <input 
          type="file" 
          multiple 
          accept="image/jpeg,image/png,image/jpg" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={files.length >= maxFiles}
        />
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-primary/40 mb-3" />
          <p className="font-semibold text-text">Click to upload or drag & drop</p>
          <p className="text-xs text-text-muted mt-1">JPEG, PNG up to 10MB • {files.length}/{maxFiles} files</p>
        </div>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div 
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group rounded-xl overflow-hidden border border-border shadow-sm aspect-square bg-white"
            >
              <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => removeFile(file.id)}
                  className="p-2 bg-white rounded-full text-error hover:bg-error hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
