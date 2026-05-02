import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import QuestionBankShowcase from "@/components/landing/QuestionBankShowcase";
import AnalyticsShowcase from "@/components/landing/AnalyticsShowcase";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import ConsultationCTA from "@/components/landing/ConsultationCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <QuestionBankShowcase />
      <AnalyticsShowcase />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <ConsultationCTA />
    </>
  );
}
