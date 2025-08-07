"use client";

import { useTranslation } from "react-i18next";
import { JSX } from "react";

interface TranslatedTextProps {
  textKey: string;
  ns?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function Text({
  textKey,
  ns,
  className,
  as,
}: TranslatedTextProps) {
  const { t } = useTranslation(ns);
  const Component = as || "span";

  return (
    <Component suppressHydrationWarning className={`${className} `}>
      {t(textKey)}
    </Component>
  );
}
