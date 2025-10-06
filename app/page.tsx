

import React from 'react';
import {OurMarketplaceSection} from '@/components/our-marketplace-section';
import {LookingToDoMoreSection} from '@/components/looking-todo-more-section';
import FAQSection from '@/components/faq-section';
import HowItWorksSection from '@/components/works-section';

export default function HomePage () {


  return (
    <main className="min-h-screen">
      <HowItWorksSection/>

      <OurMarketplaceSection
      />
      <LookingToDoMoreSection
      />

      <FAQSection/>
    </main>
  );
};

