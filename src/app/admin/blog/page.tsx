"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Clock, Loader2 } from "lucide-react";
import { getAllBlogs, deleteBlog } from "@/services/admin";
import { cn } from "@/lib/utils";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data } = await getAllBlogs();
    if (data) setBlogs(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const { error } = await deleteBlog(id);
    if (!error) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert("Error deleting blog.");
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
          <h1 className="text-heading-lg text-primary">Blog Management</h1>
          <p className="text-sm text-body-light mt-1">{blogs.length} articles</p>
        </div>
        <button className="btn-primary text-sm !py-2.5"><Plus className="w-4 h-4 mr-2" /> New Article</button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-secondary border-b border-surface-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Article</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Author</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {blogs.map((post, i) => (
                <motion.tr key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-5 py-4 max-w-xs"><p className="text-sm font-medium text-primary truncate">{post.title}</p></td>
                  <td className="px-5 py-4"><span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent-dark text-[11px] font-medium">{post.category}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-body">{post.author_name}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-body-light">{new Date(post.created_at).toLocaleDateString()}</span></td>
                  <td className="px-5 py-4"><span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", post.published ? "bg-green-50 text-green-600" : "bg-surface-tertiary text-body-light")}>{post.published ? "Published" : "Draft"}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-blue-500 transition-colors">{post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                      <button className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-amber-500 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg text-body-lighter hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-body-lighter text-sm">No blog articles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
