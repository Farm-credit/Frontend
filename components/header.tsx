"use client";

/**
 * Header Component - Navigation with wallet connector
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnector from "./wallet-connector";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">FarmCredit</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            <Link
              href="/donate"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith("/donate")
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Donate
            </Link>
          </nav>

          {/* Wallet Connector */}
          <WalletConnector />
        </div>
      </div>
    </header>
  );
}