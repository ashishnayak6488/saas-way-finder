"use client";

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

// Define props type for Button component (from previous Button.tsx)
// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?:
//     | "primary"
//     | "secondary"
//     | "success"
//     | "danger"
//     | "neutral"
//     | "outline";
//   className?: string;
// }

// Extend window interface to include countdownTimer
declare global {
  interface Window {
    countdownTimer?: NodeJS.Timeout;
  }
}

// EnterOTPPage component with TypeScript
const EnterOTPPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [countdown, setCountdown] = useState<number>(30);
  const [isResendEnabled, setIsResendEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));
  const router = useRouter();

  const validateOTP = (code: string): boolean => {
    return /^\d{6}$/.test(code);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      setError("");

      // Auto-focus next input
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all digits are filled
      if (index === 5 && value !== "") {
        const completeOTP = newCode.join("");
        if (validateOTP(completeOTP)) {
          handleVerification();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!verificationCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newCode = [...verificationCode];
      newCode[index] = "";
      setVerificationCode(newCode);
      e.preventDefault();
    }
  };

  const startCountdown = () => {
    if (window.countdownTimer) {
      clearInterval(window.countdownTimer);
    }

    window.countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(window.countdownTimer);
          setIsResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCountdown();
    return () => {
      if (window.countdownTimer) {
        clearInterval(window.countdownTimer);
      }
    };
  }, []);

  const handleVerification = async () => {
    const code = verificationCode.join("");
    if (!validateOTP(code)) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        throw new Error("Email not found. Please try again.");
      }

      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: code,
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      if (data.success) {
        localStorage.setItem("otpVerified", "true");
        router.push("/createpassword");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.";
      setError(errorMessage);
      setVerificationCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!isResendEnabled || isLoading) return;

    setIsLoading(true);
    setVerificationCode(["", "", "", "", "", ""]);
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        throw new Error("Email not found. Please try again.");
      }

      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      if (data.success) {
        setCountdown(30);
        setIsResendEnabled(false);
        startCountdown();
        setError("");
      } else {
        throw new Error(data.message || "Failed to resend OTP");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 sm:p-8 border">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Enter Verification Code
      </h2>
      <p className="text-gray-500 text-center mb-6">
        Please enter the 6-digit code sent to your email
      </p>

      {error && (
        <div className="mb-4 p-2 text-center text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-center space-x-2 mb-6">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              if (inputRefs.current) {
                inputRefs.current[index] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleCodeChange(index, e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(index, e)
            }
            className="w-10 h-12 text-center text-xl border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
            disabled={isLoading}
          />
        ))}{" "}
      </div>

      <Button
        onClick={handleVerification}
        className="w-full"
        variant="secondary"
        size="md"
        fullWidth={true}
        disabled={isLoading || !verificationCode.every((digit) => digit !== "")}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="text-center mt-4">
        {countdown > 0 ? (
          <p className="text-gray-500">Resend OTP in {countdown} seconds</p>
        ) : (
          <button
            onClick={handleResendOTP}
            disabled={!isResendEnabled || isLoading}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default EnterOTPPage;
