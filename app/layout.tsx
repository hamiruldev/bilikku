import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bilikku - Property Management Made Simple",
  description: "Manage your properties, tenants, and payments efficiently with Bilikku",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <AuthenticatedLayout>
              {children}
            </AuthenticatedLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
