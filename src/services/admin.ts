import { supabase } from "@/lib/supabase";
import type { Profile, Question, QuestionOption, MockExam, Blog, Consultation, Announcement } from "@/types/database";

// ─── Admin: Users ────────────────────────────────────

export async function getAllUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: data as Profile[] | null, error };
}

export async function updateUserRole(userId: string, role: "student" | "admin") {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

// ─── Admin: Questions ────────────────────────────────

export async function createQuestion(question: {
  title: string;
  explanation?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  system?: string;
  topic?: string;
  created_by?: string;
}, options: { option_text: string; is_correct: boolean; sort_order: number }[]) {
  // Insert question
  const { data: q, error: qError } = await supabase
    .from("questions")
    .insert(question)
    .select()
    .single();

  if (qError || !q) return { data: null, error: qError };

  // Insert options
  const { error: oError } = await supabase
    .from("question_options")
    .insert(options.map((o) => ({ ...o, question_id: q.id })));

  return { data: q, error: oError };
}

export async function updateQuestion(id: string, updates: Partial<Question>) {
  const { data, error } = await supabase
    .from("questions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase.from("questions").delete().eq("id", id);
  return { error };
}

// ─── Admin: Exams ────────────────────────────────────

export async function createExam(exam: {
  title: string;
  description?: string;
  duration: number;
  total_questions: number;
  difficulty?: "Easy" | "Medium" | "Hard" | "Mixed";
  created_by?: string;
}) {
  const { data, error } = await supabase
    .from("mock_exams")
    .insert(exam)
    .select()
    .single();
  return { data, error };
}

export async function deleteExam(id: string) {
  const { error } = await supabase.from("mock_exams").delete().eq("id", id);
  return { error };
}

// ─── Admin: Blogs ────────────────────────────────────

export async function getAllBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createBlog(blog: {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author_name?: string;
  read_time?: string;
  published?: boolean;
  created_by?: string;
}) {
  const { data, error } = await supabase
    .from("blogs")
    .insert(blog)
    .select()
    .single();
  return { data, error };
}

export async function updateBlog(id: string, updates: Partial<Blog>) {
  const { data, error } = await supabase
    .from("blogs")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

export async function deleteBlog(id: string) {
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  return { error };
}

// ─── Admin: Consultations ────────────────────────────

export async function getAllConsultations() {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function updateConsultationStatus(id: string, status: "pending" | "scheduled" | "completed" | "cancelled") {
  const { data, error } = await supabase
    .from("consultations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

// ─── Admin: Announcements ────────────────────────────

export async function getAllAnnouncements() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createAnnouncement(announcement: {
  title: string;
  content?: string;
  type?: "update" | "maintenance" | "feature" | "promo";
  published?: boolean;
  created_by?: string;
}) {
  const { data, error } = await supabase
    .from("announcements")
    .insert(announcement)
    .select()
    .single();
  return { data, error };
}

export async function toggleAnnouncementPublish(id: string, published: boolean) {
  const { data, error } = await supabase
    .from("announcements")
    .update({ published })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  return { error };
}

// ─── Admin: Dashboard Stats ─────────────────────────

export async function getAdminStats() {
  const [users, questions, exams, consultations] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("questions").select("id", { count: "exact", head: true }),
    supabase.from("mock_exams").select("id", { count: "exact", head: true }),
    supabase.from("consultations").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return {
    totalUsers: users.count || 0,
    totalQuestions: questions.count || 0,
    totalExams: exams.count || 0,
    pendingConsultations: consultations.count || 0,
  };
}
