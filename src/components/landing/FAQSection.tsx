"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-badge mb-4">❓ FAQ</span>
          <h2 className="text-heading-xl md:text-display text-primary mt-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-body-lg text-body-light mt-4">
            Everything you need to know about PrepMaster and USMLE prep.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "border rounded-2xl transition-all duration-300 overflow-hidden",
                  isOpen ? "border-accent/30 bg-accent/5 shadow-soft" : "border-surface-border bg-white"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                >
                  <span className={cn("font-semibold transition-colors", isOpen ? "text-primary" : "text-primary")}>
                    {item.question}
                  </span>
                  <ChevronDown className={cn("w-5 h-5 shrink-0 transition-transform duration-300 text-body-light", isOpen && "rotate-180 text-accent")} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6">
                        <p className="text-body text-body-light leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
