"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function BlogPostPage() {
  const params = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === params.slug) || BLOG_POSTS[0];

  return (
    <>
      <section className="gradient-hero pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">{post.category}</span>
            <h1 className="text-heading-xl md:text-display text-white mt-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-white/60 text-sm">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose prose-lg max-w-none">
              <p className="text-body-lg text-body-light leading-relaxed">{post.excerpt}</p>

              <h2 className="text-heading-lg text-primary mt-10 mb-4">Introduction</h2>
              <p className="text-body text-body-light leading-relaxed">
                Preparing for the USMLE is one of the most challenging yet rewarding experiences in a medical student&apos;s career. This comprehensive guide will walk you through proven strategies, essential resources, and time-management techniques that have helped thousands of students achieve scores above 250.
              </p>

              <h2 className="text-heading-lg text-primary mt-10 mb-4">Key Study Strategies</h2>
              <p className="text-body text-body-light leading-relaxed">
                The most successful USMLE scorers share common study habits: active recall, spaced repetition, and consistent practice with high-quality question banks. Rather than passive reading, focus on testing yourself frequently and analyzing your mistakes.
              </p>

              <div className="my-8 p-6 rounded-2xl bg-accent/5 border border-accent/20">
                <p className="font-semibold text-primary mb-2">💡 Pro Tip</p>
                <p className="text-body text-body-light">Track your accuracy by subject area weekly. If any subject drops below 60%, dedicate extra time to reviewing those concepts before moving forward.</p>
              </div>

              <h2 className="text-heading-lg text-primary mt-10 mb-4">Creating Your Study Schedule</h2>
              <p className="text-body text-body-light leading-relaxed">
                A well-structured study schedule is crucial. Most high-scorers recommend a 6-8 week dedicated study period with 8-12 hours of focused study daily. Include regular breaks and at least one full day off per week to prevent burnout.
              </p>

              <h2 className="text-heading-lg text-primary mt-10 mb-4">Practice, Practice, Practice</h2>
              <p className="text-body text-body-light leading-relaxed">
                Aim to complete at least 80-120 questions per day during your dedicated study period. Review every question thoroughly — even ones you got correct — to reinforce concepts and identify knowledge gaps.
              </p>

              <div className="my-8 p-6 rounded-2xl bg-green-50 border border-green-200">
                <p className="font-semibold text-green-800 mb-2">✓ Bottom Line</p>
                <p className="text-green-700">Consistent, focused practice with quality resources and regular self-assessment is the formula for USMLE success. Start early, stay disciplined, and trust the process.</p>
              </div>
            </motion.article>

            {/* Share & Nav */}
            <div className="mt-12 pt-8 border-t border-surface-border flex items-center justify-between">
              <Link href="/blog" className="flex items-center gap-2 text-primary font-medium hover:text-accent-dark transition-colors">
                <ArrowLeft className="w-4 h-4" /> More Articles
              </Link>
              <button className="flex items-center gap-2 text-body-light hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
