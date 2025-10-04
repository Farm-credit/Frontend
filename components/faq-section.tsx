"use client";

import { useState } from "react";
import { FAQItem } from "./faq-item";

// Main FAQ Section Component
const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      question: "What are carbon credits?",
      answer: "Carbon credits represent a reduction of one metric ton of CO₂ emissions. By purchasing carbon credits, you're funding projects that reduce or remove greenhouse gases from the atmosphere."
    },
    {
      question: "How does blockchain proof work?",
      answer: "Blockchain technology provides an immutable, transparent ledger that records every transaction. Each carbon credit purchase is verified and recorded on the blockchain, ensuring transparency and preventing double-spending or fraud."
    },
    {
      question: "Which cryptocurrencies are accepted?",
      answer: "We accept major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), USDC, USDT, and other stablecoins. The full list of supported currencies is available during the checkout process."
    },
    {
      question: "How is my donation verified?",
      answer: "Every donation is recorded on the blockchain with a unique transaction ID. You'll receive a digital certificate with proof of your contribution, which can be independently verified on the blockchain explorer."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <>
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-10 md:mb-12 lg:mb-16">
            Frequently Asked Question
          </h2>
          
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                number={index + 1}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>
      
    </>
  );
};

export default FAQSection;