// Centralized configuration for the Amrith Frontend
export const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://azhaanglitch-amrith-backend.hf.space/api' : 'http://localhost:5000/api');
