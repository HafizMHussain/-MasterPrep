import { supabase } from "@/lib/supabase";
import type { StudyPlan, StudyTask } from "@/types/database";

// ─── Study Plans ─────────────────────────────────────

export async function getStudyPlan(userId: string) {
  const { data, error } = await supabase
    .from("study_plans")
    .select("*, study_tasks(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return { data, error };
}

export async function createStudyPlan(userId: string, plan: {
  daily_goal: number;
  exam_date: string;
}) {
  const { data, error } = await supabase
    .from("study_plans")
    .insert({ user_id: userId, ...plan })
    .select()
    .single();
  return { data: data as StudyPlan | null, error };
}

export async function addStudyTask(planId: string, task: {
  title: string;
  type: "study" | "review" | "exam" | "break";
  subject?: string;
  duration?: string;
  scheduled_date?: string;
}) {
  const { data, error } = await supabase
    .from("study_tasks")
    .insert({ plan_id: planId, ...task })
    .select()
    .single();
  return { data: data as StudyTask | null, error };
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
  const { data, error } = await supabase
    .from("study_tasks")
    .update({ completed })
    .eq("id", taskId)
    .select()
    .single();
  return { data: data as StudyTask | null, error };
}

// ─── Consultations ───────────────────────────────────

export async function submitConsultation(consultation: {
  full_name: string;
  email: string;
  phone?: string;
  consultation_type: string;
  current_step?: string;
  target_exam_date?: string;
  preferred_datetime?: string;
  notes?: string;
  user_id?: string;
}) {
  const { data, error } = await supabase
    .from("consultations")
    .insert(consultation)
    .select()
    .single();
  return { data, error };
}

// ─── Blogs ───────────────────────────────────────────

export async function getPublishedBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function getBlogBySlug(slug: string) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return { data, error };
}

// ─── Announcements ───────────────────────────────────

export async function getPublishedAnnouncements() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return { data, error };
}
