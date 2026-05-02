"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BookOpen, Clock, Target, Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { getUserStats, getUserAttempts } from "@/services/questions";
import { cn } from "@/lib/utils";

// Mock weekly data for the chart, as we don't have enough historical data yet
const WEEKLY_PERFORMANCE = [
  { day: "Mon", questions: 45, accuracy: 72 },
  { day: "Tue", questions: 55, accuracy: 75 },
  { day: "Wed", questions: 30, accuracy: 68 },
  { day: "Thu", questions: 80, accuracy: 80 },
  { day: "Fri", questions: 65, accuracy: 78 },
  { day: "Sat", questions: 120, accuracy: 82 },
  { day: "Sun", questions: 90, accuracy: 79 },
];

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchData();
      } else {
        // If not authenticated, we shouldn't fetch data.
        setDataLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const [statsRes, attemptsRes] = await Promise.all([
        getUserStats(user!.id),
        getUserAttempts(user!.id, 5)
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      if (attemptsRes?.data) setAttempts(attemptsRes.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const maxQ = Math.max(...WEEKLY_PERFORMANCE.map((d) => d.questions));
  
  const fullDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Student";
  const displayName = fullDisplayName.split(" ")[0];

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const weakSubjects = (stats?.subjectAccuracy || [])
    .filter((s: any) => s.accuracy < 75)
    .sort((a: any, b: any) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const statCards = [
    { label: "Total Questions", value: stats?.total || 0, change: "+12", trend: "up", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Overall Accuracy", value: `${stats?.accuracy || 0}%`, change: "+2%", trend: "up", color: "text-green-500", bg: "bg-green-50" },
    { label: "Current Streak", value: "3 days", change: "Personal best: 7", trend: "up", color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Daily Goal", value: `${profile?.daily_goal || 80} Q`, change: "45% completed", trend: "up", color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-xl text-primary">Welcome back, {displayName}! 👋</h1>
          <p className="text-body-light mt-1">Here&apos;s your study progress overview.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/questions" className="btn-primary text-sm !py-2.5">
            <BookOpen className="w-4 h-4 mr-2" /> Practice Now
          </Link>
          <Link href="/dashboard/exams" className="btn-ghost text-sm border border-surface-border !py-2.5">
            <Clock className="w-4 h-4 mr-2" /> Take Exam
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
              {i === 0 && <Target className={cn("w-5 h-5", stat.color)} />}
              {i === 1 && <TrendingUp className={cn("w-5 h-5", stat.color)} />}
              {i === 2 && <Flame className={cn("w-5 h-5", stat.color)} />}
              {i === 3 && <BookOpen className={cn("w-5 h-5", stat.color)} />}
            </div>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-body-lighter mt-0.5">{stat.label}</p>
            <div className="flex items-center gap-1 mt-2">
              {stat.trend === "up" ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Performance Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-primary">Weekly Performance</h3>
            <span className="text-xs text-body-lighter">Questions per day</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {WEEKLY_PERFORMANCE.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-primary">{d.questions}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.questions / maxQ) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-light min-h-[4px]"
                />
                <span className="text-[11px] text-body-lighter">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between">
            <p className="text-sm text-body-light">
              Avg: <span className="font-semibold text-primary">{Math.round(WEEKLY_PERFORMANCE.reduce((s, d) => s + d.questions, 0) / 7)}</span> questions/day
            </p>
            <p className="text-sm text-body-light">
              Avg accuracy: <span className="font-semibold text-green-600">{Math.round(WEEKLY_PERFORMANCE.reduce((s, d) => s + d.accuracy, 0) / 7)}%</span>
            </p>
          </div>
        </motion.div>

        {/* Weak Subjects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-primary">Weak Areas</h3>
            <Link href="/dashboard/analytics" className="text-xs text-accent-dark hover:text-accent font-medium">View all →</Link>
          </div>
          {weakSubjects.length > 0 ? (
            <div className="space-y-4">
              {weakSubjects.map((s: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-primary">{s.subject}</span>
                    <span className={cn("font-semibold", s.accuracy < 60 ? "text-red-500" : s.accuracy < 70 ? "text-amber-500" : "text-green-500")}>{s.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.accuracy}%` }} transition={{ duration: 0.6, delay: i * 0.1 }} className={cn("h-full rounded-full", s.accuracy < 60 ? "bg-red-500" : s.accuracy < 70 ? "bg-amber-500" : "bg-green-500")} />
                  </div>
                  <p className="text-[11px] text-body-lighter mt-1">{s.questions} questions attempted</p>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-8 text-body-lighter text-sm">
               Not enough data to determine weak areas. Keep practicing!
             </div>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
        <h3 className="font-semibold text-primary mb-4">Recent Activity</h3>
        <div className="divide-y divide-surface-border">
          {attempts.length > 0 ? (
            attempts.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", a.correct ? "bg-green-500" : "bg-red-500")} />
                  <div>
                    <p className="text-sm font-medium text-primary line-clamp-1">{a.questions?.title || "Question"}</p>
                    <p className="text-xs text-body-lighter">{a.questions?.system} · {a.questions?.topic}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn("text-xs font-medium px-2 py-1 rounded-md", a.correct ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                    {a.correct ? "Correct" : "Incorrect"}
                  </span>
                  <p className="text-[10px] text-body-lighter mt-1">{new Date(a.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-body-lighter">No recent activity.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
