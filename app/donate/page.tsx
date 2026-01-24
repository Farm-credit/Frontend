
// app
import Link from "next/link";
import FAQSection from "@/components/faq-section";
import HowItWorksSection from "@/components/works-section";

export default function Home() {
  return (
    <>
      {/* Hero Section with Donate CTA */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Fight Climate Change with Blockchain
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Donate to environmental projects and receive Carbon Credit Tokens
            (CCT) on the Stellar blockchain. Every donation makes a measurable
            impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 min-h-[56px]"
            >
              Donate Now
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 min-h-[56px]"
            >
              Learn More
            </Link>
          </div>

          {/* Impact Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-4xl font-bold text-green-600 mb-2">1:1</p>
              <p className="text-gray-600">$1 = 1 CCT Token</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-4xl font-bold text-blue-600 mb-2">2.5kg</p>
              <p className="text-gray-600">CO₂ Offset per Dollar</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-4xl font-bold text-amber-600 mb-2">0.5</p>
              <p className="text-gray-600">Trees per Dollar</p>
            </div>
          </div>
        </div>
      </section>

      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <FAQSection />
    </>
  );
}