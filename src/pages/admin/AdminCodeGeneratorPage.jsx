import { useState } from 'react';
import { Key, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AdminCodeGeneratorPage() {
  const [formData, setFormData] = useState({ email: '', sourceSentence: '' });
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSHA256 = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.sourceSentence) return;
    
    setIsGenerating(true);
    try {
      const stringToHash = `${formData.email}:${formData.sourceSentence}`;
      const hash = await generateSHA256(stringToHash);
      setGeneratedCode(hash);
      setCopied(false);
    } catch (err) {
      console.error("Error generating hash", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Access Code Generator</h1>
        <p className="text-gray-400">Generate secure SHA-256 access codes for new doctor and admin registrations.</p>
      </div>

      <div className="bg-[#000000] p-8 rounded-md border border-white/5 shadow-xl">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Generator Details</h2>
            <p className="text-sm text-gray-500">Fill in the required fields to compute the hash.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 ml-1">Target Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="e.g. doctor@amrith.com"
              className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 ml-1">Source Sentence (Salt)</label>
            <input 
              type="text" 
              required
              value={formData.sourceSentence}
              onChange={(e) => setFormData(p => ({ ...p, sourceSentence: e.target.value }))}
              placeholder="Enter a secure phrase..."
              className="w-full bg-[#000000] border border-white/10 rounded-md px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <p className="text-xs text-gray-500 ml-1 flex items-center gap-1 mt-1">
              <ShieldAlert className="w-3 h-3" />
              Must match exactly during the registration process.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isGenerating || !formData.email || !formData.sourceSentence}
            className="w-full bg-white text-[#000000] font-bold py-4 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-white/5"
          >
            {isGenerating ? 'Generating...' : 'Generate 64-bit Code'}
          </button>
        </form>

        {generatedCode && (
          <div className="mt-8 p-6 bg-[#000000] rounded-md border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Generated SHA-256 Code</p>
                <p className="text-sm text-gray-300 font-mono break-all pr-4 select-all">{generatedCode}</p>
              </div>
              <button 
                onClick={handleCopy}
                className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-[#111111] hover:bg-white/10 text-white rounded-lg transition-colors border border-white/5"
              >
                {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
