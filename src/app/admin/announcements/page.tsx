"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Megaphone, Eye, EyeOff, Loader2 } from "lucide-react";
import { getAllAnnouncements, toggleAnnouncementPublish, deleteAnnouncement } from "@/services/admin";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  update: { color: "bg-blue-50 text-blue-600", label: "Update" },
  maintenance: { color: "bg-amber-50 text-amber-600", label: "Maintenance" },
  feature: { color: "bg-green-50 text-green-600", label: "Feature" },
  promo: { color: "bg-purple-50 text-purple-600", label: "Promotion" },
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data } = await getAllAnnouncements();
    if (data) setAnnouncements(data);
    setLoading(false);
  };

  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    setUpdating(id);
    const { error } = await toggleAnnouncementPublish(id, !currentlyPublished);
    if (!error) {
      setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, published: !currentlyPublished } : a));
    } else {
      alert("Error updating announcement status.");
    }
    setUpdating(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    setUpdating(id);
    const { error } = await deleteAnnouncement(id);
    if (!error) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } else {
      alert("Error deleting announcement.");
    }
    setUpdating(null);
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
          <h1 className="text-heading-lg text-primary">Announcements</h1>
          <p className="text-sm text-body-light mt-1">{announcements.length} announcements</p>
        </div>
        <button className="btn-primary text-sm !py-2.5"><Plus className="w-4 h-4 mr-2" /> New Announcement</button>
      </div>

      <div className="space-y-4">
        {announcements.map((a, i) => {
          const type = TYPE_CONFIG[a.type || "update"] || TYPE_CONFIG.update;
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Megaphone className="w-5 h-5 text-accent-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-primary text-sm">{a.title}</h3>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", type.color)}>{type.label}</span>
                      {a.published ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">Published</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">Draft</span>
                      )}
                    </div>
                    <p className="text-sm text-body-light">{a.content}</p>
                    <p className="text-xs text-body-lighter mt-2">{new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button disabled={updating === a.id} onClick={() => handleTogglePublish(a.id, a.published)} className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-blue-500 transition-colors disabled:opacity-50">
                    {updating === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : a.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-amber-500 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button disabled={updating === a.id} onClick={() => handleDelete(a.id)} className="p-2 rounded-lg text-body-lighter hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {announcements.length === 0 && (
          <div className="text-center py-8 text-body-lighter text-sm">No announcements configured.</div>
        )}
      </div>
    </div>
  );
}
