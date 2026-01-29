"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  TreeDeciduous,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ImpactCounter = ({
  label,
  value,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg min-w-[120px] w-full"
    >
      <Icon className="w-6 h-6 text-primary mb-2" />
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-white/80 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
};

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-x-hidden pt-20 pb-10 sm:pt-0 sm:pb-0">
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0 select-none pointer-events-none"
      >
        <Image
          src="/images/forest.jpg"
          alt="Lush green forest"
          fill
          className="object-cover brightness-[0.65]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Plant Trees. <br className="hidden md:block" />
            <span className="text-primary-foreground text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">
              Earn Carbon Credits.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            Join the global movement to offset carbon emissions directly on the
            blockchain. Transparent, impactful, and rewarding.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/projects"
            className="group relative px-8 py-4 bg-primary hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 shadow-[0_0_20px_-5px_rgba(5,150,105,0.5)] hover:shadow-[0_0_30px_-5px_rgba(5,150,105,0.7)] flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Start Contributing</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer" />
          </Link>

          <button
            onClick={() => {
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium rounded-full transition-all duration-300 flex items-center gap-2"
          >
            Learn More
          </button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12 w-full max-w-3xl">
          <ImpactCounter
            icon={TreeDeciduous}
            value="12,504"
            label="Trees Planted"
            delay={0.6}
          />
          <div className="col-span-1">
            <ImpactCounter
              icon={Leaf}
              value="4,210 t"
              label="CO₂ Offset"
              delay={0.7}
            />
          </div>
          <div className="col-span-2 md:col-span-1 flex justify-center">
            <ImpactCounter
              icon={Users}
              value="892"
              label="Contributors"
              delay={0.8}
            />
          </div>
        </div>
      </div>
    </section>
  );
}