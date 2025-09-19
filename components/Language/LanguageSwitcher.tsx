"use client"; // Mark this component to be client-side

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/store/langStore";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadTranslations } from "./i18n";
import { Loader2 } from "lucide-react";
import { useLoading } from "@/context/loading-context";

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
  const { i18n } = useTranslation();

  const { setLoading, loading } = useLoading();

  const changeLanguage = async (lng: string) => {
    const normalizedLanguage = normalizeLanguageCode(lng);
    setLoading(true);
    await loadTranslations(normalizedLanguage);
    i18n.changeLanguage(normalizedLanguage);
    setLanguage(normalizedLanguage);
    setLoading(false);
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

  useEffect(() => {
    const preferredLanguage = localStorage.getItem("preferredLanguage") || "en";
    const normalizedLanguage = normalizeLanguageCode(preferredLanguage);
    i18n.changeLanguage(normalizedLanguage);
    setLanguage(normalizedLanguage);
  }, [i18n]);

  // const changeLanguage = (lng: string) => {
  //   const normalizedLanguage = normalizeLanguageCode(lng);
  //   i18n.changeLanguage(normalizedLanguage);
  //   localStorage.setItem("preferredLanguage", normalizedLanguage);
  //   setSelectedLanguage(normalizedLanguage);
  // };

  // const currentLanguage = useMemo(
  //   () => supportedLanguages.find((lang) => lang.code === selectedLanguage),
  //   [O]
  // );

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
