"use client"

import React, { useEffect, useState } from 'react'

// Type definitions
interface ScrollToTopProps {
    className?: string;
    threshold?: number;
    offset?: {
        bottom?: string;
        right?: string;
    };
    buttonStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({
    className = "",
    threshold = 300,
    offset = { bottom: "2rem", right: "2rem" },
    buttonStyle,
    children
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const toggleVisibility = (): void => {
            if (window.pageYOffset > threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Add event listener
        window.addEventListener("scroll", toggleVisibility);
        
        // Cleanup function to remove event listener
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [threshold]);

    const scrollToTop = (): void => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        scrollToTop();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            scrollToTop();
        }
    };

    const defaultStyle: React.CSSProperties = {
        bottom: offset.bottom || "2rem",
        right: offset.right || "2rem",
    };

    const combinedStyle = buttonStyle ? { ...defaultStyle, ...buttonStyle } : defaultStyle;

    return (
        <>
            {isVisible && (
                <button
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    className={`fixed bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
                    style={combinedStyle}
                    type="button"
                    aria-label="Scroll to top"
                    title="Scroll to top"
                >
                    {children || "↑"}
                </button>
            )}
        </>
    );
};

// Simple version that maintains exact original functionality
const ScrollToTopSimple: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const toggleVisibility = (): void => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = (): void => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                    type="button"
                >
                    ↑
                </button>
            )}
        </>
    );
};

// Export the simple version to maintain exact compatibility
export default ScrollToTopSimple;

// Also export the enhanced version if needed
export { ScrollToTop as ScrollToTopEnhanced };
