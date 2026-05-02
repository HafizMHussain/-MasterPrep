"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, Ban, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { getAllUsers, updateUserRole } from "@/services/admin";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUsers((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setUsers((prev) => prev.map((u) => (u.id === payload.new.id ? { ...u, ...payload.new } : u)));
          } else if (payload.eventType === 'DELETE') {
            setUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await getAllUsers();
    if (data) setUsers(data);
    setLoading(false);
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role?`)) return;
    setUpdating(userId);
    const newRole = currentRole === "admin" ? "student" : "admin";
    const { error } = await updateUserRole(userId, newRole);
    if (!error) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert("Error updating role");
    }
    setUpdating(null);
  };

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    return (u.full_name?.toLowerCase().includes(term) || false) || (u.email?.toLowerCase().includes(term) || false);
  });

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
          <h1 className="text-heading-lg text-primary">Manage Users</h1>
          <p className="text-sm text-body-light mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field !pl-11" placeholder="Search users by name or email..." />
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-secondary border-b border-surface-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Target Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Joined</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-body-lighter uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {u.full_name ? u.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">{u.full_name || "New User"}</p>
                        <p className="text-xs text-body-lighter">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", u.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600")}>{u.role}</span></td>
                  <td className="px-5 py-4"><span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize", u.plan === "premium" ? "bg-amber-50 text-amber-600" : u.plan === "pro" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600")}>{u.plan || "free"}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-body">{u.target_exam_date ? new Date(u.target_exam_date).toLocaleDateString() : "Not set"}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-body-light">{new Date(u.created_at).toLocaleDateString()}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`mailto:${u.email}`} className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-blue-500 transition-colors"><Mail className="w-4 h-4" /></a>
                      <button onClick={() => handleToggleRole(u.id, u.role)} disabled={updating === u.id} className="p-2 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-amber-500 transition-colors disabled:opacity-50">
                        {updating === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      </button>
                      <button className="p-2 rounded-lg text-body-lighter hover:bg-red-50 hover:text-red-500 transition-colors"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-body-lighter text-sm">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
