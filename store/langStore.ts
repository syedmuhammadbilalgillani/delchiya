import { create } from "zustand";

// Define the store type for language state
interface LanguageStore {
  language: string;
  setLanguage: (language: string) => void;
}

// Helper function to safely access localStorage
const getStoredLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("preferredLanguage") || "en";
  }
  return "en"; // Default fallback for SSR
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: getStoredLanguage(), // Initialize with safe localStorage access
  setLanguage: (language: string) => {
    // Persist the selected language to localStorage only in browser
    if (typeof window !== 'undefined') {
      localStorage.setItem("preferredLanguage", language);
    }
    set({ language });
  },
}));

// Remove the problematic module-level localStorage access
// The store will be initialized properly when used in components