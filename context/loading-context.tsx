"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Define the context type
type LoadingContextType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
};

// 2. Create the context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// 3. Provider component
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {/* Global spinner */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="spinner" />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

// 4. Custom hook for easy usage
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
