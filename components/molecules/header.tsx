"use client";

import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to manage mobile menu visibility

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle the mobile menu state
  };

  return (
    <header className="sticky top-0 z-50 bg-white rounded-2xl px-6 max-w-11/12 mx-auto">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
        <img
          alt="FarmCredit logo with orange circular lines and green text"
          className="w-10 h-10 object-contain"
          height={40}
          src="/Logo.png"
          width={40}
        />
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {[
              { name: "About FarmCredit", href: "#about" },
              { name: "Why Carbon Farming", href: "#carbon-farming" },
              { name: "What We Offer", href: "#offer" },
              { name: "How It Works", href: "#how-it-works" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-[#1A1A3D] hover:text-[#5a7a22] transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#5a7a22] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
          
          {/* CTA Button */}
          <button
            className="bg-[#A6F52B] hover:bg-[#8bd100] text-[#1A1A3D] font-semibold text-sm rounded-full px-6 py-2.5 transition-all duration-300 shadow-md hover:shadow-lg"
            type="button"
          >
            Join Waitlist
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-[#1A1A3D] focus:outline-none" 
          onClick={toggleMobileMenu} // Toggle mobile menu on click
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu (Hidden by default) */}
      {isMobileMenuOpen && ( // Render mobile menu based on state
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {[
              { name: "About FarmCredit", href: "#about" },
              { name: "Why Carbon Farming", href: "#carbon-farming" },
              { name: "What We Offer", href: "#offer" },
              { name: "How It Works", href: "#how-it-works" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-[#1A1A3D] hover:bg-gray-50 rounded-md"
              >
                {item.name}
              </a>
            ))}
            <button
              className="w-full mt-2 bg-[#A6F52B] hover:bg-[#8bd100] text-[#1A1A3D] font-semibold text-sm rounded-full px-4 py-2 transition-colors duration-200"
              type="button"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      )}
    </header>
  );
}