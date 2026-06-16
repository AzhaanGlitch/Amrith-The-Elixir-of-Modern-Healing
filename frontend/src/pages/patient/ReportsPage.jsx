import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, SearchBar } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { FileText, Download, Share2, Eye, Sparkles, Loader2 } from 'lucide-react';
import { API_URL } from '../../config';

export default function ReportsPage() {
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('amrith_token');
        if (!token) return;
        const res = await fetch(`${API_URL}/reports`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setReports(data.reports);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleViewReport = async (reportId) => {
    try {
      const token = localStorage.getItem('amrith_token');
      const response = await fetch(`${API_URL}/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to load report');
      const htmlText = await response.text();
      const newTab = window.open();
      if (newTab) {
        newTab.document.open();
        newTab.document.write(htmlText);
        newTab.document.close();
      }
    } catch (err) {
      console.error('Error viewing report:', err);
      addToast('Failed to load report preview.', 'error');
    }
  };

  const handleDownloadReport = async (reportId, testName) => {
    try {
      const token = localStorage.getItem('amrith_token');
      const response = await fetch(`${API_URL}/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `amrith-report-${testName.toLowerCase().replace(/\\s+/g, '-')}-${reportId}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast('Report downloaded successfully.', 'success');
    } catch (err) {
      console.error('Error downloading report:', err);
      addToast('Failed to download report.', 'error');
    }
  };

  const handleShareReport = (reportId) => {
    const shareUrl = `${window.location.origin}/reports/${reportId}`;
    navigator.clipboard.writeText(shareUrl);
    addToast('Report share link copied to clipboard!', 'success');
  };

  const filtered = reports.filter(r => r.testName.toLowerCase().includes(search.toLowerCase()));

  const mappedReports = filtered.map(rep => {
    const isNormal = (rep.doctorReview?.reviewed ? rep.doctorReview.severity === 'normal' : rep.aiAnalysis?.riskLevel === 'Low');
    return {
      id: rep._id,
      testName: rep.testName,
      date: new Date(rep.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      doctor: rep.doctor?.name ? `Dr. ${rep.doctor.name}` : 'AI Specialist',
      status: isNormal ? 'normal' : 'attention',
      summary: rep.aiAnalysis?.prediction || 'Diagnostic screening successfully processed. Full insights are generated.',
    };
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-text-muted text-sm font-semibold">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">My Reports & Records</h1>
        <SearchBar placeholder="Search reports..." value={search} onChange={setSearch} className="sm:w-72" />
      </div>

      <div className="space-y-4">
        {mappedReports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  report.status === 'normal' ? 'bg-secondary/15' : 'bg-accent/15'
                }`}>
                  <FileText className={`w-6 h-6 ${report.status === 'normal' ? 'text-secondary-dark' : 'text-accent'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-semibold text-text text-lg">{report.testName}</h3>
                      <p className="text-text-muted text-sm mt-0.5">{report.date} • {report.doctor}</p>
                    </div>
                    <Badge variant={report.status === 'normal' ? 'secondary' : 'warning'}>
                      {report.status === 'normal' ? '✓ Normal' : '⚠ Needs Attention'}
                    </Badge>
                  </div>

                  {/* AI Summary */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">AI Health Summary</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{report.summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button size="sm" variant="primary" onClick={() => handleViewReport(report.id)}>
                      <Eye className="w-4 h-4" /> View Full Report
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report.id, report.testName)}>
                      <Download className="w-4 h-4" /> Download Report
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleShareReport(report.id)}>
                      <Share2 className="w-4 h-4" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {mappedReports.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted">No reports found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
