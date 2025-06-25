import React from "react";
import DashboardSkeleton from "./DashboardSkeleton";

interface DashboardLoadingProps {
  message?: string;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ 
  message = "Loading dashboard..." 
}) => {
  return (
    <div className="relative">
      <DashboardSkeleton />
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white px-4 py-2 rounded-lg shadow-md border">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
