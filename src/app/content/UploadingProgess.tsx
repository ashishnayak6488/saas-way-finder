import React, { useEffect, useState } from "react";

// Type definitions
interface UploadingProgressProps {
  progress: number;
  className?: string;
  size?: number;
  strokeWidth?: number;
  colors?: {
    background?: string;
    low?: string;
    medium?: string;
    high?: string;
  };
  animationSpeed?: number;
  showPercentage?: boolean;
}

const UploadingProgress: React.FC<UploadingProgressProps> = ({
  progress,
  className = "",
  size = 32,
  strokeWidth = 2.5,
  colors = {
    background: "#e5e7eb",
    low: "#3b82f6",
    medium: "#6366f1",
    high: "#8b5cf6",
  },
  animationSpeed = 20,
  showPercentage = true,
}) => {
  const [displayProgress, setDisplayProgress] = useState<number>(0);

  // Smoothly animate the progress value
  useEffect(() => {
    // If progress jumps too much, animate it smoothly
    if (progress > displayProgress + 10) {
      const interval = setInterval(() => {
        setDisplayProgress((prev) => {
          const next = prev + 1;
          if (next >= progress) {
            clearInterval(interval);
            return progress;
          }
          return next;
        });
      }, animationSpeed);

      return () => clearInterval(interval);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, displayProgress, animationSpeed]);

  // Calculate the circle's circumference based on size
  const radius = size * 0.375; // 12/32 = 0.375 ratio from original
  const circumference = 2 * Math.PI * radius;

  // Calculate the dash offset based on progress
  const strokeDashoffset =
    circumference - (displayProgress / 100) * circumference;

  // Determine color based on progress
  const getProgressColor = (): string => {
    if (displayProgress < 30) return colors.low || "#3b82f6"; // Blue
    if (displayProgress < 70) return colors.medium || "#6366f1"; // Indigo
    return colors.high || "#8b5cf6"; // Purple
  };

  const viewBoxSize = size;
  const center = size / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {/* Background circle */}
      <svg
        className="w-8 h-8"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        width={size}
        height={size}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.background}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle with animation */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            transition: "stroke-dashoffset 0.3s ease-in-out, stroke 0.5s ease",
          }}
        />
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <span
          className="absolute text-xs font-semibold"
          style={{ color: getProgressColor() }}
        >
          {Math.round(displayProgress)}%
        </span>
      )}
    </div>
  );
};

// Simple version that maintains exact original functionality
const UploadingProgressSimple: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const [displayProgress, setDisplayProgress] = useState<number>(0);

  // Smoothly animate the progress value
  useEffect(() => {
    // If progress jumps too much, animate it smoothly
    if (progress > displayProgress + 10) {
      const interval = setInterval(() => {
        setDisplayProgress((prev) => {
          const next = prev + 1;
          if (next >= progress) {
            clearInterval(interval);
            return progress;
          }
          return next;
        });
      }, 20);

      return () => clearInterval(interval);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, displayProgress]);

  // Calculate the circle's circumference
  const radius = 12;
  const circumference = 2 * Math.PI * radius;

  // Calculate the dash offset based on progress
  const strokeDashoffset =
    circumference - (displayProgress / 100) * circumference;

  // Determine color based on progress
  const getProgressColor = (): string => {
    if (displayProgress < 30) return "#3b82f6"; // Blue
    if (displayProgress < 70) return "#6366f1"; // Indigo
    return "#8b5cf6"; // Purple
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Background circle */}
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Progress circle with animation */}
        <circle
          cx="16"
          cy="16"
          r={radius}
          stroke={getProgressColor()}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 16 16)"
          style={{
            transition: "stroke-dashoffset 0.3s ease-in-out, stroke 0.5s ease",
          }}
        />
      </svg>

      {/* Percentage text */}
      <span
        className="absolute text-xs font-semibold"
        style={{ color: getProgressColor() }}
      >
        {Math.round(displayProgress)}%
      </span>
    </div>
  );
};

// Export the simple version to maintain exact compatibility (note: fixed typo in original filename)
export default UploadingProgressSimple;

// Also export the enhanced version if needed
export { UploadingProgress as UploadingProgressEnhanced };
