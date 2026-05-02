import { supabase } from "@/lib/supabase";
import type { MockExam, MockExamAttempt } from "@/types/database";

// ─── Mock Exams ──────────────────────────────────────

export async function getExams() {
  const { data, error } = await supabase
    .from("mock_exams")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return { data: data as MockExam[] | null, error };
}

export async function getExamById(id: string) {
  const { data, error } = await supabase
    .from("mock_exams")
    .select("*, mock_exam_questions(*, questions(*, question_options(*)))")
    .eq("id", id)
    .single();
  return { data, error };
}

export async function getUserExamAttempts(userId: string) {
  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .select("*, mock_exams(title, total_questions, duration)")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });
  return { data, error };
}

export async function startExamAttempt(userId: string, examId: string) {
  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .insert({
      user_id: userId,
      exam_id: examId,
      completed: false,
    })
    .select()
    .single();
  return { data: data as MockExamAttempt | null, error };
}

export async function completeExamAttempt(attemptId: string, results: {
  score: number;
  total_correct: number;
  total_attempted: number;
  time_spent: number;
}) {
  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .update({
      ...results,
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", attemptId)
    .select()
    .single();
  return { data: data as MockExamAttempt | null, error };
}

export async function submitQuestionAttempts(attemptsData: any[]) {
  const { data, error } = await supabase
    .from("attempts")
    .insert(attemptsData)
    .select();
  return { data, error };
}

export async function getExamAttemptReview(userId: string, examId: string) {
  // Get the most recent completed attempt for this exam
  const { data: attempt, error: attemptError } = await supabase
    .from("mock_exam_attempts")
    .select("*, mock_exams(*)")
    .eq("user_id", userId)
    .eq("exam_id", examId)
    .eq("completed", true)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (attemptError || !attempt) return { data: null, error: attemptError };

  // Get the exam questions and the user's specific answers for this attempt
  const { data: examData, error: examError } = await supabase
    .from("mock_exams")
    .select("*, mock_exam_questions(*, questions(*, question_options(*)))")
    .eq("id", examId)
    .single();

  if (examError || !examData) return { data: null, error: examError };

  // Get user's recent answers for these questions
  const questionIds = examData.mock_exam_questions.map((mq: any) => mq.question_id);
  
  const { data: userAnswers, error: answersError } = await supabase
    .from("attempts")
    .select("*")
    .eq("user_id", userId)
    .in("question_id", questionIds)
    .order("created_at", { ascending: false });

  return {
    data: {
      attempt,
      examData,
      userAnswers: userAnswers || []
    },
    error: null
  };
}
