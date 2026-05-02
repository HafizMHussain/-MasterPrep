"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-surface-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-mesh" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="section-badge mb-4">
            ✦ Why Choose PrepMaster
          </span>
          <h2 className="text-heading-xl md:text-display text-primary mt-4">
            Everything You Need to{" "}
            <span className="text-gradient">Ace the USMLE</span>
          </h2>
          <p className="text-body-lg text-body-light mt-4">
            A comprehensive preparation platform designed by physicians who
            scored 250+ on their USMLE exams.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className="card-premium group"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-accent-dark" />
                </div>
                <h3 className="text-heading-sm text-primary group-hover:text-accent-dark transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-body text-body-light mt-3 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
