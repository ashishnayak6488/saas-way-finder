import React from 'react';
import { useRouter } from 'next/router';
import NavItem from './NavItem';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
}

interface SidebarNavigationProps {
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
}

// Example navigation items - customize based on your needs
const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    id: 'organizations',
    label: 'Organizations',
    href: '/dashboard/organizations',
  },
  {
    id: 'users',
    label: 'Users',
    href: '/dashboard/users',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    children: [
      {
        id: 'profile',
        label: 'Profile',
        href: '/dashboard/settings/profile',
      },
      {
        id: 'security',
        label: 'Security',
        href: '/dashboard/settings/security',
      },
    ],
  },
];

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  className = '',
  onItemClick 
}) => {
  const router = useRouter();

  const handleItemClick = (item: NavigationItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
    
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <nav className={`h-full flex flex-col bg-white ${className}`}>
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Dashboard
        </h1>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            // className="hover:bg-gray-100"
            isActive={router.pathname === item.href}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          © 2024 Your Company
        </div>
      </div>
    </nav>
  );
};

export default SidebarNavigation;
