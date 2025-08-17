"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialLinks from "./SocialLinks";

const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

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
  }, [lastScrollY, isHomePage]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    { href: "/blog", label: "Blog" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isHomePage
          ? `fixed ${isVisible ? "translate-y-0" : "-translate-y-full"}`
          : "relative"
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
              className={`hover:text-white transition-colors duration-200 text-sm font-medium border-b-2 pb-1 ${
                pathname === item.href
                  ? "text-red-500 border-red-500"
                  : "text-white/90 border-transparent hover:border-white/30"
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
