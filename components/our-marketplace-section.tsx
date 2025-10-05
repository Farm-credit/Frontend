"use client"
import React from 'react';
import {MarketplaceCard} from './marketplace-card';
import { MarketplaceItem } from '@/types/marketplace.types';

interface OurMarketplaceSectionProps {
  items?: MarketplaceItem[];
  onRetire?: (id: string) => void;
  onGoToMarketplace?: () => void;
}

export function OurMarketplaceSection({
  items,
  
}: OurMarketplaceSectionProps)  {


  // Default data if none provided
  const defaultItems: MarketplaceItem[] = [
    {
      id: '1',
      title: 'Rainforest Restoration',
      location: 'Kano, Nigeria',
      treesPlanted: 10000,
      co2Offset: 2500,
      price: 10,
      imageUrl: '/card-img.jpg',
      imageAlt: 'Rainforest restoration project in Kano, Nigeria'
    },
    {
      id: '2',
      title: 'Rainforest Restoration',
      location: 'Kano, Nigeria',
      treesPlanted: 10000,
      co2Offset: 2500,
      price: 10,
      imageUrl: '/card-img.jpg',
      imageAlt: 'Rainforest restoration project in Kano, Nigeria'
    },
    {
      id: '3',
      title: 'Rainforest Restoration',
      location: 'Kano, Nigeria',
      treesPlanted: 10000,
      co2Offset: 2500,
      price: 10,
      imageUrl: '/card-img.jpg',
      imageAlt: 'Rainforest restoration project in Kano, Nigeria'
    }
  ];

    const handleRetire = (projectId: string) => {
    console.log(`Retiring project: ${projectId}`);
    // Add your retire logic here
  };
  
  const handleGoToMarketplace = () => {
    // router.push('/marketplace');
  };
  const marketplaceItems = items || defaultItems;

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-white" aria-labelledby="marketplace-heading">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-gray-600 text-xs md:text-sm mb-2 uppercase tracking-wide">
            Our Marketplace
          </p>
          <h2 
            id="marketplace-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
          >
            Featured Projects
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {marketplaceItems.map((item) => (
            <MarketplaceCard
              key={item.id}
              {...item}
              onRetire={handleRetire}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 md:mt-16">
          <button 
            onClick={handleGoToMarketplace}
            className="bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Go to marketplace to view all projects"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    </section>
  );
};

