"use client";

import { toast } from "react-hot-toast";
import {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeClosed, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth, AuthContextType } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { scaleUp } from "@/lib/animations";

// Define form data type
interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

// Define errors type
interface FormErrors {
  username?: string;
  password?: string;
  api?: string;
}

// LoginPage component with TypeScript
const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { login, isAuthenticated } = useAuth() as AuthContextType;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    rememberMe: false,
  });

  // Load saved credentials if "Remember Me" was checked previously
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");

    if (savedUsername && savedPassword) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername,
        password: savedPassword,
        rememberMe: true,
      }));
    }
  }, []);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { id, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      }));
      if (id === "username" || id === "password") {
        if (errors[id as keyof FormErrors]) {
          setErrors((prev) => ({ ...prev, [id]: "" }));
        }
      }
    },
    [errors]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    const loadingToast = toast.loading("Logging in...");

    try {
      const result = await login({
        username: formData.username,
        password: formData.password,
      });

      if (result.success) {
        // Store in localStorage if "Remember Me" is checked
        if (formData.rememberMe) {
          localStorage.setItem("username", formData.username);
          localStorage.setItem("password", formData.password);
        } else {
          // Clear saved credentials if "Remember Me" is unchecked
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }

        toast.success("Welcome!", { id: loadingToast });
        // Router will handle redirect based on user role
      } else {
        toast.error(result.error || "Login failed", { id: loadingToast });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      toast.error(errorMessage, { id: loadingToast });
      setErrors({ api: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto bg-gray-200 bg-blured-400 bg-opacity-20 rounded-lg shadow-md p-6 sm:p-8 border border-white rounded-sm"
      {...scaleUp}
    >
      <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4 group">
          <Input
            label="Username"
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            error={errors.username}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4 group relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="**********"
            error={errors.password}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 top-4 z-10"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="outline-none h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <span className="ml-2 text-gray-700 text-sm">Remember Me</span>
          </label>
          <Link href="/forgot-password" className="text-indigo-600 text-sm">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          fullWidth={true}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </motion.div>
  );
};
export default LoginPage;
