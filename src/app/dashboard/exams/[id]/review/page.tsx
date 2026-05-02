"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Clock, CheckCircle2, XCircle, ArrowLeft, Loader2, BarChart3, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getExamAttemptReview } from "@/services/exams";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export default function ExamReviewPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const { user } = useAuthStore();

  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  useEffect(() => {
    if (user && examId) {
      fetchReview();
    }
  }, [user, examId]);

  const fetchReview = async () => {
    setLoading(true);
    const { data, error: err } = await getExamAttemptReview(user!.id, examId);
    
    if (err || !data) {
      setError("Could not load exam review. Did you complete this exam?");
      setLoading(false);
      return;
    }

    setReviewData(data);
    
    // Auto-expand first incorrect question or first question
    const questions = data.examData.mock_exam_questions.map((mq: any) => mq.questions);
    const firstIncorrect = questions.find((q: any) => {
      const ans = data.userAnswers.find((a: any) => a.question_id === q.id);
      return !ans?.correct;
    });
    
    if (firstIncorrect) {
      setExpandedQ(firstIncorrect.id);
    } else if (questions.length > 0) {
      setExpandedQ(questions[0].id);
    }
    
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-primary mb-2">No Review Available</h2>
        <p className="text-body-light mb-6">{error}</p>
        <Link href="/dashboard/exams" className="btn-primary">Back to Exams</Link>
      </div>
    );
  }

  const { attempt, examData, userAnswers } = reviewData;
  const questions = examData.mock_exam_questions
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((mq: any) => mq.questions)
    .filter(Boolean);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams" className="p-2 rounded-xl border border-surface-border text-body hover:bg-surface-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-heading-lg text-primary">Exam Review</h1>
          <p className="text-sm text-body-light mt-1">{examData.title}</p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft md:col-span-2 flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-secondary" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" 
                strokeDasharray={`${attempt.score * 2.827} 282.7`} 
                className={attempt.score >= 70 ? "text-green-500" : attempt.score >= 50 ? "text-amber-500" : "text-red-500"} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-primary">{attempt.score}%</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary mb-1">Final Score</h2>
            <p className="text-sm text-body-light leading-relaxed">
              {attempt.score >= 70 ? "Great job! You passed the mock exam." : "Keep practicing. Review your incorrect answers below."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-primary mb-1">{attempt.total_correct} <span className="text-sm font-normal text-body-lighter">/ {attempt.total_attempted}</span></p>
          <p className="text-xs font-medium text-body-lighter uppercase tracking-wider">Correct Answers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-primary mb-1">{formatTime(attempt.time_spent)}</p>
          <p className="text-xs font-medium text-body-lighter uppercase tracking-wider">Time Spent</p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold text-primary mb-4">Detailed Review</h3>
        
        {questions.map((q: any, i: number) => {
          // Find the user's answer attempt for this specific question
          const userAnsRecord = userAnswers.find((a: any) => a.question_id === q.id);
          const selectedOptionId = userAnsRecord?.selected_option;
          const isCorrect = userAnsRecord?.correct;
          const isExpanded = expandedQ === q.id;

          return (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn("bg-white rounded-2xl border shadow-soft overflow-hidden transition-all", isExpanded ? "border-accent/30 ring-1 ring-accent/10" : "border-surface-border")}
            >
              <div 
                onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                className="p-5 flex items-start gap-4 cursor-pointer hover:bg-surface-secondary/30 transition-colors"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-body-lighter uppercase tracking-wider">Question {i + 1}</span>
                    <span className="w-1 h-1 rounded-full bg-surface-border" />
                    <span className="text-xs font-medium text-body-light">{q.system}</span>
                  </div>
                  <h4 className={cn("text-sm font-medium transition-colors line-clamp-2", isExpanded ? "text-primary" : "text-body")}>
                    {q.title}
                  </h4>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-surface-border mt-2">
                  <h4 className="text-base text-primary font-medium leading-relaxed mb-6 mt-4">{q.title}</h4>
                  
                  <div className="space-y-3 mb-6">
                    {q.question_options?.sort((a:any, b:any) => a.sort_order - b.sort_order).map((opt: any, oi: number) => {
                      const isUserSelection = selectedOptionId === opt.id;
                      const isActuallyCorrect = opt.is_correct;
                      
                      let optionStyle = "border-surface-border bg-surface-secondary/30";
                      let icon = null;

                      if (isActuallyCorrect) {
                        optionStyle = "border-green-300 bg-green-50 ring-1 ring-green-300";
                        icon = <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto shrink-0" />;
                      } else if (isUserSelection && !isActuallyCorrect) {
                        optionStyle = "border-red-300 bg-red-50 ring-1 ring-red-300";
                        icon = <XCircle className="w-5 h-5 text-red-500 ml-auto shrink-0" />;
                      }

                      return (
                        <div key={opt.id} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border", optionStyle)}>
                          <span className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                            isActuallyCorrect ? "bg-green-600 text-white" : isUserSelection ? "bg-red-500 text-white" : "bg-white border border-surface-border text-body-light"
                          )}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span className={cn("text-sm", isActuallyCorrect ? "text-green-900 font-medium" : isUserSelection ? "text-red-900 font-medium" : "text-body")}>
                            {opt.option_text}
                          </span>
                          {icon}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpenIcon className="w-4 h-4 text-blue-600" />
                        <h5 className="text-sm font-semibold text-blue-900 uppercase tracking-wider">Explanation</h5>
                      </div>
                      <p className="text-sm text-blue-900/80 leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function BookOpenIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}
