"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, ChevronDown } from "lucide-react"; // ChevronDown arrow for dropdown
import Image from "next/image";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet"; // Assuming you've imported the Sheet component from ShadCN

const navLinks = [
  { href: "/", label: "Home" },
  // { href: "/about", label: "About" },
  {
    href: "/services",
    label: "Ophold",
    dropdownLinks: [
      { href: "/about-the-hotel", label: "Om Sommerhuset" },
      { href: "/services/mobile", label: "Billeder" },
    ],
  },
  {
    href: "https://www.delchiya.de/about-the-hotel/",
    label: "Aktiviteter",
    dropdownLinks: [
      {
        href: "https://www.delchiya.de/pool/",
        label: "Pool & Spa",
      },
      {
        href: "https://www.delchiya.de/xbox-ultimate/",
        label: "Xbox Ultimate",
      },
      {
        href: "https://www.delchiya.de/tv-film/",
        label: "XL TV & Film",
      },
      {
        href: "https://www.delchiya.de/billiard-airhockey/",
        label: "Billiard & Bordtennis",
      },
      {
        href: "https://www.delchiya.de/bordfodbold/",
        label: "BordFodbold & Airhockey",
      },
      {
        href: "https://www.delchiya.de/poker-blackjack/",
        label: "Poker & Blackjack",
      },
      {
        href: "https://www.delchiya.de/activity-detail-2/",
        label: "Lejeplads",
      },
      {
        href: "https://www.delchiya.de/local-activities/",
        label: "Lokale Aktiviteter",
      },
    ],
  },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null); // Track which dropdown is open on desktop
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<
    number | null
  >(null); // Track active dropdown in mobile view
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID for mouse leave

  // Handle mouse enter for dropdown (desktop)
  const handleMouseEnter = (index: number) => {
    setActiveDropdown(index);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle mouse leave with timeout (desktop)
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // Toggle mobile menu
  const handleMobileClick = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // Toggle mobile dropdown
  const handleMobileDropdownToggle = (
    event: React.MouseEvent,
    index: number
  ) => {
    event.preventDefault(); // Prevent navigation on click to toggle dropdown
    setActiveMobileDropdown((prev) => (prev === index ? null : index)); // Close if it's already open, open it if not
  };

  return (
    <header className="absolute top-0 w-full z-40 border-b border-b-white/40 bg-gradient-to-b from-black/40 to-transparent  px-[5%] transition-all">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-4 py-7">
        <div className="flex space-x-6">
          {navLinks.map((link, index) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.dropdownLinks && handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={link.href}
                className="text-white flex items-center space-x-1 uppercase font-medium text-sm"
              >
                <span>{link.label}</span>
                {link.dropdownLinks && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                )}
              </Link>
              {link.dropdownLinks && activeDropdown === index && (
                <motion.div
                  className="absolute top-10 left-0 bg-black text-white p-2 rounded shadow-lg text-nowrap"
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
                      className="block py-2 px-4 hover:text-gray-200  text-sm"
                    >
                      {dropdownLink.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <Link href="/" className="w-full">
          <div className="relative min-h-10">
            <Image
              src={`/logo.svg`}
              alt="navbar logo"
              fill
              priority
              className="h-full w-full z-40"
            />
          </div>
        </Link>

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
        <button onClick={handleMobileClick} className="text-white">
          <Menu size={24} />
        </button>

        <Link href="/" className="w-full">
          <div className="relative min-h-7">
            <Image
              src={`/logo.svg`}
              alt="navbar logo"
              fill
              priority
              className="h-full w-full"
            />
          </div>
        </Link>
      </nav>

      {/* Mobile Sheet (ShadCN) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTitle />
        <SheetContent side="right" className="bg-green h-full  border-green">
          <div className="flex flex-col items-start justify-start pt-[30%] space-y-4 p-10 ">
            {navLinks.map((link, index) => (
              <div key={link.href} className="relative w-full">
                <div className="flex items-center justify-between min-w-full gap-6">
                  <Link
                    href={link.href}
                    className="text-white text-2xl flex items-center space-x-2"
                    onClick={(event) =>
                      link.dropdownLinks
                        ? handleMobileDropdownToggle(event, index)
                        : setIsMobileOpen(false)
                    } // Prevent navigation for dropdown toggle
                  >
                    <span>{link.label}</span>
                  </Link>
                  {link.dropdownLinks && (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{
                        rotate: activeMobileDropdown === index ? 180 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown size={16} className="text-white" />
                    </motion.div>
                  )}
                </div>
                {link.dropdownLinks && activeMobileDropdown === index && (
                  <motion.div
                    className="flex flex-col bg-black text-white p-2 rounded shadow-lg mt-2"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activeMobileDropdown === index ? 1 : 0,
                      y: activeMobileDropdown === index ? 0 : -10,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut", delay: 0 }}
                  >
                    {link.dropdownLinks.map((dropdownLink) => (
                      <Link
                        key={dropdownLink.href}
                        href={dropdownLink.href}
                        className="block py-2 px-4 hover:bg-gray-200"
                        onClick={() => setIsMobileOpen(false)} // Close mobile menu on link click
                      >
                        {dropdownLink.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
            {/* <Link href="/book-now">
              <button className="border border-black text-black px-4 py-2 bg-transparent mt-4">
                Book Now
              </button>
            </Link> */}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Navbar;
