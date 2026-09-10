'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCodingExam, runCode, submitCode } from '@eduverse/api';
import { DEFAULT_CODE_TEMPLATES, PROGRAMMING_LANGUAGES } from '@eduverse/config';
import { formatCountdown, getVerdictLabel, getVerdictColor } from '@eduverse/utils';
import type { ProgrammingLanguage, Verdict } from '@eduverse/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Play, Send, Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  AlertTriangle, Timer, Code2, FileText, Terminal, Maximize2, Minimize2,
} from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function CodingExamPage() {
  const params = useParams();
  const examId = params.id as string;

  const { data: exam, isLoading } = useQuery({
    queryKey: ['codingExam', examId],
    queryFn: () => getCodingExam(examId),
  });

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');
  const [codeByProblem, setCodeByProblem] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');

  const currentProblem = exam?.problems[currentProblemIndex];
  const currentCode = currentProblem ? (codeByProblem[currentProblem.id] || DEFAULT_CODE_TEMPLATES[language]) : '';

  // Timer
  useEffect(() => {
    if (exam) {
      const endTime = new Date(exam.endTime).getTime();
      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          toast.error('Time is up! Your code has been auto-submitted.');
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [exam]);

  // Init code templates
  useEffect(() => {
    if (exam && Object.keys(codeByProblem).length === 0) {
      const initial: Record<string, string> = {};
      exam.problems.forEach(p => { initial[p.id] = DEFAULT_CODE_TEMPLATES[language]; });
      setCodeByProblem(initial);
    }
  }, [exam, language]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (currentProblem && value !== undefined) {
      setCodeByProblem(prev => ({ ...prev, [currentProblem.id]: value }));
    }
  }, [currentProblem]);

  const runMutation = useMutation({
    mutationFn: () => runCode(currentCode, language, currentProblem?.sampleTestCases[0]?.input || ''),
    onSuccess: (result) => {
      if (result.success) {
        setOutput(`✅ Output:\n${result.data.output}\n⏱️ Time: ${result.data.executionTime.toFixed(2)}s | 💾 Memory: ${result.data.memoryUsed.toFixed(1)}MB`);
        setActiveTab('output');
      } else {
        setOutput(`❌ Error:\n${result.error}`);
        setActiveTab('output');
      }
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => submitCode(currentProblem!.id, examId, currentCode, language),
    onSuccess: (result) => {
      if (result.success) {
        const { verdict, score, maxScore, testCaseResults } = result.data;
        const passed = testCaseResults.filter(r => r.passed).length;
        const total = testCaseResults.length;
        setOutput(
          `📊 Submission Result\n${'═'.repeat(40)}\n` +
          `Verdict: ${getVerdictLabel(verdict)}\n` +
          `Score: ${score}/${maxScore}\n` +
          `Test Cases: ${passed}/${total} passed\n\n` +
          testCaseResults.map((tc, i) => 
            `${tc.passed ? '✅' : '❌'} Test Case ${i + 1}${tc.isHidden ? ' (Hidden)' : ''}: ${getVerdictLabel(tc.verdict)}`
          ).join('\n')
        );
        setActiveTab('output');
        toast.success(`Submitted! Score: ${score}/${maxScore}`);
      }
    },
  });

  if (isLoading || !exam || !currentProblem) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <Code2 className="w-12 h-12 mx-auto text-primary animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  const timerUrgent = timeLeft < 300;

  return (
    <div className={`flex flex-col h-[calc(100vh-7rem)] ${isFullscreen ? 'fixed inset-0 z-50 bg-background h-screen p-4' : ''}`}>
      {/* Exam Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border border-border rounded-lg mb-3">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-sm">{exam.title}</h2>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-1">
            {exam.problems.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setCurrentProblemIndex(i)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  i === currentProblemIndex
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
            className="h-8 px-2 rounded-md border border-border bg-background text-sm"
          >
            {exam.allowedLanguages.map(lang => {
              const l = PROGRAMMING_LANGUAGES.find(pl => pl.value === lang);
              return <option key={lang} value={lang}>{l?.label || lang}</option>;
            })}
          </select>

          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-sm font-bold ${
            timerUrgent ? 'bg-destructive/15 text-destructive animate-pulse' : 'bg-muted'
          }`}>
            <Timer className="w-4 h-4" />
            {formatCountdown(timeLeft)}
          </div>

          {/* Fullscreen */}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content: 3-Pane Layout */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {/* Left Pane: Problem Statement */}
        <div className="col-span-4 flex flex-col border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{currentProblem.title}</span>
            </div>
            <Badge variant={
              currentProblem.difficulty === 'easy' ? 'success' :
              currentProblem.difficulty === 'medium' ? 'warning' : 'destructive'
            } className="text-[10px]">
              {currentProblem.difficulty}
            </Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-4 text-sm space-y-4 bg-background">
            {/* Problem Statement rendered as formatted text */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {currentProblem.statement.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold mt-3 mb-1">{line.replace('### ', '')}</h3>;
                if (line.startsWith('```')) return null;
                if (line.startsWith('Input:') || line.startsWith('Output:')) return <p key={i} className="font-mono text-xs bg-muted px-2 py-1 rounded">{line}</p>;
                return line ? <p key={i}>{line}</p> : <br key={i} />;
              })}
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Input Format</h4>
              <p className="text-xs whitespace-pre-wrap font-mono bg-muted/50 p-2 rounded">{currentProblem.inputFormat}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Output Format</h4>
              <p className="text-xs whitespace-pre-wrap font-mono bg-muted/50 p-2 rounded">{currentProblem.outputFormat}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Constraints</h4>
              <p className="text-xs whitespace-pre-wrap font-mono bg-muted/50 p-2 rounded">{currentProblem.constraints}</p>
            </div>

            <Separator />

            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Sample Test Cases</h4>
              {currentProblem.sampleTestCases.map((tc, i) => (
                <div key={tc.id} className="mb-3 border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-3 py-1 text-[10px] font-medium">Sample {i + 1}</div>
                  <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="p-2">
                      <p className="text-[10px] text-muted-foreground mb-1">Input</p>
                      <pre className="text-xs font-mono">{tc.input}</pre>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-muted-foreground mb-1">Output</p>
                      <pre className="text-xs font-mono">{tc.expectedOutput}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              ⏱️ Time Limit: {currentProblem.timeLimit}s • 💾 Memory: {currentProblem.memoryLimit}MB • 🏆 Points: {currentProblem.maxPoints}
            </div>
          </div>

          {/* Problem Navigation */}
          <div className="flex items-center justify-between px-4 py-2 bg-card border-t border-border">
            <Button
              variant="ghost" size="sm"
              disabled={currentProblemIndex === 0}
              onClick={() => setCurrentProblemIndex(i => i - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentProblemIndex + 1} / {exam.problems.length}
            </span>
            <Button
              variant="ghost" size="sm"
              disabled={currentProblemIndex === exam.problems.length - 1}
              onClick={() => setCurrentProblemIndex(i => i + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Middle + Right: Editor + Output */}
        <div className="col-span-8 flex flex-col gap-3 min-h-0">
          {/* Code Editor */}
          <div className="flex-1 border border-border rounded-lg overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Code Editor</span>
                <Badge variant="outline" className="text-[10px]">
                  {PROGRAMMING_LANGUAGES.find(l => l.value === language)?.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm" variant="outline"
                  onClick={() => runMutation.mutate()}
                  disabled={runMutation.isPending}
                >
                  {runMutation.isPending ? (
                    <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin mr-1.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Run
                </Button>
                <Button
                  size="sm" variant="glow"
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                  ) : (
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Submit
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <MonacoEditor
                height="100%"
                language={PROGRAMMING_LANGUAGES.find(l => l.value === language)?.monacoId || 'python'}
                value={currentCode}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 4,
                  lineNumbers: 'on',
                  renderLineHighlight: 'gutter',
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>
          </div>

          {/* Output Console */}
          <div className="h-48 border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="flex items-center px-4 py-2 bg-card border-b border-border">
              <Terminal className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium">Console Output</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 bg-[#1e1e1e] font-mono text-sm text-emerald-400">
              {output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-white/30">Run or submit your code to see output here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
