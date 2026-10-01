import React, { useState } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { api } from '../../lib/api';
import { SAMPLE_JOB_DESCRIPTIONS, DEMO_RESUME } from '../../data/demoData';
import { Sparkles, CheckCircle2, FileText, ArrowRight, Zap, Eye } from 'lucide-react';
import { ThinkingOrb } from '../ui/ThinkingOrb';
import { ThinkingOrbExplorerModal } from '../ui/ThinkingOrbExplorerModal';
import confetti from 'canvas-confetti';

interface AnalyzePageProps {
  onAnalysisComplete: (analysisId: string) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isOrbModalOpen, setIsOrbModalOpen] = useState(false);

  const toast = useToast();

  const stages = [
    'Reading your resume and parsing structure...',
    'Analyzing job requirements & core competencies...',
    'Comparing skills & keyword parity with target role...',
    'Generating recommendations & ATS scoring...',
  ];

  const getOrbState = (stage: number): 'searching' | 'weaving' | 'solving' | 'composing' => {
    switch (stage) {
      case 0:
        return 'searching';
      case 1:
        return 'weaving';
      case 2:
        return 'solving';
      case 3:
      default:
        return 'composing';
    }
  };

  const handleFileSelected = (file: File | null, contentText?: string) => {
    setSelectedFile(file);
    if (contentText) {
      setResumeText(contentText);
    } else if (file) {
      // Read text if text file
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumeText(e.target?.result as string || '');
        };
        reader.readAsText(file);
      }
    } else {
      setResumeText('');
    }
  };

  const handleQuickJobSelect = (job: typeof SAMPLE_JOB_DESCRIPTIONS[0]) => {
    setJobDescription(job.text);
    toast.info(`Loaded sample brief: ${job.title}`);
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile && !resumeText.trim()) {
      toast.error('Please upload a resume (PDF/DOCX) or paste resume text first.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      toast.error('Please paste the target job description (minimum 20 characters).');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStage(0);

    // Multi-stage animated loading feedback
    const stageTimer1 = setTimeout(() => setAnalysisStage(1), 700);
    const stageTimer2 = setTimeout(() => setAnalysisStage(2), 1400);
    const stageTimer3 = setTimeout(() => setAnalysisStage(3), 2100);

    try {
      let analysisResult;

      if (selectedFile) {
        // Upload resume file directly via FormData
        const formData = new FormData();
        formData.append('resume', selectedFile);
        const uploadedResume = await api.uploadResume(formData);

        // Run analysis on the uploaded resume
        analysisResult = await api.analyzeResume({
          resumeId: uploadedResume.id,
          resumeText: uploadedResume.parsedText || resumeText || DEMO_RESUME.parsedText,
          fileName: selectedFile.name,
          jobDescription,
        });
      } else {
        // Text payload
        analysisResult = await api.analyzeResume({
          resumeText: resumeText || DEMO_RESUME.parsedText,
          fileName: 'Pasted_Resume.txt',
          jobDescription,
        });
      }

      // Small confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }

      toast.success('Resume analysis generated successfully!');
      onAnalysisComplete(analysisResult.id);
    } catch (err: any) {
      toast.error(err.message || 'Analysis failed. Please try again.');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Heading */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Analyze Your Resume
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upload your resume and pair it with a target role to get instant ATS scores, missing keywords, and surgical bullet rewrites.
        </p>
      </div>

      {/* Step 1: Upload Resume */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center font-mono">
            1
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Upload Resume
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your PDF or Word document for text extraction and ATS formatting audit.
            </p>
          </div>
        </div>

        <FileUploader
          selectedFile={selectedFile}
          uploadedText={resumeText}
          onFileSelected={handleFileSelected}
          isProcessing={isAnalyzing}
        />
      </div>

      {/* Step 2: Target Job Description */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center font-mono">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Target Job Description
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste the responsibilities and requirements of the role you're applying for.
              </p>
            </div>
          </div>
        </div>

        {/* Quick sample brief buttons */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Or test with a sample job brief:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_JOB_DESCRIPTIONS.map((job, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickJobSelect(job)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                {job.title.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          placeholder="Paste the target job description here (Responsibilities, Requirements, Skills)..."
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isAnalyzing}
        />
      </div>

      {/* Step 3: Analyze Button & Animated Progress */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center font-mono">
              3
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Run AI Intelligence Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluates ATS parseability, keyword density, and experience metrics in seconds.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsOrbModalOpen(true)}
              leftIcon={<Eye className="w-3.5 h-3.5 text-indigo-500" />}
            >
              Explore Orb States
            </Button>
            <Button
              size="lg"
              onClick={handleStartAnalysis}
              isLoading={isAnalyzing}
              leftIcon={<Sparkles className="w-4 h-4 text-indigo-400" />}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume with AI'}
            </Button>
          </div>
        </div>

        {/* Live Multi-stage Processing Indicator with ThinkingOrb */}
        {isAnalyzing && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
            {/* ThinkingOrb Feature Showcase Card */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <div className="shrink-0 p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800">
                <ThinkingOrb
                  state={getOrbState(analysisStage)}
                  size={64}
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                    ThinkingOrb state="{getOrbState(analysisStage)}"
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Step {analysisStage + 1} of {stages.length}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {stages[analysisStage]}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {analysisStage === 0 && 'A scan meridian sweeps the document topology to extract clear sections.'}
                  {analysisStage === 1 && 'Three strands plait around skills and job competency requirements.'}
                  {analysisStage === 2 && 'Bands scramble and click into alignment calculating ATS score parity.'}
                  {analysisStage === 3 && 'An undulating sash weaves tailored resume recommendations.'}
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${((analysisStage + 1) / stages.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400">
              {stages.map((stg, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                    i === analysisStage
                      ? 'border-indigo-500/50 bg-indigo-50/30 dark:bg-indigo-950/20 text-slate-900 dark:text-slate-100 font-semibold'
                      : i < analysisStage
                      ? 'border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      : 'border-transparent opacity-40'
                  }`}
                >
                  {i === analysisStage ? (
                    <ThinkingOrb state={getOrbState(i)} size={20} />
                  ) : (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        i < analysisStage
                          ? 'text-emerald-500'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  )}
                  <span className="truncate">{stg.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive ThinkingOrb Explorer Modal */}
      <ThinkingOrbExplorerModal
        isOpen={isOrbModalOpen}
        onClose={() => setIsOrbModalOpen(false)}
      />
    </div>
  );
};
