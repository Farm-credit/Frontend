"use client";
import React from 'react';
import Image from 'next/image';
import { MarketplaceCardProps } from '@/types/marketplace.types';

export function MarketplaceCard({
  id,
  title,
  location,
  treesPlanted,
  co2Offset,
  price,
  currency = 'USD',
  imageUrl,
  imageAlt,
  onRetire
}: MarketplaceCardProps) {
  const handleRetireClick = () => {
    if (onRetire) {
      onRetire(id);
    }
  };

  return (
    <article className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Card Image */}
      <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt || `${title} in ${location}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{location}</p>
        
        <div className="mb-4 text-gray-700">
          <p className="text-sm">
            {treesPlanted.toLocaleString()} trees planted | {co2Offset.toLocaleString()} tons CO
            <sub>2</sub> offset
          </p>
        </div>
        
        <p className="text-lg font-bold text-gray-900 mb-4">
          {currency} {price}
        </p>
        
        <button
          onClick={handleRetireClick}
          className="bg-black text-white py-2.5 px-8 rounded-full font-semibold hover:bg-gray-800 active:bg-gray-900 transition-colors duration-300 uppercase text-xs tracking-wide focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-block"
          aria-label={`Retire carbon credits for ${title}`}
        >
          Retire
        </button>
      </div>
    </article>
  );
};

