import React, { JSX } from "react";
import { ChevronRight } from "lucide-react";
import { NavItem, ThemeColor, UserRole } from "./dashboardConfig";

// Interface for component props
interface SidebarNavigationProps {
  navItems: NavItem[];
  downNavItems: NavItem[];
  isCollapsed: boolean;
  themeColor: ThemeColor;
  activeComponent: string;
  handleComponentChange: (componentId: string) => void;
  userRole: UserRole;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  navItems,
  downNavItems,
  isCollapsed,
  themeColor,
  activeComponent,
  handleComponentChange,
  userRole,
}) => {
  // Render navigation items with proper typing
  const renderNavItems = (items: NavItem[]): JSX.Element => (
    <ul className="space-y-3 md:space-y-2">
      {items.map((item, index) => (
        <li key={`${item.id}-${index}`}>
          <div
            onClick={() =>
              item.onClick ? item.onClick() : handleComponentChange(item.id)
            }
            className={`flex items-center px-3 py-2 md:px-2 md:py-1 rounded-lg cursor-pointer justify-between
                        ${
                          themeColor.hoverBg
                        } hover:shadow-md transition-all duration-300
                        ${
                          activeComponent === item.id
                            ? themeColor.activeBg + " shadow-lg"
                            : ""
                        }`}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${item.text}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                item.onClick ? item.onClick() : handleComponentChange(item.id);
              }
            }}
          >
            <span
              className={`${themeColor.iconColor} p-3 md:p-2 bg-white rounded-full
                            ${themeColor.hoverIconColor} ${themeColor.hoverIconBg} hover:scale-110
                            transition-all duration-300 flex items-center justify-center`}
              aria-hidden="true"
            >
              {item.icon}
            </span>

            {!isCollapsed && (
              <>
                <span className="text-gray-700 font-medium pl-4 flex-grow hover:text-indigo-700 transition-colors duration-200">
                  {item.text}
                </span>
                <ChevronRight
                  className={`text-gray-500 ${themeColor.chevronHover} transition-colors duration-200 h-4 w-4`}
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  // Get section title based on user role
  const getMainSectionTitle = (userRole: UserRole): string => {
    switch (userRole) {
      case 1:
      case 4:
        return "System Control";
      case 2:
        return "Administration";
      case 3:
      default:
        return "SaaS Way-Finder";
    }
  };

  return (
    <div className="flex flex-col">
      {/* Main Navigation Section */}
      <div className="p-4 flex-1">
        <div
          className={`mb-4 ${
            !isCollapsed
              ? "pl-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              : "text-center"
          }`}
        >
          {!isCollapsed && getMainSectionTitle(userRole)}
        </div>
        {renderNavItems(navItems)}
      </div>

      {/* Support & Settings Section */}
      <div className="p-4 mt-auto border-t border-gray-100">
        <div
          className={`mb-4 ${
            !isCollapsed
              ? "pl-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              : "text-center"
          }`}
        >
          {!isCollapsed && "Support & Settings"}
        </div>
        {renderNavItems(downNavItems)}
      </div>
    </div>
  );
};

export default SidebarNavigation;
