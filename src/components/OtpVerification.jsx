import React, { useState, useEffect } from 'react';
import { Mail, Phone, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import toast from "react-hot-toast";

const OtpVerification = ({
  type = 'email', // 'email' or 'phone'
  value = '', // email address or phone number
  phoneCountryCode = '', // country code for phone (only used when type is 'phone')
  onVerified = () => { }, // callback when verification is successful
  onCancel = () => { }, // callback when user cancels verification
  isOptional = false // whether this verification is optional
}) => {
  const [otp, setOtp] = useState('');
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setTimeout(() => setRemainingTime(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [remainingTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleGenerateOtp = async () => {
    if (!value) {
      setError(`Please enter a valid ${type}`);
      return;
    }

    setIsGeneratingOtp(true);
    setError('');
    const toastId = toast.loading(`Sending OTP to your ${type}...`);

    try {
      const endpoint = type === 'email'
        ? '/api/otp_handling/send_email_otp'
        : '/api/otp_handling/send_phone_otp';

      const payload = type === 'email'
        ? { email: value }
        : { phone_number: value, phone_country_code: phoneCountryCode };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to send OTP to ${type}`);
      }

      toast.success(`OTP sent to your ${type}`, { id: toastId });
      setVerificationStep(true);
      setRemainingTime(300); // 5 minutes countdown
    } catch (error) {
      // toast.error(error.message || `Failed to send OTP to ${type}`, { id: toastId });
      setError(error.message || `Failed to send OTP to ${type}`);
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsVerifyingOtp(true);
    setError('');
    // const toastId = toast.loading(`Verifying ${type} OTP...`);

    try {
      const response = await fetch('/api/otp_handling/verify_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // identifier: type === 'email' ? value : `${phoneCountryCode}${value}`,
          identifier: value,
          otp: otp,
          type: type
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // toast.success(`${type === 'email' ? 'Email' : 'Phone'} verified successfully`, { id: toastId });
      onVerified();
    } catch (error) {
      // toast.error(error.message || "Failed to verify OTP", { id: toastId });
      setError(error.message || "Failed to verify OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {type === 'email' ? (
            <Mail className="h-5 w-5 text-blue-500 mr-2" />
          ) : (
            <Phone className="h-5 w-5 text-blue-500 mr-2" />
          )}
          <h3 className="text-md font-medium">
            {type === 'email' ? 'Email Verification' : 'Phone Verification'}
            {isOptional && <span className="text-sm text-gray-500 ml-2">(Optional)</span>}
          </h3>
        </div>

        {isOptional && (
          <Button
            type="button"
            variant="ghost"
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
            {type === 'email'
              ? 'We need to verify your email address. Click the button below to receive a verification code.'
              : 'We need to verify your phone number. Click the button below to receive a verification code.'}
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
              {isGeneratingOtp ? 'Sending...' : `Send OTP to ${type === 'email' ? 'Email' : 'Phone'}`}
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
              onChange={(e) => {
                setOtp(e.target.value);
                setError('');
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
                {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
              </Button>

              {remainingTime > 0 ? (
                <span className="text-sm text-gray-500">
                  Resend in {formatTime(remainingTime)}
                </span>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
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