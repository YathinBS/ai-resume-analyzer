import React, { useEffect, useState } from 'react';
import { Analysis } from '../../types';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  Search,
  Trash2,
  ExternalLink,
  Sparkles,
  Clock,
  Filter,
  FileCheck2,
  ArrowUpDown,
} from 'lucide-react';

interface AnalysisHistoryPageProps {
  onViewAnalysis: (id: string) => void;
  onAnalyzeNew: () => void;
}

export const AnalysisHistoryPage: React.FC<AnalysisHistoryPageProps> = ({
  onViewAnalysis,
  onAnalyzeNew,
}) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAnalysisHistory();
      setAnalyses(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Could not load analysis history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;

    try {
      await api.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Analysis report deleted');
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

  const filteredAnalyses = analyses.filter((item) => {
    const matchesSearch =
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.resumeFileName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (scoreFilter === 'high') return item.atsScore >= 85;
    if (scoreFilter === 'medium') return item.atsScore < 85;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Review past evaluations, track ATS score improvements, and re-audit roles.
          </p>
        </div>
        <Button
          size="sm"
          onClick={onAnalyzeNew}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Analyze Resume
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title or resume file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-stretch sm:self-auto">
          <button
            onClick={() => setScoreFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              scoreFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setScoreFilter('high')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              scoreFilter === 'high'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ATS &ge; 85%
          </button>
          <button
            onClick={() => setScoreFilter('medium')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              scoreFilter === 'medium'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Needs Work
          </button>
        </div>
      </div>

      {/* History Table / Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {filteredAnalyses.length === 0 && !isLoading ? (
          <div className="p-12 text-center space-y-3">
            <FileCheck2 className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No matching analyses</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search query or run a new resume analysis.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="py-3.5 px-5">Target Job & Resume</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">ATS Score</th>
                  <th className="py-3.5 px-4 text-center">Job Match</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAnalyses.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onViewAnalysis(item.id)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {item.jobTitle}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mt-0.5 truncate max-w-xs">
                        {item.resumeFileName}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {item.atsScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {item.jobMatchScore}%
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewAnalysis(item.id);
                          }}
                        >
                          View Report
                        </Button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
