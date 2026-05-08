"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Target, Users, Award, Heart, GraduationCap, TrendingUp } from "lucide-react";
import { TEAM_MEMBERS, HERO_STATS } from "@/lib/constants";

const ConsultationCTA = dynamic(() => import("@/components/landing/ConsultationCTA"), { ssr: false });

const TIMELINE = [
  { year: "2022", title: "Founded", desc: "Started as a small tutoring service for IMGs preparing for USMLE Step 1." },
  { year: "2023", title: "Platform Launch", desc: "Built our question bank with 500+ expert-crafted questions and launched online." },
  { year: "2024", title: "Growth", desc: "Reached 1,000+ students with a 96% pass rate. Added analytics and mock exams." },
  { year: "2025", title: "Expansion", desc: "Grew to 2,500+ students, introduced 1-on-1 tutoring and AI-powered features." },
  { year: "2026", title: "Today", desc: "A comprehensive USMLE prep platform with 2,000+ questions and a community of top scorers." },
];

const VALUES = [
  { icon: Target, title: "Excellence", desc: "We hold ourselves and our content to the highest medical education standards." },
  { icon: Heart, title: "Student First", desc: "Every feature we build is designed with the student experience in mind." },
  { icon: Users, title: "Community", desc: "We believe in the power of shared knowledge and peer support." },
  { icon: TrendingUp, title: "Results Driven", desc: "Our success is measured by our students' score improvements." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge mb-4 !bg-white/10 !border-white/15 !text-white/80">
              <GraduationCap className="w-4 h-4 text-accent" /> About Us
            </span>
            <h1 className="text-display-lg text-white mt-4">
              Empowering Future <span className="text-gradient">Physicians</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
              We&apos;re a team of physicians and educators dedicated to helping medical students achieve exceptional USMLE scores through expert-led preparation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-surface-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HERO_STATS.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-body-light mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-heading-xl text-primary">Our <span className="text-gradient">Mission</span></h2>
              <p className="text-body-lg text-body-light mt-4 leading-relaxed">
                We believe that every medical student deserves access to world-class USMLE preparation, regardless of background. Our platform combines cutting-edge technology with expert mentorship to make high-score preparation accessible and effective.
              </p>
              <p className="text-body text-body-light mt-4 leading-relaxed">
                Founded by a physician who experienced the USMLE journey firsthand, PrepMaster was built to address the gaps in traditional prep resources — offering personalized analytics, adaptive learning, and one-on-one guidance from top scorers.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {VALUES.map((v, i) => (
                <div key={i} className="card-premium text-center !p-5">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <v.icon className="w-6 h-6 text-accent-dark" />
                  </div>
                  <h4 className="font-semibold text-primary text-sm">{v.title}</h4>
                  <p className="text-xs text-body-light mt-1">{v.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-heading-xl text-primary">Our <span className="text-gradient">Journey</span></h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-8">
            {TIMELINE.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shrink-0 text-white font-bold text-sm">
                  {t.year}
                </div>
                <div>
                  <h4 className="font-semibold text-primary text-lg">{t.title}</h4>
                  <p className="text-body-light mt-1">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-heading-xl text-primary">Meet the <span className="text-gradient">Team</span></h2>
            <p className="text-body-lg text-body-light mt-4">Physicians and educators who scored 250+ on their USMLE exams.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-premium text-center">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {m.avatar}
                </div>
                <h4 className="font-semibold text-primary">{m.name}</h4>
                <p className="text-sm text-accent-dark font-medium mt-0.5">{m.role}</p>
                {m.score && <p className="text-xs text-body-light mt-1">{m.score}</p>}
                <p className="text-sm text-body-light mt-3 leading-relaxed">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
