"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, Target, Brain, Calendar, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { MONTHLY_PROGRESS, DAILY_ACTIVITY } from "@/lib/dashboard-data";
import { useAuthStore } from "@/stores/auth-store";
import { getUserStats } from "@/services/questions";
import { cn } from "@/lib/utils";

const SUBJECT_COLORS: Record<string, string> = {
  Pathology: "#EF4444",
  Pharmacology: "#F59E0B",
  Biochemistry: "#10B981",
  Microbiology: "#3B82F6",
  Immunology: "#8B5CF6",
  Physiology: "#EC4899",
};

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchData();
      } else {
        setDataLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const { data } = await getUserStats(user!.id);
      if (data) setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const totalQ = stats?.total || 0;
  const avgAccuracy = stats?.accuracy || 0;
  const maxMonthQ = Math.max(...MONTHLY_PROGRESS.map((d) => d.questions));
  const maxDailyH = Math.max(...DAILY_ACTIVITY.map((d) => d.hours));

  const subjectAccuracy = (stats?.subjectAccuracy || []).map((s: any) => ({
    ...s,
    color: SUBJECT_COLORS[s.subject] || "#64748B",
  }));

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-lg text-primary">Analytics Dashboard</h1>
        <p className="text-sm text-body-light mt-1">Comprehensive performance analysis and insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Questions", value: totalQ.toLocaleString(), icon: Brain, color: "text-blue-500", bg: "bg-blue-50", change: "+12 this month", up: true },
          { label: "Avg Accuracy", value: `${avgAccuracy}%`, icon: Target, color: "text-green-500", bg: "bg-green-50", change: "+2% this month", up: true },
          { label: "Study Hours", value: "18h", icon: Clock, color: "text-purple-500", bg: "bg-purple-50", change: "+4h this week", up: true },
          { label: "Predicted Score", value: "248", icon: TrendingUp, color: "text-accent-dark", bg: "bg-amber-50", change: "+12 points", up: true },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
            <p className="text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-body-lighter mt-0.5">{s.label}</p>
            <div className="flex items-center gap-1 mt-2">
              {s.up ? <ArrowUp className="w-3 h-3 text-green-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />}
              <span className="text-xs text-green-600 font-medium">{s.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Accuracy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
          <h3 className="font-semibold text-primary mb-5">Subject Accuracy</h3>
          {subjectAccuracy.length > 0 ? (
            <div className="space-y-4">
              {subjectAccuracy.map((s: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-primary">{s.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-body-lighter">{s.questions} Q</span>
                      <span className={cn("font-semibold", s.accuracy >= 80 ? "text-green-500" : s.accuracy >= 65 ? "text-amber-500" : "text-red-500")}>{s.accuracy}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-surface-tertiary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.accuracy}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} className="h-full rounded-full" style={{ backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-body-lighter text-sm">
              Not enough data. Start answering questions to see your subject accuracy!
            </div>
          )}
        </motion.div>

        {/* Monthly Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
          <h3 className="font-semibold text-primary mb-5">Monthly Progress</h3>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-body-lighter uppercase tracking-wider mb-3">Questions Completed</p>
              <div className="flex items-end gap-4 h-32">
                {MONTHLY_PROGRESS.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-primary">{d.questions}</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.questions / maxMonthQ) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.1 }} className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 min-h-[4px]" />
                    <span className="text-[11px] text-body-lighter">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-surface-border">
              <p className="text-xs font-semibold text-body-lighter uppercase tracking-wider mb-3">Score Trend</p>
              <div className="flex items-end gap-4 h-24">
                {MONTHLY_PROGRESS.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-green-600">{d.score}%</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${d.score}%` }} transition={{ duration: 0.5, delay: i * 0.1 }} className="w-full rounded-t-lg bg-gradient-to-t from-green-500 to-green-400 min-h-[4px]" />
                    <span className="text-[11px] text-body-lighter">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
        <h3 className="font-semibold text-primary mb-5">Daily Activity (This Week)</h3>
        <div className="grid grid-cols-7 gap-3">
          {DAILY_ACTIVITY.map((d, i) => (
            <div key={i} className="text-center">
              <div className="bg-surface-secondary rounded-xl p-4 mb-2">
                <p className="text-lg font-bold text-primary">{d.hours}h</p>
                <p className="text-[11px] text-body-lighter">study time</p>
                <div className="mt-2 pt-2 border-t border-surface-border">
                  <p className="text-sm font-semibold text-primary">{d.questions}</p>
                  <p className="text-[10px] text-body-lighter">questions</p>
                </div>
              </div>
              <span className="text-xs font-medium text-body-light">{d.date}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
