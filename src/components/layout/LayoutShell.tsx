"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const EXCLUDED_ROUTES = ["/login", "/register", "/forgot-password"];
const EXCLUDED_PREFIXES = ["/dashboard", "/admin"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isExcluded = isMounted && (EXCLUDED_ROUTES.includes(pathname) || EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p)));

  // During hydration, render with Navbar/Footer to match server
  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
