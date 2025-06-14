import React from 'react';

// Type definition for component props (if needed in the future)
interface CheckMarkProps {
    className?: string;
    size?: number;
    color?: string;
}

const CheckMark: React.FC<CheckMarkProps> = ({ 
    className = "", 
    size = 32, 
    color = "#10b981" 
}) => {
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            {/* Circle */}
            <svg className="w-8 h-8" viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={size * 0.375} // 12/32 = 0.375 ratio from original
                    stroke={color}
                    strokeWidth="2.5"
                    fill="none"
                />

                {/* Checkmark */}
                <path
                    d={`M${size * 0.3125} ${size * 0.515625}l${size * 0.125} ${size * 0.125} ${size * 0.25}-${size * 0.25}`}
                    stroke={color}
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

// Alternative simpler version that maintains the exact original functionality
const CheckMarkSimple: React.FC = () => {
    return (
        <div className="relative inline-flex items-center justify-center">
            {/* Circle */}
            <svg className="w-8 h-8" viewBox="0 0 32 32">
                <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    fill="none"
                />

                {/* Checkmark */}
                <path
                    d="M10 16.5l4 4 8-8"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

// Export the simple version to maintain exact compatibility
export default CheckMarkSimple;

// Also export the enhanced version if needed
export { CheckMark as CheckMarkEnhanced };
