import React, { useState } from "react";
import Link from "next/link";
import { NavigationItem } from "./SidebarNavigation";

interface NavItemProps {
  item: NavigationItem;
  isActive?: boolean;
  level?: number;
  onClick?: () => void;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  item,
  isActive = false,
  level = 0,
  onClick,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }

    if (onClick) {
      onClick();
    }
  };

  const baseClasses = `
    flex items-center justify-between w-full px-3 py-2 text-left rounded-md
    transition-colors duration-200 group
    ${level > 0 ? "ml-4 text-sm" : "text-base"}
    ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }
    ${className}
  `;

  const content = (
    <>
      <div className="flex items-center flex-1">
        {/* Icon */}
        {item.icon && (
          <item.icon
            className={`mr-3 h-5 w-5 ${
              isActive
                ? "text-blue-500"
                : "text-gray-400 group-hover:text-gray-500"
            }`}
          />
        )}

        {/* Label */}
        <span className="truncate">{item.label}</span>

        {/* Badge */}
        {item.badge && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {item.badge}
          </span>
        )}
      </div>

      {/* Expand/Collapse Icon */}
      {hasChildren && (
        <svg
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            isExpanded ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </>
  );

  return (
    <div>
      {/* Main Item */}
      {item.href && !hasChildren ? (
        <Link href={item.href} className={baseClasses} onClick={handleClick}>
          {content}
        </Link>
      ) : (
        <button className={baseClasses} onClick={handleClick}>
          {content}
        </button>
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              level={level + 1}
              isActive={isActive}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;
