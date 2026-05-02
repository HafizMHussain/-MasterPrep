"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getExamById, startExamAttempt, completeExamAttempt, submitQuestionAttempts } from "@/services/exams";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export default function TakeExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const { user } = useAuthStore();

  const [exam, setExam] = useState<any>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && examId) {
      initExam();
    }
  }, [user, examId]);

  useEffect(() => {
    if (timeLeft > 0 && !loading && !submitting) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, loading, submitting]);

  const initExam = async () => {
    setLoading(true);
    const { data: examData, error: examError } = await getExamById(examId);
    
    if (examError || !examData) {
      setError("Failed to load exam.");
      setLoading(false);
      return;
    }

    // Extract questions and randomize options
    const rawQuestions = examData.mock_exam_questions
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((mq: any) => mq.questions)
      .filter(Boolean);

    setExam(examData);
    setQuestions(rawQuestions);
    setTimeLeft(examData.duration * 60);

    // Start attempt in DB
    const { data: attemptData } = await startExamAttempt(user!.id, examId);
    if (attemptData) {
      setAttemptId(attemptData.id);
    }

    setLoading(false);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmitExam = async () => {
    if (!attemptId || !exam || !user) return;
    setSubmitting(true);

    let correctCount = 0;
    const attemptRecords: any[] = [];

    questions.forEach((q) => {
      const selectedId = answers[q.id];
      let isCorrect = false;

      if (selectedId) {
        const selectedOption = q.question_options.find((o: any) => o.id === selectedId);
        if (selectedOption?.is_correct) {
          isCorrect = true;
          correctCount++;
        }
      }

      attemptRecords.push({
        user_id: user.id,
        question_id: q.id,
        selected_option: selectedId || null,
        correct: isCorrect,
        time_taken: 0, // Could track per question in future
        mode: "exam",
      });
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const timeSpent = (exam.duration * 60) - timeLeft;

    await submitQuestionAttempts(attemptRecords);
    await completeExamAttempt(attemptId, {
      score,
      total_correct: correctCount,
      total_attempted: Object.keys(answers).length,
      time_spent: timeSpent,
    });

    router.push(`/dashboard/exams/${examId}/review`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-primary">Error Loading Exam</h1>
          <button onClick={() => router.push("/dashboard/exams")} className="btn-primary mt-6">Go Back</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-surface-border sticky top-0 z-10">
        <div className="h-1 bg-surface-secondary w-full">
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { if(confirm("Are you sure you want to quit? Your progress will be lost.")) router.push("/dashboard/exams"); }} className="text-body-lighter hover:text-body text-sm font-medium">
              Quit Exam
            </button>
            <div className="h-6 w-px bg-surface-border hidden sm:block" />
            <h1 className="font-semibold text-primary hidden sm:block">{exam?.title}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={cn("flex items-center gap-2 font-mono text-lg font-medium", timeLeft < 300 ? "text-red-500" : "text-primary")}>
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={() => { if(confirm("Submit your exam now?")) handleSubmitExam(); }} 
              disabled={submitting}
              className="btn-primary text-sm !py-2 px-4 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-soft"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 bg-surface-secondary text-primary font-medium text-sm rounded-lg">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md">{currentQ.system}</span>
              <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-600 rounded-md">{currentQ.topic}</span>
            </div>
          </div>

          <h2 className="text-lg text-primary font-medium leading-relaxed mb-8">{currentQ.title}</h2>

          <div className="space-y-3">
            {currentQ.question_options?.sort((a:any, b:any) => a.sort_order - b.sort_order).map((opt: any, i: number) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                    isSelected ? "bg-accent/5 border-accent ring-1 ring-accent" : "border-surface-border hover:bg-surface-secondary hover:border-body-lighter/30"
                  )}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors",
                    isSelected ? "bg-accent text-white" : "bg-surface-secondary text-body-light"
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={cn("text-sm", isSelected ? "text-primary font-medium" : "text-body")}>
                    {opt.option_text}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation Footer */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(prev => prev - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-border text-sm font-medium text-body hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-surface-border text-sm font-medium text-primary hover:bg-surface-secondary transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { if(confirm("This is the last question. Submit exam?")) handleSubmitExam(); }}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl btn-primary text-sm font-medium"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit Exam <CheckCircle2 className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
