import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '../components/ThemeProvider';
import { AuthenticatedLayout } from '../components/AuthenticatedLayout';
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from '../context/LanguageContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Bilikku - Property Management Made Simple",
  description: "Manage your properties, tenants, and payments efficiently with Bilikku",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LanguageProvider>
              <AuthenticatedLayout>
                {children}
              </AuthenticatedLayout>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
