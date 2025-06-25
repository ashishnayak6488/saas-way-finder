import React, { useState, useEffect } from "react";
import { Mail, Phone, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

// Define the props interface for the OtpVerification component
interface OtpVerificationProps {
  type?: "email" | "phone"; // 'email' or 'phone'
  value?: string; // email address or phone number
  phoneCountryCode?: string; // country code for phone (only used when type is 'phone')
  onVerified?: () => void; // callback when verification is successful
  onCancel?: () => void; // callback when user cancels verification
  isOptional?: boolean; // whether this verification is optional
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  type = "email",
  value = "",
  phoneCountryCode = "",
  onVerified = () => {},
  onCancel = () => {},
  isOptional = false,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [isGeneratingOtp, setIsGeneratingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (remainingTime > 0) {
      timer = setTimeout(() => setRemainingTime((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer as NodeJS.Timeout);
  }, [remainingTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleGenerateOtp = async (): Promise<void> => {
    if (!value) {
      setError(`Please enter a valid ${type}`);
      return;
    }

    setIsGeneratingOtp(true);
    setError("");
    const toastId = toast.loading(`Sending OTP to your ${type}...`);

    try {
      const endpoint =
        type === "email"
          ? "/api/otp_handling/send_email_otp"
          : "/api/otp_handling/send_phone_otp";

      const payload =
        type === "email"
          ? { email: value }
          : { phone_number: value, phone_country_code: phoneCountryCode };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to send OTP to ${type}`);
      }

      toast.success(`OTP sent to your ${type}`, { id: toastId });
      setVerificationStep(true);
      setRemainingTime(300); // 5 minutes countdown
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to send OTP to ${type}`;
      setError(errorMessage);
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handleVerifyOtp = async (): Promise<void> => {

    debugger;
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setIsVerifyingOtp(true);
    setError("");

    console.log("Verifying OTP for", value, "with OTP", otp, "and type", type);

    try {
      const response = await fetch("/api/otp_handling/verify_otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: value,
          otp: otp,
          type: type,
        }),
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      onVerified();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify OTP";
      setError(errorMessage);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {type === "email" ? (
            <Mail className="h-5 w-5 text-blue-500 mr-2" />
          ) : (
            <Phone className="h-5 w-5 text-blue-500 mr-2" />
          )}
          <h3 className="text-md font-medium">
            {type === "email" ? "Email Verification" : "Phone Verification"}
            {isOptional && (
              <span className="text-sm text-gray-500 ml-2">(Optional)</span>
            )}
          </h3>
        </div>

        {isOptional && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
          >
            Skip
          </Button>
        )}
      </div>

      {!verificationStep ? (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {type === "email"
              ? "We need to verify your email address. Click the button below to receive a verification code."
              : "We need to verify your phone number. Click the button below to receive a verification code."}
          </p>
          <div className="flex items-center">
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isGeneratingOtp || !value}
              onClick={handleGenerateOtp}
              className="flex items-center"
            >
              {isGeneratingOtp
                ? "Sending..."
                : `Send OTP to ${type === "email" ? "Email" : "Phone"}`}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            {`We've sent a verification code to your ${type}. Please enter it below.`}
          </p>

          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setOtp(e.target.value);
                setError("");
              }}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isVerifyingOtp || !otp}
                onClick={handleVerifyOtp}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>

              {remainingTime > 0 ? (
                <span className="text-sm text-gray-500">
                  Resend in {formatTime(remainingTime)}
                </span>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isGeneratingOtp}
                  onClick={handleGenerateOtp}
                  className="flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Resend OTP
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtpVerification;
