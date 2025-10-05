import React from "react";

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

export const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <li>
      <a
        href={href}
        className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
      >
        {children}
      </a>
    </li>
  );
};

export default FooterLink;