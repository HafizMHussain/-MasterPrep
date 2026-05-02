"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, BookOpen, CheckCircle2, Circle, Coffee, FileText, Target, Flame, Loader2 } from "lucide-react";
import { STUDY_PLAN } from "@/lib/dashboard-data";
import { useAuthStore } from "@/stores/auth-store";
import { getStudyPlan, toggleTaskCompleted } from "@/services/platform";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, any> = {
  study: { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50", label: "Study" },
  review: { icon: Target, color: "text-purple-500", bg: "bg-purple-50", label: "Review" },
  exam: { icon: FileText, color: "text-green-500", bg: "bg-green-50", label: "Practice" },
  break: { icon: Coffee, color: "text-amber-500", bg: "bg-amber-50", label: "Break" },
};

export default function PlannerPage() {
  const { user, profile, loading: authLoading } = useAuthStore();
  const [dailyGoal, setDailyGoal] = useState(profile?.daily_goal || 80);
  const [dataLoading, setDataLoading] = useState(true);
  const [plan, setPlan] = useState<any>(null);

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
      const { data } = await getStudyPlan(user!.id);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    // Optimistic update if we were using real db plan
    await toggleTaskCompleted(taskId, !completed);
    fetchData(); // reload
  };

  // For the MVP, if no plan exists in DB, we'll use the static mock data
  const planData = plan ? [
    {
      date: new Date().toLocaleDateString(),
      dayLabel: "Today",
      tasks: plan.study_tasks || []
    }
  ] : STUDY_PLAN;

  const todayTasks = planData[0]?.tasks || [];
  const todayCompleted = todayTasks.filter((t: any) => t.completed).length;
  const todayTotal = todayTasks.length;
  const examDate = profile?.target_exam_date ? new Date(profile.target_exam_date).toLocaleDateString() : "Not set";
  const daysLeft = profile?.target_exam_date ? Math.max(0, Math.ceil((new Date(profile.target_exam_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-lg text-primary">Study Planner</h1>
          <p className="text-sm text-body-light mt-1">Stay on track with your personalized study schedule</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Exam Date", value: examDate, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Days Left", value: daysLeft.toString(), icon: Clock, color: "text-red-500", bg: "bg-red-50" },
          { label: "Today's Progress", value: `${todayCompleted}/${todayTotal}`, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
          { label: "Daily Goal", value: `${dailyGoal} Q`, icon: Flame, color: "text-accent-dark", bg: "bg-amber-50" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
            <p className="text-xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-body-lighter mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Daily Goal Slider */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-primary">Daily Question Goal</h3>
          <span className="text-lg font-bold text-accent-dark">{dailyGoal} questions</span>
        </div>
        <input type="range" min="20" max="200" step="10" value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))} className="w-full h-2 bg-surface-tertiary rounded-full appearance-none cursor-pointer accent-accent" />
        <div className="flex justify-between text-xs text-body-lighter mt-1">
          <span>20</span><span>200</span>
        </div>
      </motion.div>

      {/* Study Schedule */}
      <div className="space-y-6">
        {planData.map((day: any, di: number) => (
          <motion.div key={di} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + di * 0.1 }} className="bg-white rounded-2xl border border-surface-border shadow-soft overflow-hidden">
            <div className={cn("px-6 py-4 flex items-center justify-between", di === 0 ? "bg-primary" : "bg-surface-secondary")}>
              <div className="flex items-center gap-3">
                <Calendar className={cn("w-5 h-5", di === 0 ? "text-accent" : "text-body-light")} />
                <div>
                  <p className={cn("font-semibold text-sm", di === 0 ? "text-white" : "text-primary")}>{day.dayLabel}</p>
                  <p className={cn("text-xs", di === 0 ? "text-white/60" : "text-body-lighter")}>{day.date}</p>
                </div>
              </div>
              <span className={cn("text-xs font-medium px-3 py-1 rounded-full", di === 0 ? "bg-white/10 text-white" : "bg-surface-tertiary text-body-light")}>
                {day.tasks.filter((t: any) => t.completed).length}/{day.tasks.length} tasks
              </span>
            </div>
            <div className="divide-y divide-surface-border">
              {day.tasks.map((task: any) => {
                const config = TYPE_CONFIG[task.type] || TYPE_CONFIG.study;
                const Icon = config.icon;
                return (
                  <div key={task.id} className={cn("flex items-center gap-4 px-6 py-4 transition-colors", task.completed && "bg-green-50/50")}>
                    <button className="shrink-0" onClick={() => plan ? handleToggleTask(task.id, task.completed) : null}>
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-body-lighter hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                      <Icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", task.completed ? "text-body-light line-through" : "text-primary")}>{task.title}</p>
                      {task.subject && <p className="text-xs text-body-lighter">{task.subject}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", config.bg, config.color)}>{config.label}</span>
                      <span className="text-xs text-body-lighter">{task.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
