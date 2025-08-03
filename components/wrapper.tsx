"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded

    if (status === "authenticated" && pathname === "/d/l") {
      // If logged in and on login page, redirect to dashboard
      router.replace("/d/a");
    }

    if (status === "unauthenticated" && pathname !== "/d/l") {
      // If not logged in and trying to access protected route, redirect to login
      router.replace("/d/l");
    }
  }, [status, pathname, router]);

  return <>{children}</>;
}
