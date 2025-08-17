"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialLinks from "./SocialLinks";

const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    { href: "/devlog", label: "Devlog" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">MKS</span>
          </div>
          <span className="text-white text-lg hidden sm:block">
            Mad King Studio
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-white transition-colors duration-200 text-sm font-medium ${
                pathname === item.href ? "text-red-500" : "text-white/90"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <SocialLinks />
      </div>
    </nav>
  );
};

export default FloatingNav;
