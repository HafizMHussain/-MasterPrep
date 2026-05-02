"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING_PLANS } from "@/lib/constants";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export default function PricingSection() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planName: string, priceId: string) => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    if (planName === "Free Trial") {
      router.push("/dashboard");
      return;
    }

    try {
      setLoadingPlan(planName);
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId, // Would be a real stripe price ID
          userId: user.id,
          email: user.email,
          returnUrl: window.location.origin + "/dashboard/settings",
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="section-padding bg-surface-secondary relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="container-custom relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-badge mb-4"><Sparkles className="w-4 h-4" /> Simple Pricing</span>
          <h2 className="text-heading-xl md:text-display text-primary mt-4">
            Choose Your <span className="text-gradient">Prep Plan</span>
          </h2>
          <p className="text-body-lg text-body-light mt-4">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl p-6 md:p-8 border transition-all duration-300",
                plan.highlighted
                  ? "bg-primary text-white border-primary shadow-strong scale-[1.03]"
                  : "bg-white border-surface-border shadow-soft hover:shadow-medium"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-accent text-primary text-xs font-bold shadow-glow">
                  {plan.badge}
                </div>
              )}
              <h3 className={cn("text-heading-sm", plan.highlighted ? "text-white" : "text-primary")}>
                {plan.name}
              </h3>
              <p className={cn("text-sm mt-1", plan.highlighted ? "text-white/70" : "text-body-light")}>
                {plan.description}
              </p>
              <div className="mt-5 mb-6">
                <span className={cn("text-display font-extrabold", plan.highlighted ? "text-accent" : "text-primary")}>
                  {plan.price}
                </span>
                <span className={cn("text-sm ml-1", plan.highlighted ? "text-white/60" : "text-body-light")}>
                  /{plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <Check className={cn("w-4 h-4 mt-0.5 shrink-0", plan.highlighted ? "text-accent" : "text-green-500")} />
                    <span className={plan.highlighted ? "text-white/85" : "text-body"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.name, "price_placeholder")}
                disabled={loadingPlan === plan.name}
                className={cn(
                  "block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-70",
                  plan.highlighted
                    ? "btn-primary w-full"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-white w-full"
                )}
              >
                {loadingPlan === plan.name ? "Processing..." : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
