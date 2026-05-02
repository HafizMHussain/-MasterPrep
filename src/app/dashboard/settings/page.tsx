"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Bell, Moon, Globe, Shield, CreditCard, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { resetPassword } from "@/services/auth";
import { cn } from "@/lib/utils";

function ToggleSwitch({ enabled, label, onChange }: { enabled: boolean; label: string, onChange?: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3" onClick={() => onChange?.(!enabled)}>
      <span className="text-sm text-primary">{label}</span>
      <div className={cn("w-10 h-6 rounded-full relative cursor-pointer transition-colors", enabled ? "bg-accent" : "bg-surface-tertiary")}>
        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform", enabled ? "left-5" : "left-1")} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, profile } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [resetting, setResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), []);

  const planLabel = profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) + " Plan" : "Free Plan";
  
  const handleResetPassword = async () => {
    if (!user?.email) return;
    setResetting(true);
    await resetPassword(user.email);
    setResetting(false);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-heading-lg text-primary">Settings</h1>
        <p className="text-sm text-body-light mt-1">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="font-semibold text-primary">Notifications</h3>
        </div>
        <div className="divide-y divide-surface-border">
          <ToggleSwitch enabled={true} label="Email notifications" />
          <ToggleSwitch enabled={true} label="Study reminders" />
          <ToggleSwitch enabled={false} label="Marketing emails" />
          <ToggleSwitch enabled={true} label="Exam results notifications" />
          <ToggleSwitch enabled={true} label="Weekly progress reports" />
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Moon className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="font-semibold text-primary">Appearance</h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {["Light", "Dark", "System"].map((t) => {
              const themeValue = t.toLowerCase();
              const isActive = mounted && theme === themeValue;
              return (
                <button 
                  key={t} 
                  onClick={() => setTheme(themeValue)}
                  className={cn("px-4 py-3 rounded-xl border text-sm font-medium transition-all", isActive ? "bg-primary text-white border-primary" : "border-surface-border text-body hover:bg-surface-secondary")}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-primary mb-2">Language</label>
          <select className="input-field">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Arabic</option>
          </select>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="font-semibold text-primary">Security</h3>
        </div>
        <div className="space-y-4">
          <button 
            onClick={handleResetPassword}
            disabled={resetting}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-surface-border hover:bg-surface-secondary transition-colors text-sm font-medium text-primary disabled:opacity-60"
          >
            <span className="flex items-center">
              {resetting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Change Password
            </span>
            {resetSent && <span className="flex items-center text-green-600 text-xs"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Link sent!</span>}
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl border border-surface-border hover:bg-surface-secondary transition-colors text-sm font-medium text-primary">
            Two-Factor Authentication
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl border border-surface-border hover:bg-surface-secondary transition-colors text-sm font-medium text-primary">
            Active Sessions
          </button>
        </div>
      </motion.div>

      {/* Subscription */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-surface-border shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="font-semibold text-primary">Subscription</h3>
        </div>
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-between">
          <div>
            <p className="font-semibold text-primary">{planLabel}</p>
            {profile?.plan !== "free" && <p className="text-xs text-body-lighter mt-0.5">Next billing: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</p>}
          </div>
          <button className="px-4 py-2 rounded-lg border border-surface-border text-sm font-medium text-body hover:bg-surface-secondary transition-colors">
            {profile?.plan === "free" ? "Upgrade" : "Manage"}
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 border border-red-200 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="font-semibold text-red-600">Danger Zone</h3>
        </div>
        <p className="text-sm text-body-light mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">Delete Account</button>
      </motion.div>
    </div>
  );
}
