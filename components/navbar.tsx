"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, ChevronDown } from "lucide-react"; // ChevronDown arrow for dropdown
import Image from "next/image";
import { Sheet, SheetContent } from "./ui/sheet"; // Assuming you've imported the Sheet component from ShadCN

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/services",
    label: "Services",
    dropdownLinks: [
      { href: "/services/web", label: "Web Design" },
      { href: "/services/mobile", label: "Mobile App" },
      { href: "/services/seo", label: "SEO" },
    ],
  },
  {
    href: "/products",
    label: "Products",
    dropdownLinks: [
      { href: "/products/electronics", label: "Electronics" },
      { href: "/products/clothing", label: "Clothing" },
    ],
  },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null); // Track which dropdown is open
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID for mouse leave

  // Handle mouse enter for dropdown
  const handleMouseEnter = (index: number) => {
    setActiveDropdown(index); // Set active dropdown index on hover
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timeout when re-entering
    }
  };

  // Handle mouse leave with timeout
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null); // Close the dropdown after delay
    }, 200); // Delay time in ms
  };

  // Toggle mobile menu
  const handleMobileClick = () => {
    setIsMobileOpen((prev) => !prev); // Toggle mobile dropdown
  };

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white px-[5%] transition-all">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-4 py-2">
        {/* Left Nav Links */}
        <div className="flex space-x-6">
          {navLinks.map((link, index) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.dropdownLinks && handleMouseEnter(index)} // Open dropdown on hover
              onMouseLeave={handleMouseLeave} // Close dropdown after timeout on mouse leave
            >
              <Link
                href={link.href}
                className="text-white flex items-center space-x-1"
              >
                <span>{link.label}</span>
                {link.dropdownLinks && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: activeDropdown === index ? 180 : 0 }} // Rotate arrow based on active dropdown
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                )}
              </Link>
              {link.dropdownLinks && activeDropdown === index && (
                <motion.div
                  className="absolute top-10 left-0 bg-black text-white p-2 rounded shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeDropdown === index ? 1 : 0,
                    y: activeDropdown === index ? 0 : -10,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: activeDropdown === index ? 0 : 0.2,
                  }}
                >
                  {link.dropdownLinks.map((dropdownLink) => (
                    <Link
                      key={dropdownLink.href}
                      href={dropdownLink.href}
                      className="block py-2 px-4 hover:text-gray-200"
                    >
                      {dropdownLink.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Logo in the center */}
        <Link href="/" className="w-full">
          <div className="relative min-h-10">
            <Image
              src={`/logo.svg`}
              alt="navbar logo"
              fill
              className="h-full w-full"
            />
          </div>
        </Link>

        {/* Right side with contact and book now */}
        <div className="flex items-center space-x-6 text-nowrap">
          <p className="text-white">Tel: +45 31216149</p>
          <Link href="/book-now">
            <button className="border border-white text-white px-4 py-2 bg-transparent">
              Book Now
            </button>
          </Link>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden flex items-center justify-between p-4">
        {/* Toggle Button */}
        <button onClick={handleMobileClick} className="text-white">
          <Menu size={24} />
        </button>

        {/* Logo in the center */}
        <Link href="/" className="w-full">
          <div className="relative min-h-7">
            <Image
              src={`/logo.svg`}
              alt="navbar logo"
              fill
              className="h-full w-full"
            />
          </div>
        </Link>
      </nav>

      {/* Mobile Sheet (ShadCN) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="right">
          <div className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link, index) => (
              <div key={link.href} className="relative">
                <Link
                  href={link.href}
                  className="text-black text-xl flex items-center space-x-2"
                >
                  <span>{link.label}</span>
                  {link.dropdownLinks && (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: isMobileOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  )}
                </Link>
                {link.dropdownLinks && isMobileOpen && (
                  <motion.div
                    className="flex flex-col bg-gray-100 p-2 rounded shadow-lg mt-2"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isMobileOpen ? 1 : 0,
                      y: isMobileOpen ? 0 : -10,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: isMobileOpen ? 0 : 0.2,
                    }}
                  >
                    {link.dropdownLinks.map((dropdownLink) => (
                      <Link
                        key={dropdownLink.href}
                        href={dropdownLink.href}
                        className="block py-2 px-4 hover:bg-gray-200"
                      >
                        {dropdownLink.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
            <Link href="/book-now">
              <button className="border border-black text-black px-4 py-2 bg-transparent mt-4">
                Book Now
              </button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Navbar;
