"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, FileText, Play, CheckCircle2, BarChart3, ArrowRight, Trophy, AlertCircle, Loader2 } from "lucide-react";
import { getExams, getUserExamAttempts } from "@/services/exams";
import { useAuthStore } from "@/stores/auth-store";
import type { MockExam, MockExamAttempt } from "@/types/database";
import { cn } from "@/lib/utils";

export default function ExamsPage() {
  const { user } = useAuthStore();
  const [exams, setExams] = useState<MockExam[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "completed" | "available">("all");

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const { data: examsData } = await getExams();
    if (examsData) setExams(examsData);

    if (user) {
      const { data: attemptsData } = await getUserExamAttempts(user.id);
      if (attemptsData) setAttempts(attemptsData);
    }
    setLoading(false);
  };

  const getExamStatus = (examId: string) => {
    const attempt = attempts.find((a: any) => a.exam_id === examId);
    if (!attempt) return { status: "not_started" as const, attempt: null };
    if (attempt.completed) return { status: "completed" as const, attempt };
    return { status: "in_progress" as const, attempt };
  };

  const filtered = exams.filter((e) => {
    const { status } = getExamStatus(e.id);
    if (tab === "completed") return status === "completed";
    if (tab === "available") return status !== "completed";
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
        <p className="text-body-light mt-3">Loading exams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-lg text-primary">Mock Exams</h1>
          <p className="text-sm text-body-light mt-1">{exams.length} exams available</p>
        </div>
      </div>

      <div className="flex gap-1 bg-surface-secondary rounded-xl p-1 w-fit">
        {(["all", "available", "completed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all", tab === t ? "bg-white text-primary shadow-soft" : "text-body-light hover:text-primary")}>{t}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((exam, i) => {
          const { status, attempt } = getExamStatus(exam.id);
          return (
            <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft hover:shadow-medium transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", status === "completed" ? "bg-green-50" : status === "in_progress" ? "bg-amber-50" : "bg-blue-50")}>
                    {status === "completed" ? <Trophy className="w-5 h-5 text-green-500" /> : status === "in_progress" ? <AlertCircle className="w-5 h-5 text-amber-500" /> : <FileText className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm">{exam.title}</h3>
                    <p className="text-xs text-body-lighter mt-0.5">{exam.difficulty} difficulty</p>
                  </div>
                </div>
                <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-medium", status === "completed" ? "bg-green-50 text-green-600" : status === "in_progress" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600")}>
                  {status === "not_started" ? "Not Started" : status === "in_progress" ? "In Progress" : "Completed"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-surface-secondary rounded-xl p-3 text-center">
                  <FileText className="w-4 h-4 text-body-lighter mx-auto mb-1" />
                  <p className="text-sm font-semibold text-primary">{exam.total_questions}</p>
                  <p className="text-[10px] text-body-lighter">Questions</p>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 text-body-lighter mx-auto mb-1" />
                  <p className="text-sm font-semibold text-primary">{exam.duration}m</p>
                  <p className="text-[10px] text-body-lighter">Duration</p>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 text-center">
                  <BarChart3 className="w-4 h-4 text-body-lighter mx-auto mb-1" />
                  <p className="text-sm font-semibold text-primary">{attempt?.score ? `${attempt.score}%` : "—"}</p>
                  <p className="text-[10px] text-body-lighter">Score</p>
                </div>
              </div>

              {status === "completed" ? (
                <div className="flex gap-2">
                  <Link href={`/dashboard/exams/${exam.id}/review`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-surface-border text-sm font-medium text-body hover:bg-surface-secondary transition-colors">
                    <BarChart3 className="w-4 h-4" /> Review
                  </Link>
                  <Link href={`/dashboard/exams/${exam.id}/take`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-surface-border text-sm font-medium text-body hover:bg-surface-secondary transition-colors">
                    Retake <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <Link href={`/dashboard/exams/${exam.id}/take`} className="w-full btn-primary text-sm !py-2.5 flex items-center justify-center">
                  {status === "in_progress" ? "Continue" : "Start"} Exam <Play className="w-4 h-4 ml-2" />
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-body-lighter mx-auto mb-3" />
          <p className="text-body-light">No exams in this category.</p>
        </div>
      )}
    </div>
  );
}
