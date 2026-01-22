import FAQSection from "@/components/faq-section";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/works-section";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero CTA Section */}
      <section className="bg-gradient-to-b from-lime-50 to-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plant Trees, Fight Climate Change
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our global reforestation efforts. Browse projects, donate, and make a real impact on our planet's future.
          </p>
          <Link 
            href="/projects"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse Tree Planting Projects →
          </Link>
        </div>
      </section>
      
      <HowItWorksSection/>
      <FAQSection/>
    </>
  );
}
