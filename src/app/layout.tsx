import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "PrepMaster — Ace Your USMLE with Expert-Led Preparation",
  description:
    "The modern USMLE preparation platform with 2,000+ practice questions, mock exams, advanced analytics, and one-on-one tutoring from 250+ scorers. Start your free trial today.",
  keywords: [
    "USMLE",
    "Step 1",
    "Step 2 CK",
    "medical exam prep",
    "QBank",
    "mock exam",
    "USMLE tutoring",
  ],
  openGraph: {
    title: "PrepMaster — Ace Your USMLE",
    description:
      "2,000+ questions, realistic mock exams, and expert tutoring to maximize your USMLE score.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
