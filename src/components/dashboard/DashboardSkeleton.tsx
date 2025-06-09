import React from 'react';

interface SkeletonItemProps {
  className?: string;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

interface DashboardSkeletonProps {
  showSidebar?: boolean;
  itemCount?: number;
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ 
  showSidebar = true,
  itemCount = 6 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Skeleton */}
        {showSidebar && (
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg p-4">
            <div className="space-y-4">
              {/* Logo skeleton */}
              <SkeletonItem className="h-8 w-32" />
              
              {/* Navigation items skeleton */}
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonItem key={index} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Main content skeleton */}
        <div className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
          <div className="p-6">
            {/* Header skeleton */}
            <div className="mb-6">
              <SkeletonItem className="h-8 w-48 mb-2" />
              <SkeletonItem className="h-4 w-96" />
            </div>
            
            {/* Content grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: itemCount }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <SkeletonItem className="h-6 w-3/4 mb-4" />
                  <SkeletonItem className="h-4 w-full mb-2" />
                  <SkeletonItem className="h-4 w-2/3 mb-4" />
                  <SkeletonItem className="h-10 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
