"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Search, Trash2, BookOpen, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getBookmarks, toggleBookmark } from "@/services/questions";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export default function BookmarksPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchBookmarks();
      } else {
        setDataLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchBookmarks = async () => {
    if (!user) return;
    try {
      setDataLoading(true);
      const { data } = await getBookmarks(user.id);
      setBookmarks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleRemove = async (questionId: string) => {
    if (!user) return;
    await toggleBookmark(user.id, questionId);
    setBookmarks((prev) => prev.filter((b) => b.question_id !== questionId));
  };

  const filtered = bookmarks.filter((b) =>
    !search || b.questions?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || dataLoading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
        <p className="text-body-light mt-3">Loading bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-lg text-primary">Bookmarks</h1>
          <p className="text-sm text-body-light mt-1">{bookmarks.length} saved questions</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field !pl-11" placeholder="Search bookmarks..." />
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((b, i) => {
            const q = b.questions;
            if (!q) return null;
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft hover:shadow-medium transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {q.difficulty && <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", q.difficulty === "Easy" ? "bg-green-50 text-green-600" : q.difficulty === "Medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600")}>{q.difficulty}</span>}
                      {q.system && <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium">{q.system}</span>}
                      {q.topic && <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[11px] font-medium">{q.topic}</span>}
                    </div>
                    <p className="text-sm font-medium text-primary leading-relaxed">{q.title}</p>
                  </div>
                  <button onClick={() => handleRemove(b.question_id)} className="p-2 rounded-lg text-body-lighter hover:bg-red-50 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-body-lighter mx-auto mb-3" />
          <p className="text-body-light font-medium">No bookmarks found</p>
          <p className="text-sm text-body-lighter mt-1">Bookmark questions during practice to review them later.</p>
        </div>
      )}
    </div>
  );
}
