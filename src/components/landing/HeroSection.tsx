"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Play, Sparkles } from "lucide-react";
import { HERO_STATS } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float-delayed" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container-custom relative z-10 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-white/80 mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Trusted by 2,500+ Medical Students</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-display-lg text-white font-extrabold leading-tight">
              Master the{" "}
              <span className="text-gradient">USMLE</span>{" "}
              with Expert-Led Preparation
            </h1>

            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
              2,000+ practice questions, realistic mock exams, advanced
              analytics, and one-on-one tutoring from physicians who scored 250+.
              Your path to a top USMLE score starts here.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/register"
                className="btn-primary text-base !py-3.5 !px-8"
              >
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
              <Link
                href="/book-consultation"
                className="btn-outline text-base !py-3.5 !px-8"
              >
                <Play className="w-4 h-4 mr-2" />
                Book Free Consultation
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-6 text-sm text-white/40">
              No credit card required · 7-day free trial · Cancel anytime
            </p>
          </motion.div>

          {/* Right — Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-4 right-4 glass rounded-2xl p-6 shadow-strong"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">Q</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Practice Question</p>
                    <p className="text-white/50 text-xs">Cardiology · Step 1</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  A 55-year-old male presents with chest pain that radiates to the
                  left arm. ECG shows ST-elevation in leads II, III, and aVF. Which
                  coronary artery is most likely occluded?
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    "Left anterior descending",
                    "Right coronary artery",
                    "Left circumflex",
                    "Left main coronary",
                  ].map((opt, i) => (
                    <div
                      key={i}
                      className={`px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                        i === 1
                          ? "bg-green-500/20 border border-green-500/40 text-green-300"
                          : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 right-0 glass rounded-xl px-5 py-3 shadow-medium"
              >
                <p className="text-accent font-bold text-xl">98%</p>
                <p className="text-white/60 text-xs">Pass Rate</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-16 -left-6 glass rounded-xl px-5 py-3 shadow-medium"
              >
                <p className="text-green-400 font-bold text-xl">+45 pts</p>
                <p className="text-white/60 text-xs">Avg. Improvement</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-4 right-8 glass rounded-xl px-5 py-3 shadow-medium"
              >
                <p className="text-blue-400 font-bold text-xl">260+</p>
                <p className="text-white/60 text-xs">Avg. Score</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {HERO_STATS.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <p className="text-2xl md:text-3xl font-bold text-accent">
                {stat.value}
              </p>
              <p className="text-sm text-white/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
