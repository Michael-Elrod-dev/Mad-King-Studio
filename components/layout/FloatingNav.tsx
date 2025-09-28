// components/layout/FloatingNav.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialLinks from "./SocialLinks";

const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        // Close mobile menu on scroll
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isHomePage]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest(".mobile-nav-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    { href: "/blog", label: "Blog" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isHomePage
            ? `fixed ${isVisible ? "translate-y-0" : "-translate-y-full"}`
            : "relative"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-60">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
              <span className="text-white text-sm">MKS</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
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

          {/* Desktop Social Links */}
          <div className="hidden md:block">
            <SocialLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden mobile-nav-container relative">
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md relative z-50"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isMobileMenuOpen
                      ? "rotate-45 translate-y-1"
                      : "-translate-y-0.5"
                  }`}
                ></span>
                <span
                  className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isMobileMenuOpen
                      ? "-rotate-45 -translate-y-1"
                      : "translate-y-0.5"
                  }`}
                ></span>
              </div>
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-900 border border-neutral-700 rounded-md shadow-xl z-50">
                {/* Navigation Links */}
                <div className="py-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        pathname === item.href
                          ? "text-red-500 bg-neutral-800"
                          : "text-white/90 hover:text-white hover:bg-neutral-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Social Links in Mobile Menu */}
                <div className="border-t border-neutral-700 px-4 py-4">
                  <div className="text-xs text-white/60 mb-3 uppercase tracking-wide">
                    Follow
                  </div>
                  <div className="flex justify-around">
                    <SocialLinks />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingNav;
