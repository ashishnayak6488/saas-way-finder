'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/src/theme/ThemeProvider';
import { Button } from '@/src/components/ui/Button';

// Define the shape of the ThemeContext for type safety
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// ThemeToggle component with TypeScript
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme() as ThemeContextType;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;