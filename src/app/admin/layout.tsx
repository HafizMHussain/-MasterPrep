"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, LogOut, Menu, X, Bell, ChevronDown, LayoutDashboard, BookOpen, Users, FileText, MessageSquare, Megaphone, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: BookOpen, label: "Questions", href: "/admin/questions" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: FileText, label: "Exams", href: "/admin/exams" },
  { icon: FileText, label: "Blog", href: "/admin/blog" },
  { icon: MessageSquare, label: "Consultations", href: "/admin/consultations" },
  { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-secondary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary shrink-0">
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">PrepMaster</span>
              <span className="block text-[10px] text-white/40 -mt-0.5 uppercase tracking-widest">Admin Panel</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {ADMIN_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all", isActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white")}>
                <Icon className={cn("w-5 h-5", isActive ? "text-accent" : "")} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-primary text-sm font-bold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-white/40 truncate">admin@prepmaster.com</p>
            </div>
            <button className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="fixed top-0 left-0 bottom-0 w-64 bg-primary z-50 lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
                <span className="text-lg font-bold text-white">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {ADMIN_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all", isActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white")}>
                      <Icon className={cn("w-5 h-5", isActive ? "text-accent" : "")} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-surface-border shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-body hover:bg-surface-secondary"><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-semibold text-primary hidden md:block">
              {ADMIN_LINKS.find((l) => l.href === pathname)?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-body hover:bg-surface-secondary transition-colors"><Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" /></button>
            <Link href="/dashboard" className="text-sm text-accent-dark hover:text-accent font-medium">Student View →</Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
