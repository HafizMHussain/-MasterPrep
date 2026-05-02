"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, CheckCircle2, XCircle, Bookmark, BookmarkCheck, ChevronRight, SlidersHorizontal, Loader2 } from "lucide-react";
import { getQuestions, toggleBookmark, getBookmarks } from "@/services/questions";
import { submitQuestionAttempts } from "@/services/exams";
import { useAuthStore } from "@/stores/auth-store";
import type { QuestionWithOptions } from "@/types/database";
import { cn } from "@/lib/utils";

const SYSTEMS = ["All", "Cardiovascular", "Endocrine", "Hematology", "Reproductive", "Nervous", "Renal", "Immune", "GI", "Respiratory"];
const TOPICS = ["All", "Pathology", "Pharmacology", "Biochemistry", "Microbiology", "Immunology", "Physiology"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

export default function QuestionsPage() {
  const { user } = useAuthStore();
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [system, setSystem] = useState("All");
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [answeredQs, setAnsweredQs] = useState<Record<string, string>>({}); // questionId -> optionId

  useEffect(() => {
    fetchQuestions();
    if (user) fetchBookmarks();
  }, [system, topic, difficulty, search, user]);

  const fetchQuestions = async () => {
    setLoading(true);
    const filters: any = {};
    if (system !== "All") filters.system = system;
    if (topic !== "All") filters.topic = topic;
    if (difficulty !== "All") filters.difficulty = difficulty;
    if (search) filters.search = search;

    const { data } = await getQuestions(filters);
    setQuestions(data || []);
    setLoading(false);
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    const { data } = await getBookmarks(user.id);
    if (data) {
      setBookmarkedIds(new Set(data.map((b: any) => b.question_id)));
    }
  };

  const handleToggleBookmark = async (questionId: string) => {
    if (!user) return;
    const { bookmarked } = await toggleBookmark(user.id, questionId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (bookmarked) next.add(questionId);
      else next.delete(questionId);
      return next;
    });
  };

  const handleAnswerQuestion = async (q: QuestionWithOptions, opt: any) => {
    if (!user || answeredQs[q.id]) return; // prevent multiple attempts
    setAnsweredQs(prev => ({ ...prev, [q.id]: opt.id }));
    
    await submitQuestionAttempts([{
      user_id: user.id,
      question_id: q.id,
      selected_option: opt.id,
      correct: opt.is_correct,
      time_taken: 0,
      mode: 'tutor'
    }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-lg text-primary">Question Bank</h1>
          <p className="text-sm text-body-light mt-1">{questions.length} questions loaded</p>
        </div>
      </div>

      {/* Search & Filter Toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field !pl-11" placeholder="Search questions..." />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all", showFilters ? "bg-primary text-white border-primary" : "border-surface-border text-body hover:bg-surface-secondary")}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft space-y-4">
          <div>
            <label className="text-xs font-semibold text-body-lighter uppercase tracking-wider mb-2 block">Organ System</label>
            <div className="flex flex-wrap gap-2">
              {SYSTEMS.map((s) => (
                <button key={s} onClick={() => setSystem(s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all", system === s ? "bg-primary text-white border-primary" : "border-surface-border text-body hover:bg-surface-secondary")}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-body-lighter uppercase tracking-wider mb-2 block">Subject</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button key={t} onClick={() => setTopic(t)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all", topic === t ? "bg-primary text-white border-primary" : "border-surface-border text-body hover:bg-surface-secondary")}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-body-lighter uppercase tracking-wider mb-2 block">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <button key={d} onClick={() => setDifficulty(d)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all", difficulty === d ? "bg-primary text-white border-primary" : "border-surface-border text-body hover:bg-surface-secondary")}>{d}</button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
          <p className="text-body-light mt-3">Loading questions...</p>
        </div>
      )}

      {/* Questions List */}
      {!loading && (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const isBookmarked = bookmarkedIds.has(q.id);
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedQ(selectedQ === q.id ? null : q.id)}
                className={cn("bg-white rounded-2xl p-5 border shadow-soft cursor-pointer transition-all hover:shadow-medium", selectedQ === q.id ? "border-accent/40 ring-1 ring-accent/20" : "border-surface-border")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", q.difficulty === "Easy" ? "bg-green-50 text-green-600" : q.difficulty === "Medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600")}>{q.difficulty}</span>
                      {q.system && <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium">{q.system}</span>}
                      {q.topic && <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[11px] font-medium">{q.topic}</span>}
                    </div>
                    <p className="text-sm font-medium text-primary leading-relaxed">{q.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleBookmark(q.id); }}
                      className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-accent" /> : <Bookmark className="w-5 h-5 text-body-lighter" />}
                    </button>
                    <ChevronRight className={cn("w-4 h-4 text-body-lighter transition-transform", selectedQ === q.id && "rotate-90")} />
                  </div>
                </div>

                {selectedQ === q.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-surface-border">
                    {/* Answer Options */}
                    {q.question_options && q.question_options.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {q.question_options
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((opt, oi) => {
                            const isAnswered = !!answeredQs[q.id];
                            const isUserSelection = answeredQs[q.id] === opt.id;
                            const isActuallyCorrect = opt.is_correct;
                            
                            let optionStyle = "border-surface-border hover:bg-surface-secondary";
                            let icon = null;

                            if (isAnswered) {
                              if (isActuallyCorrect) {
                                optionStyle = "bg-green-50 border-green-200 ring-1 ring-green-200";
                                icon = <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />;
                              } else if (isUserSelection) {
                                optionStyle = "bg-red-50 border-red-200 ring-1 ring-red-200";
                                icon = <XCircle className="w-4 h-4 text-red-500 ml-auto shrink-0" />;
                              } else {
                                optionStyle = "border-surface-border opacity-60";
                              }
                            }

                            return (
                              <button 
                                key={opt.id} 
                                onClick={(e) => { e.stopPropagation(); handleAnswerQuestion(q, opt); }}
                                disabled={isAnswered}
                                className={cn("w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all disabled:cursor-default", optionStyle)}
                              >
                                <span className={cn(
                                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                  isAnswered && isActuallyCorrect ? "bg-green-600 text-white" : isUserSelection ? "bg-red-500 text-white" : "bg-surface-secondary text-body-light"
                                )}>
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                <span className={cn("text-sm", isAnswered && isActuallyCorrect ? "text-green-900 font-medium" : isUserSelection ? "text-red-900 font-medium" : "text-primary")}>
                                  {opt.option_text}
                                </span>
                                {icon}
                              </button>
                            );
                          })}
                      </div>
                    )}
                    {/* Explanation */}
                    {answeredQs[q.id] && q.explanation && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Explanation</p>
                        <p className="text-sm text-body leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-body-lighter mx-auto mb-3" />
          <p className="text-body-light">No questions match your filters.</p>
          <button onClick={() => { setSystem("All"); setTopic("All"); setDifficulty("All"); setSearch(""); }} className="text-accent-dark text-sm font-medium mt-2">Clear all filters</button>
        </div>
      )}
    </div>
  );
}
