"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, FileText, MessageSquare, TrendingUp, ArrowUp, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAdminStats, getAllUsers } from "@/services/admin";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

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
            setRecentUsers((prev) => [payload.new, ...prev].slice(0, 5));
            setStats((prev: any) => ({ ...prev, totalUsers: (prev?.totalUsers || 0) + 1 }));
          } else if (payload.eventType === 'UPDATE') {
            setRecentUsers((prev) => prev.map((u) => (u.id === payload.new.id ? { ...u, ...payload.new } : u)));
          } else if (payload.eventType === 'DELETE') {
            setRecentUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
            setStats((prev: any) => ({ ...prev, totalUsers: Math.max(0, (prev?.totalUsers || 0) - 1) }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [statsData, usersRes] = await Promise.all([
      getAdminStats(),
      getAllUsers()
    ]);
    setStats(statsData);
    if (usersRes.data) {
      setRecentUsers(usersRes.data.slice(0, 5));
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, change: "+12%", bg: "bg-blue-50", color: "text-blue-500", icon: Users },
    { label: "Questions Bank", value: stats?.totalQuestions || 0, change: "+5%", bg: "bg-green-50", color: "text-green-500", icon: BookOpen },
    { label: "Mock Exams", value: stats?.totalExams || 0, change: "+2", bg: "bg-purple-50", color: "text-purple-500", icon: FileText },
    { label: "Pending Leads", value: stats?.pendingConsultations || 0, change: "Requires action", bg: "bg-amber-50", color: "text-amber-500", icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-lg text-primary">Admin Overview</h1>
        <p className="text-sm text-body-light mt-1">Platform performance at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
            <p className="text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-body-lighter mt-0.5">{s.label}</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">{s.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart (Dummy) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-primary">User Growth</h3>
            <span className="text-xs text-body-lighter">Last 6 months</span>
          </div>
          <div className="flex items-end gap-4 h-36">
            {[120, 280, 450, 680, 920, 1200].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-primary">{v}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${(v / 1200) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.1 }} className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-light min-h-[4px]" />
                <span className="text-[10px] text-body-lighter">{["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"][i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Signups */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-primary">Recent Signups</h3>
            <Link href="/admin/users" className="text-xs text-accent-dark hover:text-accent font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-surface-border">
            {recentUsers.map((u, i) => (
              <div key={u.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {u.full_name ? u.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2) : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{u.full_name || "New User"}</p>
                    <p className="text-xs text-body-lighter">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium capitalize", u.plan === "premium" ? "bg-amber-50 text-amber-600" : u.plan === "pro" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-600")}>{u.plan || "free"}</span>
                  <p className="text-[10px] text-body-lighter mt-1">{new Date(u.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && <div className="text-sm text-body-lighter text-center py-4">No recent users.</div>}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Add Question", href: "/admin/questions", icon: BookOpen, bg: "bg-blue-50", color: "text-blue-500" },
          { label: "Manage Users", href: "/admin/users", icon: Users, bg: "bg-green-50", color: "text-green-500" },
          { label: "Create Exam", href: "/admin/exams", icon: FileText, bg: "bg-purple-50", color: "text-purple-500" },
          { label: "View Leads", href: "/admin/consultations", icon: MessageSquare, bg: "bg-amber-50", color: "text-amber-500" },
        ].map((a, i) => (
          <Link key={i} href={a.href} className="bg-white rounded-2xl p-5 border border-surface-border shadow-soft hover:shadow-medium transition-all text-center group">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3", a.bg)}>
              <a.icon className={cn("w-6 h-6", a.color)} />
            </div>
            <p className="text-sm font-medium text-primary group-hover:text-accent-dark transition-colors">{a.label}</p>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
