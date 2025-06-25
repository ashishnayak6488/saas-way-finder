// "use client";

// import React, { useState, useEffect, ReactNode } from "react";
// import Image from "next/image";
// import { ChevronsLeft, ChevronsRight, Menu, X } from "lucide-react";
// import Logo from "@/app/logo.jpg";
// import SidebarNavigation from "./SidebarNavigation";
// import {
//   getNavItems,
//   getDownNavItems,
//   getThemeColor,
//   getDashboardTitle,
//   UserRole,
//   ThemeColor,
//   NavItem,
// } from "./dashboardConfig";

// // Types and Interfaces
// interface DashboardLayoutProps {
//   userRole: UserRole;
//   activeComponent: string;
//   handleComponentChange: (componentId: string) => void;
//   handleLogout: () => void;
//   children: ReactNode;
// }

// interface LogoResponse {
//   logo_url?: string;
// }

// const DashboardLayout: React.FC<DashboardLayoutProps> = ({
//   userRole,
//   activeComponent,
//   handleComponentChange,
//   handleLogout,
//   children,
// }) => {
//   // State management with proper types
//   const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
//   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
//   const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);
//   const [logo, setLogo] = useState<string | null>(null);

//   // Handle responsive behavior
//   useEffect(() => {
//     const handleResize = (): void => {
//       const width = window.innerWidth;
//       setIsLargeScreen(width >= 1024);

//       // Auto-collapse sidebar on medium screens
//       if (width < 1280 && width >= 1024) {
//         setIsCollapsed(true);
//       } else if (width >= 1280) {
//         setIsCollapsed(false);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch logo with proper error handling
//   useEffect(() => {
//     const getLogo = async (): Promise<void> => {
//       try {
//         const response = await fetch("/api/logo/getLogo");
//         if (!response.ok) {
//           console.error("Failed to fetch logo:", response.status);
//           return;
//         }

//         const data: LogoResponse = await response.json();
//         if (data && data.logo_url) {
//           setLogo(data.logo_url);
//         }
//       } catch (error) {
//         console.error("Error fetching logo:", error);
//       }
//     };

//     // Set default logo first
//     setLogo(typeof Logo === "string" ? Logo : Logo.src);
//     getLogo();
//   }, []);
//   // Handle image error with proper typing
//   const handleImageError = (
//     e: React.SyntheticEvent<HTMLImageElement, Event>
//   ): void => {
//     const target = e.target as HTMLImageElement;
//     const parentElement = target.parentElement;

//     if (parentElement) {
//       // Hide the image
//       target.style.display = "none";

//       // Add classes to parent div
//       parentElement.classList.add(
//         "flex",
//         "items-center",
//         "justify-center",
//         "bg-blue-100"
//       );

//       // Create and append the initials text
//       const initialsElement = document.createElement("span");
//       initialsElement.className = "text-blue-600 font-medium text-sm";
//       initialsElement.textContent = "SWF"; // SaaS Way-Finder initials
//       parentElement.appendChild(initialsElement);
//     }
//   };

//   // Get configuration based on user role
//   const navItems: NavItem[] = getNavItems(userRole);
//   const downNavItems: NavItem[] = getDownNavItems(handleLogout);
//   const themeColor: ThemeColor = getThemeColor(userRole);
//   const dashboardTitle: string = getDashboardTitle(userRole);

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
//       {/* Mobile Menu Button */}
//       <div className="lg:hidden fixed left-4 z-50 pt-2">
//         <button
//           onClick={() => setSidebarOpen(!isSidebarOpen)}
//           className={`p-2 bg-white rounded-md shadow-md transition-all duration-300 top-4
//                     ${isSidebarOpen ? "fixed left-52" : "left-4"}`}
//           aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
//         >
//           {isSidebarOpen ? (
//             <X className="text-blue-500 h-5 w-5" />
//           ) : (
//             <Menu className="text-blue-500 h-5 w-5" />
//           )}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:static transition-all duration-300 z-40 h-screen overflow-y-auto bg-white shadow-lg
//                 ${isSidebarOpen ? "left-0" : "-left-full"}
//                 ${isCollapsed ? "w-22" : "w-64"}
//                 lg:left-0`}
//       >
//         {/* Sidebar Header */}
//         <div className="sticky top-0 z-10 p-3 md:p-4 bg-white border-b border-gray-200">
//           {!isCollapsed ? (
//             <div className="flex flex-row items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-white p-0 rounded-full shadow-sm">
//                   <Image
//                     src={logo || Logo}
//                     alt="SaaS Way-Finder Logo"
//                     className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover bg-white"
//                     width={40}
//                     height={40}
//                     priority
//                     unoptimized={!!logo}
//                     onError={handleImageError}
//                   />
//                 </div>
//                 <span className="text-base sm:text-xl font-bold text-black xs:block">
//                   {dashboardTitle}
//                 </span>
//               </div>
//               {isLargeScreen && (
//                 <button
//                   onClick={() => setIsCollapsed(!isCollapsed)}
//                   className="p-1.5 hover:bg-blue-50 rounded-full text-blue-500 transition-all duration-300 flex items-center justify-center"
//                   aria-label="Collapse sidebar"
//                 >
//                   <ChevronsLeft className="h-5 w-5" />
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center">
//               <div className="bg-white p-1 rounded-full shadow-sm mb-2">
//                 <Image
//                   src={logo || Logo}
//                   alt="SaaS Way-Finder Logo"
//                   className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
//                   width={32}
//                   height={32}
//                   priority
//                   unoptimized={!!logo}
//                   onError={handleImageError}
//                 />
//               </div>
//               {isLargeScreen && (
//                 <button
//                   onClick={() => setIsCollapsed(!isCollapsed)}
//                   className="p-1.5 hover:bg-blue-50 rounded-full text-blue-500 transition-all duration-300 flex items-center justify-center"
//                   aria-label="Expand sidebar"
//                 >
//                   <ChevronsRight className="h-5 w-5" />
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Sidebar Navigation */}
//         <SidebarNavigation
//           navItems={navItems}
//           downNavItems={downNavItems}
//           isCollapsed={isCollapsed}
//           themeColor={themeColor}
//           activeComponent={activeComponent}
//           handleComponentChange={handleComponentChange}
//           userRole={userRole}
//         />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 h-screen overflow-y-auto">
//         <div className="p-6">{children}</div>
//       </main>

//       {/* Mobile Overlay */}
//       {isSidebarOpen && !isLargeScreen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setSidebarOpen(false)}
//           aria-label="Close sidebar overlay"
//         />
//       )}
//     </div>
//   );
// };

// export default DashboardLayout;



"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { ChevronsLeft, ChevronsRight, Menu, X } from "lucide-react";
import Logo from "@/app/logo.jpg";
import SidebarNavigation from "./SidebarNavigation";
import {
  getNavItems,
  getDownNavItems,
  getThemeColor,
  getDashboardTitle,
  UserRole,
  ThemeColor,
  NavItem,
} from "./dashboardConfig";

// Types and Interfaces
interface DashboardLayoutProps {
  userRole: UserRole | undefined;
  activeComponent: string;
  handleComponentChange: (componentId: string) => void;
  handleLogout: () => void;
  children: ReactNode;
}

interface LogoResponse {
  logo_url?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userRole,
  activeComponent,
  handleComponentChange,
  handleLogout,
  children,
}) => {
  // State management with proper types
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);
  const [logo, setLogo] = useState<string | null>(null);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = (): void => {
      const width = window.innerWidth;
      setIsLargeScreen(width >= 1024);

      // Auto-collapse sidebar on medium screens
      if (width < 1280 && width >= 1024) {
        setIsCollapsed(true);
      } else if (width >= 1280) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch logo with proper error handling
  useEffect(() => {
    const getLogo = async (): Promise<void> => {
      try {
        const response = await fetch("/api/logo/getLogo");
        if (!response.ok) {
          console.error("Failed to fetch logo:", response.status);
          return;
        }

        const data: LogoResponse = await response.json();
        if (data && data.logo_url) {
          setLogo(data.logo_url);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    // Set default logo first
    setLogo(typeof Logo === "string" ? Logo : Logo.src);
    getLogo();
  }, []);

  // Handle image error with proper typing
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ): void => {
    const target = e.target as HTMLImageElement;
    const parentElement = target.parentElement;

    if (parentElement) {
      // Hide the image
      target.style.display = "none";

      // Add classes to parent div
      parentElement.classList.add(
        "flex",
        "items-center",
        "justify-center",
        "bg-blue-100"
      );

      // Create and append the initials text
      const initialsElement = document.createElement("span");
      initialsElement.className = "text-blue-600 font-medium text-sm";
      initialsElement.textContent = "SWF"; // SaaS Way-Finder initials
      parentElement.appendChild(initialsElement);
    }
  };

  // Get configuration based on user role
  const navItems: NavItem[] = getNavItems(userRole);
  const downNavItems: NavItem[] = getDownNavItems(handleLogout);
  const themeColor: ThemeColor = getThemeColor(userRole);
  const dashboardTitle: string = getDashboardTitle(userRole);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed left-4 z-50 pt-2">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={`p-2 bg-white rounded-md shadow-md transition-all duration-300 top-4
                    ${isSidebarOpen ? "fixed left-52" : "left-4"}`}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <X className="text-blue-500 h-5 w-5" />
          ) : (
            <Menu className="text-blue-500 h-5 w-5" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static transition-all duration-300 z-40 h-screen overflow-y-auto bg-white shadow-lg
                ${isSidebarOpen ? "left-0" : "-left-full"}
                ${isCollapsed ? "w-22" : "w-64"}
                lg:left-0`}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 z-10 p-3 md:p-4 bg-white border-b border-gray-200">
          {!isCollapsed ? (
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-0 rounded-full shadow-sm">
                  <Image
                    src={logo || Logo}
                    alt="SaaS Way-Finder Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover bg-white"
                    width={40}
                    height={40}
                    priority
                    unoptimized={!!logo}
                    onError={handleImageError}
                  />
                </div>
                <span className="text-base sm:text-xl font-bold text-black xs:block">
                  {dashboardTitle}
                </span>
              </div>
              {isLargeScreen && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1.5 hover:bg-blue-50 rounded-full text-blue-500 transition-all duration-300 flex items-center justify-center"
                  aria-label="Collapse sidebar"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-1 rounded-full shadow-sm mb-2">
                <Image
                  src={logo || Logo}
                  alt="SaaS Way-Finder Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                  width={32}
                  height={32}
                  priority
                  unoptimized={!!logo}
                  onError={handleImageError}
                />
              </div>
              {isLargeScreen && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1.5 hover:bg-blue-50 rounded-full text-blue-500 transition-all duration-300 flex items-center justify-center"
                  aria-label="Expand sidebar"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <SidebarNavigation
          navItems={navItems}
          downNavItems={downNavItems}
          isCollapsed={isCollapsed}
          themeColor={themeColor}
          activeComponent={activeComponent}
          handleComponentChange={handleComponentChange}
          userRole={userRole}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && !isLargeScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
