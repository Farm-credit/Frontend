"use client";

import Image from "next/image";

const BlockchainVerificationSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Permanent Record",
      description: "Your contribution is stored on the blockchain forever, ensuring lasting accountability."
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "No Double Counting",
      description: "Smart contracts prevent duplicate claims and ensure each credit is unique."
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Transferable Proof",
      description: "Your NFT certificate can be shared, displayed, or transferred as you wish."
    }
  ];

  return (
    <section className="relative w-full bg-blue-600 text-white py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Top Arc */}
      <svg
        className="absolute top-0 left-0 w-full"
        viewBox="0 0 1440 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 Q720,150 1440,0 L1440,0 L0,0 Z"
          fill="#FFF" 
        />
      </svg>

      {/* Bottom Arc */}
      <svg
        className="absolute -bottom-1 h-[165px] left-0 w-full rotate-180"
        viewBox="0 0 1440 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 Q720,160 1440,0 L1440,0 L0,0 Z"
          fill="#FFF"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto pt-12 md:pt-16 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12 md:mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-xl">
            Blockchain-Backed Verification
          </h2>
          <button className="self-start md:self-auto px-8 py-3 border-2 border-white rounded-full text-white font-medium hover:bg-white hover:text-black transition-colors duration-300">
            Learn More
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Features List */}
          <div className="space-y-8 md:space-y-10">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-white">
                  {feature.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/farm-barcode.png"
                alt="Blockchain verification with QR code and fresh produce"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainVerificationSection;
