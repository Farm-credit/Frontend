import React from "react";
import FooterLink from "./footer-link";
import SocialIcon from "./social-icon";

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 text-sm">
      {/* Curved top background using SVG arc */}
      <div className="absolute -top-40 left-0 right-0 pointer-events-none" aria-hidden>
        <svg
          className="block w-full h-40"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          role="presentation"
        >
          {/* This path creates a smooth semi-elliptical curve */}
          <path d="M0,160 C360,0 1080,0 1440,160 L1440,160 L0,160 Z" fill="black" />
        </svg>
      </div>

      <div className="relative bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <nav aria-label="Footer navigation" className="flex flex-col gap-12 md:grid md:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-orange-400">Farm</span>
                  <span className="text-lime-500">Credit</span>
                </span>
              </div>
              <p className="mt-4 text-gray-400 max-w-xs">Empowering farmers with accessible finance and transparent marketplace tools.</p>
              <div className="mt-6 flex items-center gap-3">
                {/* Sample social icons (Twitter, Discord, Telegram) */}
                <SocialIcon
                  href="https://twitter.com"
                  label="Twitter"
                  svgPath="M8.29 20c7.547 0 11.675-6.155 11.675-11.49 0-.175 0-.35-.012-.523A8.18 8.18 0 0 0 22 5.92a8.32 8.32 0 0 1-2.357.642 4.07 4.07 0 0 0 1.804-2.243 8.19 8.19 0 0 1-2.605.982A4.11 4.11 0 0 0 15.448 4c-2.266 0-4.1 1.815-4.1 4.056 0 .318.037.628.107.925A11.65 11.65 0 0 1 3.15 5.15a4.01 4.01 0 0 0-.556 2.04 4.05 4.05 0 0 0 1.824 3.374 4.12 4.12 0 0 1-1.857-.51v.052c0 1.96 1.41 3.596 3.282 3.968-.343.092-.705.137-1.077.137-.263 0-.52-.025-.77-.073.52 1.61 2.03 2.78 3.82 2.813A8.25 8.25 0 0 1 2 18.407a11.62 11.62 0 0 0 6.29 1.843"
                />
                <SocialIcon
                  href="https://discord.com"
                  label="Discord"
                  svgPath="M20 6.5a17.5 17.5 0 0 0-3.9-1.25l-.2.43a16.2 16.2 0 0 1 2.58.73c-2.43-1.76-5.14-1.7-7.96 0a15.28 15.28 0 0 1 2.6-.73l-.22-.43A17.5 17.5 0 0 0 8 6.5C5.73 7.8 4 10.5 4 14c1.9 1.4 3.9 2.2 6 2.5l.46-1.01c-1.1-.26-2.14-.67-3.11-1.23.28.2.57.39.87.56 1.76.99 3.76 1.5 5.78 1.5s4.01-.51 5.78-1.5c.3-.17.59-.36.87-.56-.97.56-2.01.97-3.11 1.23l.46 1.01c2.1-.3 4.1-1.1 6-2.5 0-3.5-1.73-6.2-4-7.5ZM9.25 13c-.69 0-1.25-.67-1.25-1.5S8.56 10 9.25 10s1.25.67 1.25 1.5-.56 1.5-1.25 1.5Zm5.5 0c-.69 0-1.25-.67-1.25-1.5s.56-1.5 1.25-1.5 1.25.67 1.25 1.5-.56 1.5-1.25 1.5Z"
                />
                <SocialIcon
                  href="https://t.me"
                  label="Telegram"
                  svgPath="M21.5 3.5 2.8 10.7c-.7.28-.7 1.26.05 1.5l4.6 1.43 1.8 5.7c.2.64 1.01.88 1.53.43l2.6-2.23 4.8 3.52c.6.45 1.46.12 1.66-.62L23 4.7c.18-.66-.47-1.25-1.17-1.2ZM8.6 19.5l1.1-3.78 4.96-6.1a.4.4 0 0 0-.5-.6l-6.67 4.9-3.04-.95 15.96-6.3-11.81 8.22Z"
                />
              </div>
            </div>

            {/* About */}
            <div>
              <h4 className="mb-4 font-semibold text-gray-200">About</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="#mission">Our Mission</FooterLink>
                <FooterLink href="#how">How it works</FooterLink>
                <FooterLink href="#team">Team</FooterLink>
                <FooterLink href="#pricing">Pricing</FooterLink>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 font-semibold text-gray-200">Resources</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="#blog">Blog</FooterLink>
                <FooterLink href="#help">Help Center</FooterLink>
                <FooterLink href="#docs">Documentation</FooterLink>
                <FooterLink href="#support">Support</FooterLink>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="mb-4 font-semibold text-gray-200">Community</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="#discord">Discord</FooterLink>
                <FooterLink href="#twitter">Twitter</FooterLink>
                <FooterLink href="#telegram">Telegram</FooterLink>
                <FooterLink href="#events">Events</FooterLink>
              </ul>
            </div>
          </nav>

          {/* Divider */}
          <div className="mt-12 h-px w-full bg-white/10" />

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-gray-400">© {new Date().getFullYear()} FarmCredit. All rights reserved.</p>
            <nav aria-label="Legal" className="text-gray-300">
              <ul className="flex flex-wrap gap-4">
                <FooterLink href="#privacy">Privacy Policy</FooterLink>
                <FooterLink href="#terms">Terms of Service</FooterLink>
                <FooterLink href="#contact">Contact</FooterLink>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;