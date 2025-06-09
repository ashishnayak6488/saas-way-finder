"use client";

import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import TypeWriter from "typewriter-effect";

import { cn } from "@/lib/utlis"; // ✅ Adjust if the correct path is different

// Import pages if needed elsewhere in layout
// import LoginPage from './login/page';
// import CreateNewPasswordPage from './createpassword/page';
// import OtpVerification from './otpverify/page';
// import ResetPasswordPage from './reset_password/page';
// import TermsAndConditions from './termandcondition/page';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const backgroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  const getResponsiveSize = (baseSize: number): number => {
    if (windowSize.width < 640) return baseSize * 0.7;
    if (windowSize.width < 1024) return baseSize * 0.85;
    return baseSize;
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-white dark:bg-black">
      {/* Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0 w-full h-full overflow-hidden"
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        {/* Animated orbs */}
        <div
          className="absolute rounded-full blur-3xl opacity-70 bg-gradient-to-r from-blue-400 to-indigo-500"
          style={{
            width: `${getResponsiveSize(40)}vw`,
            height: `${getResponsiveSize(40)}vw`,
            top: `calc(20% - ${mousePosition.y * getResponsiveSize(50)}px)`,
            left: `calc(20% - ${mousePosition.x * getResponsiveSize(50)}px)`,
            transform: "translate(-50%, -50%)",
            transition: "all 0.2s ease-out",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-60 bg-gradient-to-r from-purple-400 to-pink-500"
          style={{
            width: `${getResponsiveSize(35)}vw`,
            height: `${getResponsiveSize(35)}vw`,
            top: `calc(70% + ${mousePosition.y * getResponsiveSize(40)}px)`,
            right: `calc(30% + ${mousePosition.x * getResponsiveSize(40)}px)`,
            transform: "translate(50%, -50%)",
            transition: "all 0.3s ease-out",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-50 bg-gradient-to-r from-teal-300 to-cyan-500"
          style={{
            width: `${getResponsiveSize(25)}vw`,
            height: `${getResponsiveSize(25)}vw`,
            bottom: `calc(20% - ${mousePosition.y * getResponsiveSize(30)}px)`,
            left: `calc(60% - ${mousePosition.x * getResponsiveSize(30)}px)`,
            transition: "all 0.4s ease-out",
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(${
              isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
            } 1px, transparent 1px), 
                              linear-gradient(90deg, ${
                                isDarkMode
                                  ? "rgba(255, 255, 255, 0.03)"
                                  : "rgba(0, 0, 0, 0.03)"
                              } 1px, transparent 1px)`,
            backgroundSize: `${getResponsiveSize(20)}px ${getResponsiveSize(
              20
            )}px`,
            backgroundPosition: "center center",
          }}
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute right-4 top-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 focus:outline-none"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Moon className="text-white w-6 h-6" />
        ) : (
          <Sun className="text-black w-6 h-6" />
        )}
      </button>

      {/* Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-10 gap-8">
        {/* Left */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center text-center lg:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-2xl">
            <div className="space-y-2 md:space-y-4">
              <div className="flex flex-wrap justify-center lg:justify-start">
                <span
                  className={cn(
                    isDarkMode ? "text-white" : "text-black",
                    "hover:scale-105 transition-transform"
                  )}
                >
                  <TypeWriter
                    options={{
                      strings: [
                        "Showcase your advertisements",
                        "on your boards with ease",
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 100,
                      deleteSpeed: 50,
                      //   pauseFor: 2000,
                    }}
                  />
                </span>
              </div>
            </div>
          </h1>

          <motion.p
            className={cn(
              "mt-6 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0",
              isDarkMode ? "text-white/80" : "text-black/70"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Manage your digital signage content effortlessly with our powerful
            platform. Create, schedule, and deploy content across all your
            displays.
          </motion.p>
        </motion.div>

        {/* Right */}
        <div className="w-full lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
