"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Shield, ArrowRight, Star, Loader2, CheckCircle2 } from "lucide-react";
import { submitConsultation } from "@/services/platform";
import { useAuthStore } from "@/stores/auth-store";

const BENEFITS = [
  { icon: Users, title: "250+ Scoring Tutors", desc: "All our consultants scored 250+ on their USMLE exams" },
  { icon: Calendar, title: "Flexible Scheduling", desc: "Choose a time that works for you from our availability" },
  { icon: Clock, title: "30-Minute Session", desc: "A focused session to assess your needs and create a plan" },
  { icon: Shield, title: "100% Free", desc: "No cost, no commitment — just expert guidance" },
];

const CONSULTATION_TYPES = [
  { title: "Study Strategy Session", desc: "Get a personalized study plan based on your strengths and weaknesses", duration: "30 min" },
  { title: "Score Review & Analysis", desc: "Review your practice scores and identify areas for improvement", duration: "30 min" },
  { title: "Resource Recommendation", desc: "Get expert advice on which resources to use for your preparation", duration: "20 min" },
  { title: "Residency Planning", desc: "Discuss how your USMLE scores fit into your residency goals", duration: "30 min" },
];

export default function BookConsultationPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentStep: "",
    targetDate: "",
    preferredDatetime: "",
    notes: "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: subError } = await submitConsultation({
      full_name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      consultation_type: "Study Strategy",
      current_step: form.currentStep || undefined,
      target_exam_date: form.targetDate || undefined,
      preferred_datetime: form.preferredDatetime || undefined,
      notes: form.notes || undefined,
      user_id: user?.id || undefined,
    });

    setLoading(false);
    if (subError) {
      setError(subError.message);
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge mb-4 !bg-white/10 !border-white/15 !text-white/80">
              <Calendar className="w-4 h-4 text-accent" /> Free Consultation
            </span>
            <h1 className="text-display-lg text-white mt-4">
              Book Your Free <span className="text-gradient">Strategy Session</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
              Get personalized guidance from USMLE experts who scored 250+. No cost, no commitment.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-surface-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <b.icon className="w-6 h-6 text-accent-dark" />
                </div>
                <h4 className="font-semibold text-primary text-sm">{b.title}</h4>
                <p className="text-xs text-body-light mt-1">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-heading-xl text-primary mb-2">Choose Your Session Type</h2>
              <p className="text-body-light mb-8">Select the consultation that best fits your needs.</p>
              <div className="space-y-4">
                {CONSULTATION_TYPES.map((ct, i) => (
                  <div key={i} className="card-premium !p-5 cursor-pointer group hover:border-accent/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-primary group-hover:text-accent-dark transition-colors">{ct.title}</h4>
                        <p className="text-sm text-body-light mt-1">{ct.desc}</p>
                      </div>
                      <span className="text-xs font-medium text-accent-dark bg-accent/10 px-3 py-1 rounded-full shrink-0">{ct.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-5 rounded-2xl bg-primary text-white">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="w-4 h-4 fill-accent text-accent" />))}
                </div>
                <p className="text-sm text-white/80 italic">&ldquo;The free consultation completely changed my approach. My tutor identified gaps I didn&apos;t know I had and created a plan that helped me jump from 220 to 260.&rdquo;</p>
                <p className="text-xs text-white/50 mt-2">— Dr. Sarah Ahmed, Step 1: 262</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="card-premium">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-heading text-primary">Booking Received!</h3>
                    <p className="text-body-light mt-2 max-w-sm mx-auto">We&apos;ll confirm your session within 24 hours. Check your email for details.</p>
                    <Link href="/" className="btn-primary mt-6 inline-flex">Back to Home</Link>
                  </div>
                ) : (
                  <>
                    <h3 className="text-heading text-primary mb-6">Schedule Your Session</h3>
                    {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">First Name</label>
                          <input type="text" className="input-field" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Last Name</label>
                          <input type="text" className="input-field" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Email</label>
                        <input type="email" className="input-field" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Current USMLE Step</label>
                        <select className="input-field" value={form.currentStep} onChange={(e) => update("currentStep", e.target.value)}>
                          <option value="">Select step</option>
                          <option>Step 1 — Preparing</option>
                          <option>Step 1 — Retake</option>
                          <option>Step 2 CK — Preparing</option>
                          <option>Step 2 CK — Retake</option>
                          <option>Step 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Target Exam Date</label>
                        <input type="date" className="input-field" value={form.targetDate} onChange={(e) => update("targetDate", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Preferred Date & Time</label>
                        <input type="datetime-local" className="input-field" value={form.preferredDatetime} onChange={(e) => update("preferredDatetime", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Additional Notes</label>
                        <textarea rows={3} className="input-field resize-none" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
                      </div>
                      <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base disabled:opacity-60">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Book Free Consultation <ArrowRight className="w-5 h-5 ml-2" /></>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
