import React, { useEffect, useState } from 'react';
import { Resume } from '../../types';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import {
  FileText,
  UploadCloud,
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { DEMO_RESUME } from '../../data/demoData';

interface MyResumesPageProps {
  onAnalyzeResume: (resumeId: string) => void;
}

export const MyResumesPage: React.FC<MyResumesPageProps> = ({ onAnalyzeResume }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingResume, setViewingResume] = useState<Resume | null>(null);
  const [renamingResume, setRenamingResume] = useState<Resume | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const toast = useToast();

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const data = await api.getResumes();
      setResumes(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const newResume = await api.uploadResume(formData);
      setResumes((prev) => [newResume, ...prev]);
      toast.success('Resume uploaded and parsed successfully');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingResume || !newFileName.trim()) return;

    try {
      const updated = await api.renameResume(renamingResume.id, newFileName.trim());
      setResumes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success('Resume renamed');
      setRenamingResume(null);
    } catch (err) {
      toast.error('Failed to rename resume');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await api.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success('Resume deleted');
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Resumes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Manage your stored resume versions, view extracted text, and run targeted analyses.
          </p>
        </div>

        <div>
          <label className="inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm cursor-pointer transition-colors">
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Resume</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Resume Cards Grid */}
      {resumes.length === 0 && !isLoading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No resumes uploaded yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Upload your first resume in PDF or Word format to begin auditing against target job descriptions.
          </p>
          <div className="pt-2">
            <label className="inline-flex items-center justify-center font-medium rounded-lg text-xs px-4 py-2 gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm cursor-pointer transition-colors">
              <UploadCloud className="w-4 h-4" />
              <span>Choose Resume File</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-colors group"
            >
              <div className="space-y-4">
                {/* File Icon & Top Meta */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  {resume.lastScore && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      ATS: {resume.lastScore}%
                    </span>
                  )}
                </div>

                {/* File Details */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" title={resume.fileName}>
                    {resume.fileName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{(resume.fileSize / 1024).toFixed(1)} KB</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Skills preview tags */}
                {resume.sections?.skills && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {resume.sections.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                    {resume.sections.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 px-1 py-0.5">
                        +{resume.sections.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Bar */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingResume(resume)}
                    className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View parsed text"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setRenamingResume(resume);
                      setNewFileName(resume.fileName);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Rename"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  size="sm"
                  onClick={() => onAnalyzeResume(resume.id)}
                  leftIcon={<Sparkles className="w-3 h-3 text-indigo-400" />}
                >
                  Analyze
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Parsed Text Modal */}
      <Modal
        isOpen={!!viewingResume}
        onClose={() => setViewingResume(null)}
        title={viewingResume?.fileName || 'Extracted Resume Content'}
        description="Text extracted by our ATS parser for AI analysis."
        maxWidth="2xl"
      >
        <div className="max-h-[60vh] overflow-y-auto rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {viewingResume?.parsedText}
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={!!renamingResume}
        onClose={() => setRenamingResume(null)}
        title="Rename Resume File"
        maxWidth="sm"
      >
        <form onSubmit={handleRename} className="space-y-4">
          <Input
            label="File Name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setRenamingResume(null)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
