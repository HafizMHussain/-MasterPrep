"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Filter, Lightbulb, Shuffle } from "lucide-react";

const FEATURES_LIST = [
  { icon: Filter, title: "Smart Filtering", desc: "Filter by subject, organ system, difficulty, and topic" },
  { icon: Lightbulb, title: "Tutor & Exam Mode", desc: "Learn with instant feedback or simulate real exam conditions" },
  { icon: Shuffle, title: "Randomized Practice", desc: "Random question sets to test your readiness across topics" },
  { icon: CheckCircle2, title: "Detailed Explanations", desc: "Every question includes comprehensive explanations" },
];

const OPTIONS = [
  { text: "Stable angina pectoris", correct: false, selected: false },
  { text: "NSTEMI", correct: true, selected: true },
  { text: "Pericarditis", correct: false, selected: false },
  { text: "Pulmonary embolism", correct: false, selected: false },
];

export default function QuestionBankShowcase() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="section-badge mb-4"><BookOpen className="w-4 h-4" /> Question Bank</span>
            <h2 className="text-heading-xl md:text-display text-primary mt-4">
              2,000+ Expert-Crafted <span className="text-gradient">USMLE Questions</span>
            </h2>
            <p className="text-body-lg text-body-light mt-4 leading-relaxed">
              Every question is written by physicians who scored 250+. Get detailed explanations that teach underlying concepts.
            </p>
            <div className="mt-8 space-y-4">
              {FEATURES_LIST.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent-dark" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{item.title}</h4>
                      <p className="text-sm text-body-light mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="card-premium !p-0 overflow-hidden">
              <div className="bg-primary px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-white">Question Bank — Tutor Mode</span>
                </div>
                <span className="text-xs text-white/50">Q 42 / 50</span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">Pathology</span>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">Cardiovascular</span>
                </div>
                <p className="text-primary font-medium leading-relaxed text-sm">
                  A 65-year-old woman presents with acute substernal chest pain and diaphoresis. Troponin I is elevated. ECG shows ST depression in V1-V4. Most likely diagnosis?
                </p>
                <div className="mt-4 space-y-2">
                  {OPTIONS.map((opt, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm ${opt.correct && opt.selected ? "bg-green-50 border-green-300 text-green-800" : "bg-surface-secondary border-surface-border text-body"}`}>
                      <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {opt.text}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-sm font-semibold text-green-800 mb-1">✓ Correct!</p>
                  <p className="text-xs text-green-700 leading-relaxed">NSTEMI is characterized by elevated troponins with ST depression, without ST elevation.</p>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -inset-4 bg-accent/5 rounded-3xl blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
