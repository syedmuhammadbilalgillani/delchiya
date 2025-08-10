"use client"; // Mark this component to be client-side

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/store/langStore";
import { motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";

// Define supported languages with their display names
const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "da", name: "Danish" },
  // Additional languages can be added here
];

const normalizeLanguageCode = (code: string) => {
  if (code.startsWith("en")) {
    return "en";
  }
  return code;
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore(); // Use Zustand store for language
  const changeLanguage = (lng: string) => {
    const normalizedLanguage = normalizeLanguageCode(lng);
    setLanguage(normalizedLanguage); // Update language in Zustand store and persist it in localStorage
  };

  const currentLanguage = useMemo(
    () => supportedLanguages.find((lang) => lang.code === language),
    [language]
  );

  useEffect(() => {
    const storedLanguage = localStorage.getItem("preferredLanguage") || "en";
    const normalizedLanguage = normalizeLanguageCode(storedLanguage);
    setLanguage(normalizedLanguage); // Set the language in Zustand store when component mounts
  }, [setLanguage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center gap-2 border p-2 rounded-lg bg-green text-yellow border-yellow cursor-pointer min-w-10"
          aria-label="Toggle Language Menu"
        >
          <motion.span
            key={language}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-semibold"
          >
            {currentLanguage?.code.toUpperCase()}
          </motion.span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${
              language === lang.code
                ? "text-blue-500 font-semibold"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
