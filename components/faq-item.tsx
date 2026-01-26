"use client";
import React from "react";

// FAQ Item Component
interface FAQItemProps {
  number: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export const FAQItem: React.FC<FAQItemProps> = ({ 
  number, 
  question, 
  answer, 
  isOpen, 
  onClick 
}) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 md:py-8 px-4 md:px-6 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${number}`}
      >
        <div className="flex items-start gap-4 md:gap-6 lg:gap-8 flex-1">
          <span className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-300 leading-none flex-shrink-0">
            {number.toString().padStart(2, '0')}
          </span>
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 pr-2 md:pr-4 pt-1">
            {question}
          </h3>
        </div>
        <div 
          className={`flex-shrink-0 transition-all duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? 'bg-black' : 'bg-gray-200'
          }`}>
            {isOpen ? (
              <span className="text-white text-2xl md:text-3xl font-light leading-none">×</span>
            ) : (
              <span className="text-gray-800 text-xl md:text-2xl font-light leading-none">+</span>
            )}
          </div>
        </div>
      </button>
      <div
        id={`faq-answer-${number}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-6 md:pb-8 px-4 md:px-6 pl-14 md:pl-20 lg:pl-24">
          <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

