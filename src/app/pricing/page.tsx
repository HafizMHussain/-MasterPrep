"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import ConsultationCTA from "@/components/landing/ConsultationCTA";

export default function PricingPage() {
  return (
    <>
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge mb-4 !bg-white/10 !border-white/15 !text-white/80">
              <Sparkles className="w-4 h-4 text-accent" /> Pricing
            </span>
            <h1 className="text-display-lg text-white mt-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
              Choose the plan that fits your preparation needs. Start free and upgrade anytime.
            </p>
          </motion.div>
        </div>
      </section>
      <PricingSection />
      <FAQSection />
      <ConsultationCTA />
    </>
  );
}
