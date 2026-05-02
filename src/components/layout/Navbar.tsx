"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, GraduationCap, LayoutDashboard } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Determine if we're on a dark-hero page (landing)
  const isDarkHero = pathname === "/";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-surface-border"
            : isDarkHero
            ? "bg-transparent"
            : "bg-white shadow-soft border-b border-surface-border"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <span
                className={cn(
                  "text-xl font-bold tracking-tight transition-colors duration-300",
                  isScrolled || !isDarkHero ? "text-primary" : "text-white"
                )}
              >
                Prep<span className="text-accent">Master</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                      isActive
                        ? isScrolled || !isDarkHero
                          ? "text-primary bg-primary/5"
                          : "text-white bg-white/10"
                        : isScrolled || !isDarkHero
                        ? "text-body hover:text-primary hover:bg-surface-tertiary"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex btn-primary text-sm !py-2.5 !px-5"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      "hidden md:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isScrolled || !isDarkHero
                        ? "text-primary hover:bg-primary/5"
                        : "text-white/90 hover:bg-white/10"
                    )}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/book-consultation"
                    className="hidden md:inline-flex btn-primary text-sm !py-2.5 !px-5"
                  >
                    Book Free Consultation
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={cn(
                  "lg:hidden p-2 rounded-lg transition-colors",
                  isScrolled || !isDarkHero
                    ? "text-primary hover:bg-surface-tertiary"
                    : "text-white hover:bg-white/10"
                )}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-strong z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-surface-border">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold text-primary">
                      Prep<span className="text-accent">Master</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-lg text-body hover:bg-surface-tertiary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors",
                          isActive
                            ? "text-primary bg-accent/10 border-r-2 border-accent"
                            : "text-body hover:text-primary hover:bg-surface-secondary"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-surface-border space-y-3">
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="block text-center btn-primary w-full text-sm"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-1.5 inline" />
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block text-center px-4 py-3 text-sm font-medium text-primary border border-surface-border rounded-xl hover:bg-surface-secondary transition-colors"
                      >
                        Log In
                      </Link>
                      <Link
                        href="/book-consultation"
                        className="block text-center btn-primary w-full text-sm"
                      >
                        Book Free Consultation
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
