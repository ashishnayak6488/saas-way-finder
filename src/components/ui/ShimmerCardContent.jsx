import { motion } from "framer-motion";

const ShimmerCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border rounded-lg overflow-hidden flex flex-col card-hover transition-all duration-200 ease-in-out"
      style={{ height: "280px" }}
    >
      {/* Checkbox Area */}
      <div className="p-2">
        <div className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
      </div>

      {/* Media Container */}
      <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      </div>

      {/* Info Container */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <div className="w-[10vw] h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse mb-2" />
          <div className="mt-1 flex flex-col space-y-1">
            <div className="h-3 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
            <div className="h-3 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ShimmerCardContent = () => {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[...Array(12)].map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </motion.div>
  );
};

export default ShimmerCardContent;
