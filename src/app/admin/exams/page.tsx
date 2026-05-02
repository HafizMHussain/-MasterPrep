"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Clock, FileText, Trophy, Loader2 } from "lucide-react";
import { getExams } from "@/services/exams";
import { deleteExam } from "@/services/admin";
import { cn } from "@/lib/utils";

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    const { data } = await getExams();
    if (data) setExams(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    const { error } = await deleteExam(id);
    if (!error) {
      setExams((prev) => prev.filter((e) => e.id !== id));
    } else {
      alert("Error deleting exam.");
    }
  };

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
          <h1 className="text-heading-lg text-primary">Manage Exams</h1>
          <p className="text-sm text-body-light mt-1">{exams.length} exams configured</p>
        </div>
        <button className="btn-primary text-sm !py-2.5"><Plus className="w-4 h-4 mr-2" /> Create Exam</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam, i) => (
          <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-primary text-sm">{exam.title}</h3>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg text-body-lighter hover:text-blue-500 hover:bg-blue-50 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(exam.id)} className="p-1.5 rounded-lg text-body-lighter hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="flex items-center gap-1 text-xs text-body-light"><FileText className="w-3 h-3" /> {exam.total_questions} Q</span>
              <span className="flex items-center gap-1 text-xs text-body-light"><Clock className="w-3 h-3" /> {exam.duration} min</span>
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", exam.difficulty === "Easy" ? "bg-green-50 text-green-600" : exam.difficulty === "Hard" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>{exam.difficulty || "Mixed"}</span>
            </div>
            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-body-lighter">
              <span>Created {new Date(exam.created_at).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
        {exams.length === 0 && (
          <div className="col-span-full text-center py-8 text-body-lighter text-sm">No exams configured.</div>
        )}
      </div>
    </div>
  );
}
