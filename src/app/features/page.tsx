"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { FEATURE_DETAILS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import ConsultationCTA from "@/components/landing/ConsultationCTA";

export default function FeaturesPage() {
  return (
    <>
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge mb-4 !bg-white/10 !border-white/15 !text-white/80">
              <Zap className="w-4 h-4 text-accent" /> Features
            </span>
            <h1 className="text-display-lg text-white mt-4">
              Powerful Tools for <span className="text-gradient">USMLE Success</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
              Every feature is designed to maximize your study efficiency and exam readiness.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom space-y-20">
          {FEATURE_DETAILS.map((feature, i) => {
            const Icon = feature.icon;
            const isReversed = i % 2 !== 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn("grid lg:grid-cols-2 gap-12 items-center", isReversed && "direction-rtl")}
              >
                <div className={cn(isReversed && "lg:order-2")}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent-dark" />
                    </div>
                    {feature.badge && (
                      <span className="px-3 py-1 rounded-full bg-accent/10 text-accent-dark text-xs font-semibold">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-heading-xl text-primary">{feature.title}</h2>
                  <p className="text-body-lg text-body-light mt-3 leading-relaxed">{feature.description}</p>
                  <ul className="mt-6 space-y-3">
                    {feature.highlights.map((h, j) => (
                      <li key={j} className="flex items-center gap-3 text-body">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={cn("relative", isReversed && "lg:order-1")}>
                  <div className="card-premium !p-8 text-center">
                    <div className="w-24 h-24 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-12 h-12 text-accent-dark" />
                    </div>
                    <h3 className="text-heading text-primary">{feature.title}</h3>
                    <p className="text-sm text-body-light mt-2">{feature.description}</p>
                  </div>
                  <div className="absolute -z-10 -inset-4 bg-accent/5 rounded-3xl blur-2xl" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
