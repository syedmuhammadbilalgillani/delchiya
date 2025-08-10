"use client";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

interface JoditEditorComponentProps {
  name: string;
  placeholder?: string;
  required?: boolean;
  initialValue?: string;
  onChange?: (value: string) => void; // Optional handler for onChange
  error?: string; // Custom error message (optional)
}

const JoditEditorComponent: React.FC<JoditEditorComponentProps> = ({
  name,
  placeholder,
  required,
  initialValue = "",
  onChange,
  error,
}) => {
  const [content, setContent] = useState<string>(initialValue); // Local state for editor content
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const editor = useRef(null);

//   // Function to get the current theme
//   const getCurrentTheme = () => {
//     const systemDark = window.matchMedia(
//       "(prefers-color-scheme: dark)"
//     ).matches;
//     const storedTheme = localStorage.get("theme");

//     if (storedTheme === "system") {
//       return systemDark ? "dark" : "light";
//     }
//     return storedTheme === "dark" ? "dark" : "light";
//   };

//   // Initial theme setup
//   useEffect(() => {
//     setCurrentTheme(getCurrentTheme());

//     // Listen for theme changes
//     const observer = new MutationObserver(() => {
//       setCurrentTheme(getCurrentTheme());
//     });

//     // Observe both data-theme attribute and class changes
//     const root = document.documentElement;
//     observer.observe(root, {
//       attributes: true,
//       attributeFilter: ["data-theme", "class"],
//     });

//     // Listen for system theme changes
//     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//     const handleSystemThemeChange = () => {
//       if (localStorage.get("theme") === "system") {
//         setCurrentTheme(getCurrentTheme());
//       }
//     };
//     mediaQuery.addEventListener("change", handleSystemThemeChange);

//     return () => {
//       observer.disconnect();
//       mediaQuery.removeEventListener("change", handleSystemThemeChange);
//     };
//   }, []);

  // Config for Jodit Editor
  const config = useMemo(
    () => ({
      toolbarAdaptive: false,
      readonly: false,
      toolbar: true,
      theme: currentTheme, // Use the current theme state
      placeholder: placeholder,
    }),
    [placeholder, currentTheme]
  );

  // Function to handle editor change
  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent); // If an external onChange handler is provided, call it
    }
  };

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={10} // tabIndex of textarea
        onBlur={handleEditorChange} // Handle editor blur and content change
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default JoditEditorComponent;
