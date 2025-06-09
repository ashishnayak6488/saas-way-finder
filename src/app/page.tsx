"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, AuthContextType } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

// Page component with TypeScript
const Page: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading } =
    useAuth() as AuthContextType;

  useEffect(() => {
    // Only redirect when auth check is complete
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking auth status
  return <LoadingSpinner />;
};
export default Page;
