import FAQSection from "@/components/faq-section";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/works-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FAQSection />
    </div>
  );
}
