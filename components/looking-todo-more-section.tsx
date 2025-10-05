"use client"
import React from 'react';
import Image from 'next/image';

interface LookingToDoMoreSectionProps {
  backgroundImage?: string;
  onPlantTrees?: () => void;
}

export function LookingToDoMoreSection({
  backgroundImage = '/farm-land.jpg',
  
}: LookingToDoMoreSectionProps)  {
  
  const handlePlantTrees = () => {
    // router.push('/plant-trees');
  };

  return (
    <section 
      className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Agricultural landscape with planted trees"
          fill
          sizes="100vw"
          className="object-cover"
          quality={85}
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <h2 
          id="cta-heading"
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight text-center max-w-4xl"
        >
          Looking To Do More? Plant Trees Today
        </h2>
        
        <button 
          onClick={handlePlantTrees}
          className="bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-black font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 inline-flex items-center gap-1"
          aria-label="Start planting trees"
        >
          Plant Trees &gt;
        </button>
      </div>
    </section>
  );
};

