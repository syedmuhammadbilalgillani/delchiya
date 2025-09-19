"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { loadTranslations } from "./i18n";
import { Loader2 } from "lucide-react";
import { LoadingProvider, useLoading } from "@/context/loading-context";

// This component wraps anything that needs i18n functionality
export default function I18nClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { setLoading, loading } = useLoading();

  useEffect(() => {
    const preferred = localStorage.getItem("preferredLanguage") || "en";
    setLoading(true);
    loadTranslations(preferred).finally(() => setLoading(false));
  }, []);

  if (loading) {
    // Simple spinner, you can replace with your own spinner component
    return (
      <div
        style={{
          display: "flex",
          position: "fixed",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <Loader2 className="animate-spin text-2xl" />
      </div>
    );
  }

  return (
   
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  );
}
