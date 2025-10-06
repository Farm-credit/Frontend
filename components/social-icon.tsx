import React from "react";

type SocialIconProps = {
  href: string;
  label: string;
  svgPath: string; // single path data for simplicity
};

export const SocialIcon: React.FC<SocialIconProps> = ({ href, label, svgPath }) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-gray-300 group-hover:text-white"
        fill="currentColor"
      >
        <path d={svgPath} />
      </svg>
    </a>
  );
};

export default SocialIcon;