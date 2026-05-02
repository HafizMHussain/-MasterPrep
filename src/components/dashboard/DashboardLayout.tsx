"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, LogOut, Menu, X, Bell, ChevronDown } from "lucide-react";
import { DASHBOARD_LINKS } from "@/lib/dashboard-data";
import { useAuthStore } from "@/stores/auth-store";
import { signOut } from "@/services/auth";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, user } = useAuthStore();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const planLabel = profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) + " Plan" : "Free Plan";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-surface-secondary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-border shrink-0">
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-surface-border shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-primary">
              Prep<span className="text-accent">Master</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {DASHBOARD_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200", isActive ? "bg-primary text-white shadow-soft" : "text-body hover:bg-surface-secondary hover:text-primary")}>
                <Icon className={cn("w-5 h-5", isActive ? "text-accent" : "")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-border">
          <div className="flex items-center gap-3 px-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">{initials}</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">{displayName}</p>
              <p className="text-xs text-body-lighter truncate">{planLabel}</p>
            </div>
            <button onClick={handleSignOut} className="p-1.5 rounded-lg text-body-lighter hover:bg-surface-secondary hover:text-error transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-6 h-16 border-b border-surface-border">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-primary">Prep<span className="text-accent">Master</span></span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-body hover:bg-surface-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {DASHBOARD_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all", isActive ? "bg-primary text-white" : "text-body hover:bg-surface-secondary")}>
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
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-body hover:bg-surface-secondary">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-primary hidden md:block">
              {DASHBOARD_LINKS.find((l) => l.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-body hover:bg-surface-secondary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-secondary transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">{initials}</div>
              <span className="text-sm font-medium text-primary hidden md:block">{displayName}</span>
              <ChevronDown className="w-4 h-4 text-body-lighter hidden md:block" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
