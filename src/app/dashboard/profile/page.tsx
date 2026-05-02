"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, GraduationCap, MapPin, Phone, Camera, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { updateProfile, uploadAvatar } from "@/services/auth";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { profile, user, setProfile, loading: authLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent hydration mismatch — only render client-side after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize form AFTER mount + auth ready to avoid hydration issues
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    location: "",
    medical_school: "",
    current_step: "step1",
    target_exam_date: "",
    bio: "",
  });

  // Populate form once auth data is available
  useEffect(() => {
    if (mounted && !authLoading) {
      setForm({
        email: user?.email || "",
        full_name: profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "",
        phone: profile?.phone || "",
        location: profile?.location || "",
        medical_school: profile?.medical_school || "",
        current_step: profile?.current_step || "step1",
        target_exam_date: profile?.target_exam_date || "",
        bio: profile?.bio || "",
      });
    }
  }, [mounted, authLoading, profile, user]);

  const initials = (form.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.[0] || "U").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaved(false);
    setErrorMsg("");
    setEmailMsg("");
    
    try {
      // Clean payload — exclude email (not a profiles column) and fix empty dates
      const { email, ...profileUpdates } = form;
      const payload = {
        ...profileUpdates,
        target_exam_date: form.target_exam_date === "" ? null : form.target_exam_date
      };

      // Update Profile Data
      const { data, error } = await updateProfile(user.id, payload);
      
      // Update Email if changed
      if (form.email && form.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: form.email });
        if (emailError) {
          console.error("Email update error:", emailError);
          setErrorMsg(emailError.message);
        } else {
          setEmailMsg("We sent a confirmation link to your new and old email address. Please click it to confirm the change.");
        }
      }

      if (error) {
        console.error("Error updating profile:", error);
        setErrorMsg(error.message || "Failed to save profile. Please try again.");
      }

      if (data && !error) {
        setProfile(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err: any) {
      console.error("Unexpected error in handleSave:", err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setErrorMsg("");
    
    try {
      const { data, error } = await uploadAvatar(user.id, file);
      
      if (error) {
        console.error("Upload error:", error);
        setErrorMsg("Failed to upload avatar: " + error.message);
      } else if (data) {
        setProfile(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      setErrorMsg("Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  // Show loading state until client is mounted and auth is ready
  if (!mounted || authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-heading-lg text-primary">My Profile</h1>
        <p className="text-sm text-body-light mt-1">Manage your personal information</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-surface-border shadow-soft overflow-hidden">
        <div className="h-32 gradient-hero relative">
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-medium" />
              ) : (
                <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center text-primary text-2xl font-bold border-4 border-white shadow-medium">
                  {initials}
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-surface-border flex items-center justify-center shadow-soft hover:bg-surface-secondary transition-colors"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" /> : <Camera className="w-3.5 h-3.5 text-body-light" />}
              </button>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        {emailMsg && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-600">
            {emailMsg}
          </div>
        )}

        <div className="pt-14 px-6 pb-6">
          <form className="space-y-5" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
                <input type="text" className="input-field !pl-11" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
                <input type="email" className="input-field !pl-11" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
                  <input type="tel" className="input-field !pl-11" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
                  <input type="text" className="input-field !pl-11" value={form.location} onChange={(e) => update("location", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Medical School</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
                  <input type="text" className="input-field !pl-11" value={form.medical_school} onChange={(e) => update("medical_school", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Target Exam Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-lighter" />
                  <input type="date" className="input-field !pl-11" value={form.target_exam_date} onChange={(e) => update("target_exam_date", e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Current Step</label>
              <select className="input-field" value={form.current_step} onChange={(e) => update("current_step", e.target.value)}>
                <option value="step1">USMLE Step 1</option>
                <option value="step2">USMLE Step 2 CK</option>
                <option value="step3">USMLE Step 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Bio</label>
              <textarea rows={3} className="input-field resize-none" value={form.bio} onChange={(e) => update("bio", e.target.value)} />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary !py-3 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </button>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Saved!
                </motion.span>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
