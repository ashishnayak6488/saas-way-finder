import React, { memo } from "react";
import { ChevronRight } from "lucide-react";
import { NavItem as NavItemType, ThemeColor } from "./dashboardConfig";

// Interface for NavItem component props
interface NavItemProps {
  item: NavItemType;
  isCollapsed: boolean;
  themeColor: ThemeColor;
  isActive: boolean;
  onClick: (itemId: string) => void;
}

// Tooltip component for collapsed state
interface TooltipProps {
  text: string;
  children: React.ReactNode;
  show: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, show }) => (
  <div className="relative group">
    {children}
    {show && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
        {text}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
      </div>
    )}
  </div>
);

const NavItem: React.FC<NavItemProps> = memo(
  ({ item, isCollapsed, themeColor, isActive, onClick }) => {
    // Handle click events
    const handleClick = (): void => {
      if (item.onClick) {
        item.onClick();
      } else {
        onClick(item.id);
      }
    };

    // Handle keyboard events for accessibility
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };

    const navItemContent = (
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`flex items-center px-3 py-2 md:px-2 md:py-1 rounded-lg cursor-pointer justify-between
            ${themeColor.hoverBg} hover:shadow-md transition-all duration-300
            ${
              isActive
                ? themeColor.activeBg + " shadow-lg border-l-4 border-blue-500"
                : ""
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        role="button"
        tabIndex={0}
        aria-label={`Navigate to ${item.text}`}
        aria-pressed={isActive}
      >
        {/* Icon */}
        <span
          className={`${themeColor.iconColor} p-3 md:p-2 bg-white rounded-full
                ${themeColor.hoverIconColor} ${themeColor.hoverIconBg} hover:scale-110
                transition-all duration-300 flex items-center justify-center min-w-[2.5rem] min-h-[2.5rem]`}
          aria-hidden="true"
        >
          {item.icon}
        </span>

        {/* Text and chevron (only when not collapsed) */}
        {!isCollapsed && (
          <div>
            <span className="text-gray-700 font-medium pl-4 flex-grow hover:text-indigo-700 transition-colors duration-200 truncate">
              {item.text}
            </span>

            {/* Badge (if exists) */}
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {item.badge}
              </span>
            )}

            <ChevronRight
              className={`text-gray-500 ${themeColor.chevronHover} transition-colors duration-200 h-4 w-4 ml-2 flex-shrink-0`}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    );

    // Wrap with tooltip when collapsed
    if (isCollapsed) {
      return (
        <Tooltip text={item.text} show={true}>
          {navItemContent}
        </Tooltip>
      );
    }

    return navItemContent;
  }
);

NavItem.displayName = "NavItem";

export default NavItem;
