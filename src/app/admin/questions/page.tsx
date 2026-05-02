"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, BookOpen, Eye, Loader2 } from "lucide-react";
import { getQuestions } from "@/services/questions";
import { deleteQuestion } from "@/services/admin";
import { cn } from "@/lib/utils";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data } = await getQuestions();
    if (data) setQuestions(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    const { error } = await deleteQuestion(id);
    if (!error) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } else {
      alert("Error deleting question.");
    }
  };

  const filtered = questions.filter((q) => !search || q.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
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
          <h1 className="text-heading-lg text-primary">Manage Questions</h1>
          <p className="text-sm text-body-light mt-1">{questions.length} total questions</p>
        </div>
        <button className="btn-primary text-sm !py-2.5"><Plus className="w-4 h-4 mr-2" /> Add Question</button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field !pl-11" placeholder="Search questions..." />
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-secondary border-b border-surface-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Question</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">System</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Topic</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Difficulty</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((q, i) => (
                <motion.tr key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-sm font-medium text-primary truncate">{q.title}</p>
                  </td>
                  <td className="px-5 py-4"><span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium">{q.system}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-body">{q.topic}</span></td>
                  <td className="px-5 py-4"><span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", q.difficulty === "Easy" ? "bg-green-50 text-green-600" : q.difficulty === "Medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600")}>{q.difficulty}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-blue-500 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-amber-500 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg text-body-lighter hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-body-lighter text-sm">No questions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
