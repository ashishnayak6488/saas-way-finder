"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, MessageCircle, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
    const [countdown, setCountdown] = useState<number>(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        window.location.href = "/";
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex flex-col items-center justify-center px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-4"
                >
                    404
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-blue-700 mb-6"
                >
                    Page Not Found
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg text-gray-600 mb-8"
                >
                    The page you are looking for doesn't exist or has been moved.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="space-y-4"
                >
                    <div className="relative">
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
                            />
                        </div>
                        <p className="text-gray-500 mt-2">
                            Redirecting to home in {countdown} seconds...
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Dashboard
                            </motion.button>
                        </Link>

                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-transparent border-2 border-blue-400 text-blue-700 font-medium rounded-lg hover:border-blue-600 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={18} />
                                Contact Support
                            </motion.button>
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-8 text-gray-500"
                    >
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center mx-auto gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Go Back to Previous Page
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i: number) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-blue-100/20"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, Math.random() * -100 - 50],
                            opacity: [0, 0.3, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: Math.random() * 10 + 10,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            {/* xPi Digital Signage Logo */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-4 left-0 right-0 text-center"
            >
                <p className="text-gray-400 text-sm">
                    xPi Digital Signage
                </p>
            </motion.div>
        </div>
    );
};

export default NotFound;
