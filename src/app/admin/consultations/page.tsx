"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, Calendar, Mail, MessageSquare, Loader2 } from "lucide-react";
import { getAllConsultations, updateConsultationStatus } from "@/services/admin";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, any> = {
  scheduled: { color: "bg-blue-50 text-blue-600", label: "Scheduled" },
  completed: { color: "bg-green-50 text-green-600", label: "Completed" },
  cancelled: { color: "bg-red-50 text-red-500", label: "Cancelled" },
  pending: { color: "bg-amber-50 text-amber-600", label: "Pending" },
};

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    const { data } = await getAllConsultations();
    if (data) setConsultations(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: "scheduled" | "completed" | "cancelled" | "pending") => {
    setUpdating(id);
    const { error } = await updateConsultationStatus(id, status);
    if (!error) {
      setConsultations((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    } else {
      alert("Error updating status.");
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
      <div>
        <h1 className="text-heading-lg text-primary">Consultation Leads</h1>
        <p className="text-sm text-body-light mt-1">{consultations.length} total · {consultations.filter((c) => c.status === "pending").length} pending review</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-secondary border-b border-surface-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Date / Time</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {consultations.map((c, i) => {
                const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-primary">{c.full_name}</p>
                        <p className="text-xs text-body-lighter">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="text-sm text-body">{c.consultation_type}</span></td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-body-light">
                        {c.preferred_datetime ? new Date(c.preferred_datetime).toLocaleString() : "Not specified"}
                      </span>
                    </td>
                    <td className="px-5 py-4"><span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", status.color)}>{status.label}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`mailto:${c.email}`} className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-blue-500 transition-colors"><Mail className="w-4 h-4" /></a>
                        {c.status === "pending" && (
                          <>
                            <button disabled={updating === c.id} onClick={() => handleStatusChange(c.id, "scheduled")} className="p-2 rounded-lg text-body-lighter hover:bg-green-50 hover:text-green-500 transition-colors disabled:opacity-50">
                              {updating === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button disabled={updating === c.id} onClick={() => handleStatusChange(c.id, "cancelled")} className="p-2 rounded-lg text-body-lighter hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {c.status === "scheduled" && (
                          <button disabled={updating === c.id} onClick={() => handleStatusChange(c.id, "completed")} className="p-2 rounded-lg text-body-lighter hover:bg-green-50 hover:text-green-500 transition-colors disabled:opacity-50">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {consultations.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-body-lighter text-sm">No consultation leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
