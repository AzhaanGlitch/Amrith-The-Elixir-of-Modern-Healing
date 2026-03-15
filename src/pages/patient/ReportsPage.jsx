import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, SearchBar } from '../../components/ui';
import { reports } from '../../data/mockData';
import { FileText, Download, Share2, Eye, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  const [search, setSearch] = useState('');
  const filtered = reports.filter(r => r.testName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">My Reports & Records</h1>
        <SearchBar placeholder="Search reports..." value={search} onChange={setSearch} className="sm:w-72" />
      </div>

      <div className="space-y-4">
        {filtered.map((report, i) => (
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
                    <Button size="sm" variant="primary">
                      <Eye className="w-4 h-4" /> View Full Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" /> Download PDF
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Share2 className="w-4 h-4" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted">No reports found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
