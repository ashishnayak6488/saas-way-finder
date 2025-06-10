'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoadingSpinner() {
  const router = useRouter();

  const handleLogin = (): void => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white px-4">
      <motion.div
        className="relative flex items-center justify-center mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Digital signage frame */}
        <motion.div
          className="w-72 sm:w-80 md:w-96 h-48 sm:h-56 md:h-64 bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-800 relative"
          animate={{
            boxShadow: [
              "0px 0px 15px rgba(59, 130, 246, 0.6)",
              "0px 0px 25px rgba(59, 130, 246, 0.9)",
              "0px 0px 15px rgba(59, 130, 246, 0.6)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {/* Screen reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-10 z-10"></div>

          {/* Content animation */}
          <motion.div
            className="h-full w-full bg-gradient-to-r from-blue-600 to-purple-600"
            animate={{
              background: [
                "linear-gradient(to right, #2563eb, #7c3aed)",
                "linear-gradient(to right, #3b82f6, #8b5cf6)",
                "linear-gradient(to right, #60a5fa, #a78bfa)",
                "linear-gradient(to right, #3b82f6, #8b5cf6)",
                "linear-gradient(to right, #2563eb, #7c3aed)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            {/* Animated content elements */}
            <div className="relative h-full w-full p-4">
              {/* Header */}
              <motion.div
                className="absolute top-4 left-4 h-5 w-32 sm:w-40 bg-white rounded-full opacity-80"
                animate={{ width: ["30%", "50%", "30%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Content lines */}
              <motion.div
                className="absolute top-14 left-4 h-4 w-48 sm:w-56 bg-white rounded-full opacity-60"
                animate={{ width: ["40%", "70%", "40%"] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
              />

              <motion.div
                className="absolute top-22 left-4 h-4 w-40 sm:w-48 bg-white rounded-full opacity-50"
                animate={{ width: ["35%", "60%", "35%"] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
              />

              {/* Image placeholder */}
              <motion.div
                className="absolute bottom-4 right-4 h-20 w-20 sm:h-24 sm:w-24 bg-white rounded-lg opacity-70"
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <motion.div
                  className="absolute inset-3 bg-blue-500 rounded"
                  animate={{
                    background: [
                      "rgb(59, 130, 246)",
                      "rgb(99, 102, 241)",
                      "rgb(139, 92, 246)",
                      "rgb(99, 102, 241)",
                      "rgb(59, 130, 246)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>

              {/* Animated dots */}
              <div className="absolute bottom-4 left-4 flex space-x-2">
                {[0, 1, 2].map((i: number) => (
                  <motion.div
                    key={i}
                    className="h-3 w-3 bg-white rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Loading text with typewriter effect */}
      <motion.div
        className="text-blue-700 font-semibold text-xl mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.span
          className="inline-block"
          animate={{
            opacity: [0.7, 1, 0.7],
            y: [0, -3, 0],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading Digital Signage
        </motion.span>
        <motion.span
          className="inline-block"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          ...
        </motion.span>
      </motion.div>

      {/* Spinner with progress track */}
      <div className="relative mb-6">
        <div className="w-12 h-12 rounded-full border-2 border-blue-200"></div>
        <motion.div
          className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Login Button */}
      <motion.button
        onClick={handleLogin}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {/* Login to Dashboard */}
        please wait for digital signage to load
      </motion.button>
    </div>
  );
}
