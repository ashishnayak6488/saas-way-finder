import { Geist_Mono } from "next/font/google"; // Updated import names for clarity
import { ThemeProvider } from "./theme/ThemeProvider";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ClientWrapper from "@/lib/ClientWrapper";
import RouteGuard from "@/components/RouteGuard";
import type { Metadata } from "next"; // Import Metadata type from Next.js

// Configure GeistSans and GeistMono fonts
const geistSans = Geist_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Enhanced SEO Metadata with Google verification
export const metadata: Metadata = {
  title: "Contentm Digital Signage",
  description:
    "Enhance your digital signage experience with contentm's high-quality solutions.",
  verification: {
    google: "iXlDgmYbYz8RMdZ5MTn1Ex7QlbrVDadNoRut4zRa8HM",
  },
  keywords:
    "digital signage, contentm signage, high-quality displays, LED screens",
  openGraph: {
    title: "Contentm Digital Signage",
    description:
      "Enhance your digital signage experience with contentm's high-quality solutions.",
    url: "https://contentm.vrvinfoled.com",
    siteName: "Contentm Digital Signage",
    images: [
      {
        url: "https://zerocreativity0.wordpress.com/wp-content/uploads/2016/05/contentm-logo.jpg?w=736",
        width: 736,
        height: 736,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

// Define props type for RootLayout
interface RootLayoutProps {
  children: React.ReactNode; // Type for children prop
}

// RootLayout component with TypeScript
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ClientWrapper>
            <AuthProvider>
              <RouteGuard>{children}</RouteGuard>
            </AuthProvider>
          </ClientWrapper>

          {/* Lazy-loaded Toaster for better performance */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2000,
              style: {
                background: "#FFFFFF",
                color: "#000000",
                padding: "14px",
                borderRadius: "8px",
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: "#4CAF50",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 2000,
                iconTheme: {
                  primary: "#f44336",
                  secondary: "#fff",
                },
              },
              // closeButton: true,
              // closeOnClick: true,
              // dismissible: true,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
