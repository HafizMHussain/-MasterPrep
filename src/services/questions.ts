import { supabase } from "@/lib/supabase";
import type { QuestionWithOptions, Attempt, Bookmark } from "@/types/database";

// ─── Questions ───────────────────────────────────────

export async function getQuestions(filters?: {
  system?: string;
  topic?: string;
  difficulty?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("questions")
    .select("*, question_options(*)", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters?.system) query = query.eq("system", filters.system);
  if (filters?.topic) query = query.eq("topic", filters.topic);
  if (filters?.difficulty) query = query.eq("difficulty", filters.difficulty);
  if (filters?.search) query = query.ilike("title", `%${filters.search}%`);
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);

  const { data, error, count } = await query;
  return { data: data as QuestionWithOptions[] | null, error, count };
}

export async function getQuestionById(id: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*, question_options(*)")
    .eq("id", id)
    .single();
  return { data: data as QuestionWithOptions | null, error };
}

// ─── Attempts ────────────────────────────────────────

export async function submitAttempt(attempt: {
  user_id: string;
  question_id: string;
  selected_option: string;
  correct: boolean;
  time_taken: number;
  mode?: "tutor" | "exam" | "timed";
}) {
  const { data, error } = await supabase
    .from("attempts")
    .insert(attempt)
    .select()
    .single();
  return { data: data as Attempt | null, error };
}

export async function getUserAttempts(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from("attempts")
    .select("*, questions(title, system, topic, difficulty)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data, error };
}

export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from("attempts")
    .select("correct, questions(system, topic)")
    .eq("user_id", userId);

  if (error || !data) return { data: null, error };

  const total = data.length;
  const correctCount = data.filter((a: any) => a.correct).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Group by subject
  const bySubject: Record<string, { total: number; correct: number }> = {};
  data.forEach((a: any) => {
    const topic = a.questions?.topic || "Unknown";
    if (!bySubject[topic]) bySubject[topic] = { total: 0, correct: 0 };
    bySubject[topic].total++;
    if (a.correct) bySubject[topic].correct++;
  });

  const subjectAccuracy = Object.entries(bySubject).map(([subject, stats]) => ({
    subject,
    accuracy: Math.round((stats.correct / stats.total) * 100),
    questions: stats.total,
  }));

  return {
    data: { total, correctCount, accuracy, subjectAccuracy },
    error: null,
  };
}

// ─── Bookmarks ───────────────────────────────────────

export async function getBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*, questions(*, question_options(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function toggleBookmark(userId: string, questionId: string) {
  // Check if already bookmarked
  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .single();

  if (existing) {
    // Remove
    const { error } = await supabase.from("bookmarks").delete().eq("id", existing.id);
    return { bookmarked: false, error };
  } else {
    // Add
    const { error } = await supabase.from("bookmarks").insert({ user_id: userId, question_id: questionId });
    return { bookmarked: true, error };
  }
}
