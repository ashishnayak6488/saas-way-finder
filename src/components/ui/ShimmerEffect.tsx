
import React from "react";

// Define props interface for ShimmerEffect (currently no props, but added for extensibility)
interface ShimmerEffectProps {}

// Define the ShimmerEffect component
const ShimmerEffect: React.FC<ShimmerEffectProps> = () => (
  <div className="w-full animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item: number) => (
        <div key={item} className="p-6 bg-white rounded-xl shadow-md border border-blue-100">
          {/* Title & Actions Shimmer */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-2/3 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" />
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" />
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((line: number) => (
              <div key={line} className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full" />
            ))}
          </div>

          {/* Status Badge */}
          <div className="mt-2 w-16 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export default ShimmerEffect;
