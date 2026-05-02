"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Use the consultations table for contact form submissions too
    const { error: subError } = await supabase.from("consultations").insert({
      full_name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      consultation_type: form.subject || "General Inquiry",
      notes: form.message,
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
              <MessageSquare className="w-4 h-4 text-accent" /> Contact
            </span>
            <h1 className="text-display-lg text-white mt-4">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
              Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <h2 className="text-heading-lg text-primary">Contact Information</h2>
              <p className="text-body-light">Reach out via any of the channels below, or fill out the form and we&apos;ll get back to you within 24 hours.</p>
              {[
                { icon: Mail, label: "Email", value: "support@prepmaster.com", sub: "We reply within 24 hours" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", sub: "Mon-Fri 9am-6pm EST" },
                { icon: MapPin, label: "Office", value: "New York, NY 10001", sub: "United States" },
                { icon: Clock, label: "Hours", value: "Mon-Fri 9am-6pm", sub: "Eastern Standard Time" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface-secondary">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-accent-dark" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{item.label}</p>
                    <p className="text-body text-sm">{item.value}</p>
                    <p className="text-xs text-body-lighter mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2">
              <div className="card-premium">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-heading text-primary">Message Sent!</h3>
                    <p className="text-body-light mt-2">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-heading text-primary mb-6">Send us a Message</h3>
                    {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 gap-5">
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
                        <label className="block text-sm font-medium text-primary mb-2">Subject</label>
                        <select className="input-field" value={form.subject} onChange={(e) => update("subject", e.target.value)}>
                          <option value="">Select a topic</option>
                          <option>General Inquiry</option>
                          <option>Technical Support</option>
                          <option>Billing Question</option>
                          <option>Partnership</option>
                          <option>Feedback</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Message</label>
                        <textarea rows={5} className="input-field resize-none" value={form.message} onChange={(e) => update("message", e.target.value)} required />
                      </div>
                      <button type="submit" disabled={loading} className="btn-primary !py-3.5 w-full md:w-auto disabled:opacity-60">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Send Message
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
