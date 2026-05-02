import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Bookmark,
  Calendar,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

// ─── Dashboard Sidebar ───────────────────────────────────
export interface SidebarLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const DASHBOARD_LINKS: SidebarLink[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Question Bank", href: "/dashboard/questions" },
  { icon: FileText, label: "Mock Exams", href: "/dashboard/exams" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Bookmark, label: "Bookmarks", href: "/dashboard/bookmarks" },
  { icon: Calendar, label: "Study Planner", href: "/dashboard/planner" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

// ─── Dashboard Stats ─────────────────────────────────────
export const DASHBOARD_STATS = [
  { label: "Questions Solved", value: "1,247", change: "+32 today", trend: "up" as const, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Accuracy", value: "78%", change: "+3% this week", trend: "up" as const, color: "text-green-500", bg: "bg-green-50" },
  { label: "Study Streak", value: "12 days", change: "Best: 21 days", trend: "up" as const, color: "text-accent-dark", bg: "bg-amber-50" },
  { label: "Readiness Score", value: "72/100", change: "+5 this week", trend: "up" as const, color: "text-purple-500", bg: "bg-purple-50" },
];

// ─── Weekly Performance ──────────────────────────────────
export const WEEKLY_PERFORMANCE = [
  { day: "Mon", questions: 45, accuracy: 72 },
  { day: "Tue", questions: 62, accuracy: 78 },
  { day: "Wed", questions: 38, accuracy: 65 },
  { day: "Thu", questions: 55, accuracy: 80 },
  { day: "Fri", questions: 70, accuracy: 82 },
  { day: "Sat", questions: 48, accuracy: 75 },
  { day: "Sun", questions: 30, accuracy: 88 },
];

// ─── Weak Subjects ───────────────────────────────────────
export const WEAK_SUBJECTS = [
  { name: "Biochemistry", accuracy: 55, total: 120, color: "bg-red-500" },
  { name: "Microbiology", accuracy: 62, total: 95, color: "bg-orange-500" },
  { name: "Pharmacology", accuracy: 68, total: 180, color: "bg-amber-500" },
  { name: "Immunology", accuracy: 70, total: 75, color: "bg-yellow-500" },
];

// ─── Recent Activity ─────────────────────────────────────
export const RECENT_ACTIVITY = [
  { action: "Completed", detail: "Cardiology Practice Set", count: "40 questions", accuracy: "85%", time: "2h ago" },
  { action: "Started", detail: "Mock Exam #5", count: "200 questions", accuracy: "—", time: "5h ago" },
  { action: "Reviewed", detail: "Pharmacology Bookmarks", count: "15 questions", accuracy: "73%", time: "Yesterday" },
  { action: "Completed", detail: "Pathology Quick Quiz", count: "20 questions", accuracy: "90%", time: "Yesterday" },
  { action: "Completed", detail: "Biochemistry Focus Set", count: "30 questions", accuracy: "60%", time: "2 days ago" },
];

// ─── Questions Bank (Dummy) ──────────────────────────────
export interface Question {
  id: string;
  title: string;
  system: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  attempted: boolean;
  correct?: boolean;
  bookmarked: boolean;
}

export const DUMMY_QUESTIONS: Question[] = [
  { id: "q1", title: "A 55-year-old male presents with chest pain radiating to the left arm. ECG shows ST elevation in II, III, aVF...", system: "Cardiovascular", topic: "Pathology", difficulty: "Medium", attempted: true, correct: true, bookmarked: false },
  { id: "q2", title: "A 30-year-old woman presents with fatigue, weight gain, and cold intolerance. Lab shows elevated TSH...", system: "Endocrine", topic: "Pathology", difficulty: "Easy", attempted: true, correct: false, bookmarked: true },
  { id: "q3", title: "Which enzyme is deficient in Gaucher disease?", system: "Hematology", topic: "Biochemistry", difficulty: "Easy", attempted: false, bookmarked: false },
  { id: "q4", title: "A 22-year-old male presents with painless testicular mass. Serum AFP is elevated. Most likely diagnosis?", system: "Reproductive", topic: "Pathology", difficulty: "Medium", attempted: true, correct: true, bookmarked: true },
  { id: "q5", title: "Which drug is the first-line treatment for absence seizures in children?", system: "Nervous", topic: "Pharmacology", difficulty: "Easy", attempted: true, correct: true, bookmarked: false },
  { id: "q6", title: "A 45-year-old woman with SLE presents with proteinuria. Renal biopsy shows wire-loop lesions...", system: "Renal", topic: "Pathology", difficulty: "Hard", attempted: false, bookmarked: false },
  { id: "q7", title: "Which cytokine is primarily responsible for granuloma formation?", system: "Immune", topic: "Immunology", difficulty: "Medium", attempted: true, correct: false, bookmarked: true },
  { id: "q8", title: "A newborn presents with projectile vomiting at 3 weeks. Olive-shaped mass palpated. Diagnosis?", system: "GI", topic: "Pathology", difficulty: "Easy", attempted: true, correct: true, bookmarked: false },
  { id: "q9", title: "Which hepatitis virus is a defective RNA virus requiring HBV for replication?", system: "GI", topic: "Microbiology", difficulty: "Easy", attempted: false, bookmarked: false },
  { id: "q10", title: "A patient on isoniazid develops peripheral neuropathy. Which vitamin should be supplemented?", system: "Nervous", topic: "Pharmacology", difficulty: "Easy", attempted: true, correct: true, bookmarked: false },
  { id: "q11", title: "What is the mechanism of action of omeprazole?", system: "GI", topic: "Pharmacology", difficulty: "Easy", attempted: true, correct: true, bookmarked: false },
  { id: "q12", title: "A 60-year-old smoker presents with weight loss, hemoptysis, and hypercalcemia. Most likely lung cancer type?", system: "Respiratory", topic: "Pathology", difficulty: "Medium", attempted: false, bookmarked: true },
];

// ─── Mock Exams ──────────────────────────────────────────
export interface MockExam {
  id: string;
  title: string;
  totalQuestions: number;
  duration: number; // minutes
  difficulty: "Mixed" | "Easy" | "Medium" | "Hard";
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  date?: string;
}

export const MOCK_EXAMS: MockExam[] = [
  { id: "e1", title: "USMLE Step 1 — Full Length #1", totalQuestions: 280, duration: 480, difficulty: "Mixed", status: "completed", score: 78, date: "Apr 28, 2026" },
  { id: "e2", title: "USMLE Step 1 — Full Length #2", totalQuestions: 280, duration: 480, difficulty: "Mixed", status: "completed", score: 82, date: "Apr 22, 2026" },
  { id: "e3", title: "Pathology Focus Exam", totalQuestions: 50, duration: 60, difficulty: "Medium", status: "completed", score: 86, date: "Apr 20, 2026" },
  { id: "e4", title: "Pharmacology Rapid Review", totalQuestions: 40, duration: 45, difficulty: "Easy", status: "in_progress" },
  { id: "e5", title: "USMLE Step 1 — Full Length #3", totalQuestions: 280, duration: 480, difficulty: "Mixed", status: "not_started" },
  { id: "e6", title: "Biochemistry Challenge", totalQuestions: 50, duration: 60, difficulty: "Hard", status: "not_started" },
  { id: "e7", title: "Cardiology Deep Dive", totalQuestions: 40, duration: 50, difficulty: "Medium", status: "not_started" },
  { id: "e8", title: "USMLE Step 2 CK — Mini Mock", totalQuestions: 100, duration: 150, difficulty: "Mixed", status: "not_started" },
];

// ─── Analytics Data ──────────────────────────────────────
export const SUBJECT_ACCURACY = [
  { subject: "Pathology", accuracy: 82, questions: 350, color: "#3B82F6" },
  { subject: "Pharmacology", accuracy: 68, questions: 280, color: "#8B5CF6" },
  { subject: "Physiology", accuracy: 90, questions: 200, color: "#10B981" },
  { subject: "Biochemistry", accuracy: 55, questions: 180, color: "#F59E0B" },
  { subject: "Microbiology", accuracy: 62, questions: 150, color: "#EF4444" },
  { subject: "Anatomy", accuracy: 85, questions: 120, color: "#06B6D4" },
  { subject: "Immunology", accuracy: 70, questions: 100, color: "#EC4899" },
  { subject: "Behavioral Science", accuracy: 88, questions: 80, color: "#14B8A6" },
];

export const MONTHLY_PROGRESS = [
  { month: "Jan", score: 52, questions: 200 },
  { month: "Feb", score: 58, questions: 350 },
  { month: "Mar", score: 62, questions: 480 },
  { month: "Apr", score: 71, questions: 620 },
  { month: "May", score: 78, questions: 800 },
];

export const DAILY_ACTIVITY = [
  { date: "Mon", hours: 6.5, questions: 85 },
  { date: "Tue", hours: 8, questions: 102 },
  { date: "Wed", hours: 5, questions: 65 },
  { date: "Thu", hours: 7.5, questions: 95 },
  { date: "Fri", hours: 9, questions: 110 },
  { date: "Sat", hours: 4, questions: 48 },
  { date: "Sun", hours: 3, questions: 30 },
];

// ─── Study Plan ──────────────────────────────────────────
export interface StudyTask {
  id: string;
  title: string;
  type: "study" | "review" | "exam" | "break";
  subject?: string;
  duration: string;
  completed: boolean;
}

export interface StudyDay {
  date: string;
  dayLabel: string;
  tasks: StudyTask[];
}

export const STUDY_PLAN: StudyDay[] = [
  {
    date: "2026-05-03",
    dayLabel: "Today",
    tasks: [
      { id: "t1", title: "Pathology — Cardiovascular", type: "study", subject: "Pathology", duration: "2h", completed: true },
      { id: "t2", title: "Pharmacology Review", type: "review", subject: "Pharmacology", duration: "1.5h", completed: true },
      { id: "t3", title: "Practice Questions (40)", type: "exam", duration: "45min", completed: false },
      { id: "t4", title: "Break", type: "break", duration: "30min", completed: false },
      { id: "t5", title: "Biochemistry — Metabolism", type: "study", subject: "Biochemistry", duration: "2h", completed: false },
    ],
  },
  {
    date: "2026-05-04",
    dayLabel: "Tomorrow",
    tasks: [
      { id: "t6", title: "Microbiology — Bacteria", type: "study", subject: "Microbiology", duration: "2h", completed: false },
      { id: "t7", title: "Weak Area Review", type: "review", duration: "1h", completed: false },
      { id: "t8", title: "Mini Mock Exam (50 Q)", type: "exam", duration: "1h", completed: false },
      { id: "t9", title: "Physiology — Renal", type: "study", subject: "Physiology", duration: "2h", completed: false },
    ],
  },
  {
    date: "2026-05-05",
    dayLabel: "Monday",
    tasks: [
      { id: "t10", title: "Anatomy — Neuroanatomy", type: "study", subject: "Anatomy", duration: "2h", completed: false },
      { id: "t11", title: "Pharmacology — Antibiotics", type: "study", subject: "Pharmacology", duration: "1.5h", completed: false },
      { id: "t12", title: "Practice Questions (60)", type: "exam", duration: "1h", completed: false },
      { id: "t13", title: "Immunology Review", type: "review", subject: "Immunology", duration: "1h", completed: false },
    ],
  },
  {
    date: "2026-05-06",
    dayLabel: "Tuesday",
    tasks: [
      { id: "t14", title: "Full-Length Mock Exam", type: "exam", duration: "8h", completed: false },
      { id: "t15", title: "Exam Review", type: "review", duration: "2h", completed: false },
    ],
  },
  {
    date: "2026-05-07",
    dayLabel: "Wednesday",
    tasks: [
      { id: "t16", title: "Pathology — Respiratory", type: "study", subject: "Pathology", duration: "2h", completed: false },
      { id: "t17", title: "Behavioral Science", type: "study", subject: "Behavioral", duration: "1.5h", completed: false },
      { id: "t18", title: "Break Day — Light Review Only", type: "break", duration: "—", completed: false },
    ],
  },
];

// ─── Admin Data ──────────────────────────────────────────
export const ADMIN_STATS = [
  { label: "Total Users", value: "2,547", change: "+48 this week", color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Total Questions", value: "2,156", change: "+12 this week", color: "text-green-500", bg: "bg-green-50" },
  { label: "Active Exams", value: "24", change: "+3 new", color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Consultations", value: "156", change: "+8 pending", color: "text-amber-500", bg: "bg-amber-50" },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  plan: "free" | "pro" | "premium";
  joinDate: string;
  questionsAttempted: number;
  status: "active" | "inactive";
}

export const ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "Sarah Ahmed", email: "sarah@example.com", role: "student", plan: "premium", joinDate: "Jan 15, 2026", questionsAttempted: 1520, status: "active" },
  { id: "u2", name: "Michael Chen", email: "michael@example.com", role: "student", plan: "pro", joinDate: "Feb 2, 2026", questionsAttempted: 980, status: "active" },
  { id: "u3", name: "Priya Patel", email: "priya@example.com", role: "student", plan: "pro", joinDate: "Mar 10, 2026", questionsAttempted: 750, status: "active" },
  { id: "u4", name: "James Wilson", email: "james@example.com", role: "student", plan: "free", joinDate: "Apr 1, 2026", questionsAttempted: 120, status: "active" },
  { id: "u5", name: "Fatima Hassan", email: "fatima@example.com", role: "student", plan: "premium", joinDate: "Jan 28, 2026", questionsAttempted: 1890, status: "active" },
  { id: "u6", name: "David Kim", email: "david@example.com", role: "admin", plan: "premium", joinDate: "Dec 5, 2025", questionsAttempted: 0, status: "active" },
  { id: "u7", name: "Emily Watson", email: "emily@example.com", role: "student", plan: "pro", joinDate: "Mar 22, 2026", questionsAttempted: 450, status: "inactive" },
  { id: "u8", name: "Raj Mehta", email: "raj@example.com", role: "student", plan: "free", joinDate: "Apr 15, 2026", questionsAttempted: 85, status: "active" },
];

export interface AdminConsultation {
  id: string;
  name: string;
  email: string;
  type: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled" | "pending";
}

export const ADMIN_CONSULTATIONS: AdminConsultation[] = [
  { id: "c1", name: "Sarah Ahmed", email: "sarah@example.com", type: "Study Strategy", date: "May 5, 2026 10:00 AM", status: "scheduled" },
  { id: "c2", name: "Michael Chen", email: "michael@example.com", type: "Score Review", date: "May 4, 2026 2:00 PM", status: "scheduled" },
  { id: "c3", name: "Priya Patel", email: "priya@example.com", type: "Resource Recommendation", date: "Apr 30, 2026 11:00 AM", status: "completed" },
  { id: "c4", name: "James Wilson", email: "james@example.com", type: "Residency Planning", date: "Apr 28, 2026 3:00 PM", status: "completed" },
  { id: "c5", name: "New Lead", email: "newlead@example.com", type: "Study Strategy", date: "—", status: "pending" },
  { id: "c6", name: "Another Lead", email: "another@example.com", type: "Score Review", date: "—", status: "pending" },
];
