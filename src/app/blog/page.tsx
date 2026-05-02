"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, FileText, Search } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants";

export default function BlogPage() {
  return (
    <>
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge mb-4 !bg-white/10 !border-white/15 !text-white/80">
              <FileText className="w-4 h-4 text-accent" /> Blog
            </span>
            <h1 className="text-display-lg text-white mt-4">
              USMLE Prep <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
              Expert tips, study strategies, and high-yield content to boost your USMLE score.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-body-lighter" />
              <input type="text" placeholder="Search articles..." className="input-field !pl-12" />
            </div>
          </div>

          {/* Blog grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="card-premium !p-0 overflow-hidden">
                    {/* Cover */}
                    <div className={`h-48 bg-gradient-to-br ${post.coverColor} flex items-center justify-center`}>
                      <FileText className="w-16 h-16 text-white/30" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent-dark text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-body-lighter">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-heading-sm text-primary group-hover:text-accent-dark transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-body-light mt-2 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-border">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                            {post.authorAvatar}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-primary">{post.author}</p>
                            <p className="text-[10px] text-body-lighter">{post.date}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-body-lighter group-hover:text-accent-dark group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
