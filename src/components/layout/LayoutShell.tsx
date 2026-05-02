"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const EXCLUDED_ROUTES = ["/login", "/register", "/forgot-password"];
const EXCLUDED_PREFIXES = ["/dashboard", "/admin"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded = EXCLUDED_ROUTES.includes(pathname) || EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));

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
