"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Clock } from "lucide-react";

const CHART_DATA = [
  { label: "W1", value: 45 }, { label: "W2", value: 52 }, { label: "W3", value: 58 },
  { label: "W4", value: 55 }, { label: "W5", value: 65 }, { label: "W6", value: 72 },
  { label: "W7", value: 78 }, { label: "W8", value: 85 },
];

const SUBJECTS = [
  { name: "Pathology", pct: 82, color: "bg-blue-500" },
  { name: "Pharmacology", pct: 68, color: "bg-purple-500" },
  { name: "Physiology", pct: 90, color: "bg-green-500" },
  { name: "Biochemistry", pct: 55, color: "bg-amber-500" },
  { name: "Microbiology", pct: 75, color: "bg-rose-500" },
];

export default function AnalyticsShowcase() {
  const maxVal = Math.max(...CHART_DATA.map((d) => d.value));

  return (
    <section className="section-padding bg-surface-secondary relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Mock Dashboard */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative order-2 lg:order-1">
            <div className="card-premium !p-0 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-white">Performance Analytics</span>
                </div>
              </div>
              <div className="p-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Accuracy", value: "78%", icon: Target, color: "text-green-500" },
                    { label: "Streak", value: "12 days", icon: TrendingUp, color: "text-accent" },
                    { label: "Avg Time", value: "1.2 min", icon: Clock, color: "text-blue-500" },
                  ].map((s, i) => (
                    <div key={i} className="bg-surface-secondary rounded-xl p-3 text-center">
                      <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
                      <p className="text-lg font-bold text-primary">{s.value}</p>
                      <p className="text-xs text-body-light">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <p className="text-xs font-semibold text-body-light mb-3 uppercase tracking-wider">Weekly Performance</p>
                <div className="flex items-end gap-2 h-32 mb-6">
                  {CHART_DATA.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(d.value / maxVal) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-light"
                      />
                      <span className="text-[10px] text-body-lighter">{d.label}</span>
                    </div>
                  ))}
                </div>

                {/* Subject bars */}
                <p className="text-xs font-semibold text-body-light mb-3 uppercase tracking-wider">Subject Accuracy</p>
                <div className="space-y-2.5">
                  {SUBJECTS.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-body font-medium">{s.name}</span>
                        <span className="text-body-light">{s.pct}%</span>
                      </div>
                      <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          className={`h-full rounded-full ${s.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
          </motion.div>

          {/* Right — Text */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="order-1 lg:order-2">
            <span className="section-badge mb-4"><BarChart3 className="w-4 h-4" /> Analytics</span>
            <h2 className="text-heading-xl md:text-display text-primary mt-4">
              Track Your Progress with <span className="text-gradient">Advanced Analytics</span>
            </h2>
            <p className="text-body-lg text-body-light mt-4 leading-relaxed">
              Our comprehensive analytics dashboard gives you real-time insights into your performance. Identify weak areas, track improvement, and know exactly when you&apos;re ready for exam day.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: BarChart3, title: "Subject Accuracy", desc: "See how you perform in each subject area" },
                { icon: TrendingUp, title: "Trend Analysis", desc: "Visualize your improvement over weeks and months" },
                { icon: Target, title: "Readiness Score", desc: "Our algorithm predicts your exam readiness" },
                { icon: Clock, title: "Time Management", desc: "Track and optimize your time per question" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent-dark" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{item.title}</h4>
                      <p className="text-sm text-body-light mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
