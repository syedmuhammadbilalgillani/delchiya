"use client";
import NavbarForAdmin from "@/components/nav";
import Wrapper from "@/components/wrapper";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div suppressHydrationWarning>
      <SessionProvider>
        <NavbarForAdmin />
        <Wrapper>{children}</Wrapper>
      </SessionProvider>
    </div>
  );
}
