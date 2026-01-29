'use client';

import { useState, useEffect } from 'react';
import { ProjectFilters } from '@/types';
import { getUniqueCountries, getUniqueTreeTypes, getPriceRange } from '@/lib/mock-projects';

interface ProjectFiltersProps {
  onFilterChange: (filters: ProjectFilters) => void;
}

export default function ProjectFiltersComponent({ onFilterChange }: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const countries = getUniqueCountries();
  const treeTypes = getUniqueTreeTypes();
  const priceRange = getPriceRange();

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTreeTypes, setSelectedTreeTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(priceRange.min);
  const [maxPrice, setMaxPrice] = useState<number>(priceRange.max);

  useEffect(() => {
    onFilterChange({
      regions: selectedRegions,
      treeTypes: selectedTreeTypes,
      priceRange: { min: minPrice, max: maxPrice },
    });
  }, [selectedRegions, selectedTreeTypes, minPrice, maxPrice, onFilterChange]);

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleTreeTypeToggle = (type: string) => {
    setSelectedTreeTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedRegions([]);
    setSelectedTreeTypes([]);
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  };

  const activeFilterCount = selectedRegions.length + selectedTreeTypes.length + 
    (minPrice !== priceRange.min || maxPrice !== priceRange.max ? 1 : 0);

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full mb-4 bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </span>
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters Panel */}
      <div className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-5
        ${isOpen ? 'block' : 'hidden'} lg:block
      `}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Region Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Country</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {countries.map((country) => (
              <label key={country} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(country)}
                  onChange={() => handleRegionToggle(country)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tree Type Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Tree Type</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {treeTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTreeTypes.includes(type)}
                  onChange={() => handleTreeTypeToggle(type)}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Price per Tree (USD)</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Min: ${minPrice.toFixed(2)}</label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step="0.1"
                value={minPrice}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMinPrice(Math.min(val, maxPrice));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Max: ${maxPrice.toFixed(2)}</label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step="0.1"
                value={maxPrice}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMaxPrice(Math.max(val, minPrice));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
