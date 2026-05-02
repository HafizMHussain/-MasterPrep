// ─── Database Types ──────────────────────────────────
// These types mirror the Supabase PostgreSQL schema

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "student" | "admin";
  phone: string | null;
  location: string | null;
  medical_school: string | null;
  current_step: string | null;
  bio: string | null;
  target_exam_date: string | null;
  daily_goal: number;
  plan: "free" | "pro" | "premium";
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  title: string;
  explanation: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  system: string | null;
  topic: string | null;
  image_url: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  sort_order: number;
}

export interface QuestionWithOptions extends Question {
  question_options: QuestionOption[];
}

export interface Attempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_option: string | null;
  correct: boolean | null;
  time_taken: number | null;
  mode: "tutor" | "exam" | "timed";
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}

export interface BookmarkWithQuestion extends Bookmark {
  questions: Question;
}

export interface MockExam {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  total_questions: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

export interface MockExamQuestion {
  id: string;
  exam_id: string;
  question_id: string;
  sort_order: number;
}

export interface MockExamAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  score: number | null;
  total_correct: number | null;
  total_attempted: number | null;
  time_spent: number | null;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  daily_goal: number;
  exam_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudyTask {
  id: string;
  plan_id: string;
  title: string;
  type: "study" | "review" | "exam" | "break";
  subject: string | null;
  duration: string | null;
  scheduled_date: string | null;
  completed: boolean;
  sort_order: number;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image: string | null;
  author_name: string | null;
  read_time: string | null;
  published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  consultation_type: string | null;
  current_step: string | null;
  target_exam_date: string | null;
  preferred_datetime: string | null;
  notes: string | null;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  type: "update" | "maintenance" | "feature" | "promo";
  published: boolean;
  created_by: string | null;
  created_at: string;
}
