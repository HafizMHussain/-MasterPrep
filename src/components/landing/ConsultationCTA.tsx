"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Users } from "lucide-react";

export default function ConsultationCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="gradient-hero py-20 md:py-28">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-heading-xl md:text-display-lg text-white font-extrabold">
              Ready to Start Your{" "}
              <span className="text-gradient">USMLE Journey?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 mt-4 max-w-2xl mx-auto">
              Join 2,500+ students who achieved their dream scores. Start with a free consultation and personalized study plan.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/book-consultation" className="btn-primary text-base !py-4 !px-10">
                Book Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/register" className="btn-outline text-base !py-4 !px-10">
                Start Free Trial
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {[
                { icon: Shield, text: "No Credit Card Required" },
                { icon: Award, text: "7-Day Free Trial" },
                { icon: Users, text: "30-Day Money Back" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                  <item.icon className="w-4 h-4 text-accent" />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
