import React from "react";

// Interface for skeleton item props
interface SkeletonItemProps {
  className?: string;
  "data-testid"?: string;
}

// Reusable skeleton item component
const SkeletonItem: React.FC<SkeletonItemProps> = ({
  className = "",
  "data-testid": testId,
}) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    data-testid={testId}
    aria-hidden="true"
  />
);

// Interface for dashboard skeleton props
interface DashboardSkeletonProps {
  showSidebar?: boolean;
  itemCount?: number;
  showHeader?: boolean;
  className?: string;
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  showSidebar = true,
  itemCount = 6,
  showHeader = true,
  className = "",
}) => {
  // Generate array for skeleton items
  const skeletonItems = Array.from({ length: itemCount }, (_, index) => index);
  const sidebarItems = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen bg-gray-50 ${className}`}
      role="status"
      aria-label="Loading dashboard content"
    >
      {/* Sidebar skeleton */}
      {showSidebar && (
        <div className="w-64 bg-white h-screen shadow-lg">
          {/* Sidebar header skeleton */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <SkeletonItem
                className="w-10 h-10 rounded-full"
                data-testid="sidebar-logo-skeleton"
              />
              <SkeletonItem
                className="h-6 w-32"
                data-testid="sidebar-title-skeleton"
              />
            </div>
          </div>

          {/* Main navigation skeleton */}
          <div className="p-4">
            <SkeletonItem
              className="h-3 w-20 mb-4"
              data-testid="nav-section-title-skeleton"
            />
            <div className="space-y-3">
              {sidebarItems.slice(0, 5).map((index) => (
                <div
                  key={`main-nav-${index}`}
                  className="flex items-center space-x-3"
                >
                  <SkeletonItem
                    className="w-10 h-10 rounded-full"
                    data-testid={`nav-icon-skeleton-${index}`}
                  />
                  <SkeletonItem
                    className="h-4 w-24"
                    data-testid={`nav-text-skeleton-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom navigation skeleton */}
          <div className="p-4 mt-auto border-t border-gray-100">
            <SkeletonItem
              className="h-3 w-24 mb-4"
              data-testid="bottom-nav-section-title-skeleton"
            />
            <div className="space-y-3">
              {sidebarItems.slice(5, 8).map((index) => (
                <div
                  key={`bottom-nav-${index}`}
                  className="flex items-center space-x-3"
                >
                  <SkeletonItem
                    className="w-10 h-10 rounded-full"
                    data-testid={`bottom-nav-icon-skeleton-${index}`}
                  />
                  <SkeletonItem
                    className="h-4 w-20"
                    data-testid={`bottom-nav-text-skeleton-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content skeleton */}
      <div className="flex-1 p-6">
        {/* Header skeleton */}
        {showHeader && (
          <div className="mb-6">
            <SkeletonItem
              className="h-8 w-64 mb-2"
              data-testid="page-title-skeleton"
            />
            <SkeletonItem
              className="h-4 w-96"
              data-testid="page-subtitle-skeleton"
            />
          </div>
        )}

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonItems.map((index) => (
            <div
              key={`content-card-${index}`}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="animate-pulse">
                <SkeletonItem
                  className="h-6 w-3/4 mb-4"
                  data-testid={`card-title-skeleton-${index}`}
                />
                <SkeletonItem
                  className="h-4 w-full mb-2"
                  data-testid={`card-line1-skeleton-${index}`}
                />
                <SkeletonItem
                  className="h-4 w-5/6 mb-2"
                  data-testid={`card-line2-skeleton-${index}`}
                />
                <SkeletonItem
                  className="h-4 w-4/6 mb-4"
                  data-testid={`card-line3-skeleton-${index}`}
                />
                <SkeletonItem
                  className="h-10 w-24"
                  data-testid={`card-button-skeleton-${index}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Additional loading indicators */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
