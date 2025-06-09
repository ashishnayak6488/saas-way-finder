"use client";

import { useEffect, useState, ReactNode } from "react";

// Define props type for ClientWrapper
interface ClientWrapperProps {
  children: ReactNode;
}

// ClientWrapper component with TypeScript
const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return children;
};

export default ClientWrapper;
