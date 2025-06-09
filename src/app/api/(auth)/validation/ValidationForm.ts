import { toast } from "react-hot-toast";

// Types
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof FormData, string>>;
}

// Main Form Validator
export const validateForm = (formData: FormData): ValidationResult => {
  const newErrors: Partial<Record<keyof FormData, string>> = {};

  // First Name
  const firstNameError = validateName(formData.firstName);
  if (firstNameError) {
    newErrors.firstName = firstNameError;
    toast.error(firstNameError);
  }

  // Last Name
  const lastNameError = validateName(formData.lastName);
  if (lastNameError) {
    newErrors.lastName = lastNameError;
    toast.error(lastNameError);
  }

  // Email
  if (!validateEmail(formData.email)) {
    const emailError = "Please enter a valid email";
    newErrors.email = emailError;
    toast.error(emailError);
  }

  // Password
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    newErrors.password = passwordError;
    toast.error(passwordError);
  }

  // Confirm Password
  if (formData.password !== formData.confirmPassword) {
    const confirmError = "Passwords do not match";
    newErrors.confirmPassword = confirmError;
    toast.error(confirmError);
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  const validations = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  if (!validations.length) return "Password must be at least 8 characters";
  if (!validations.lowercase) return "Password must contain a lowercase letter";
  if (!validations.uppercase)
    return "Password must contain an uppercase letter";
  if (!validations.number) return "Password must contain a number";
  if (!validations.special) return "Password must contain a special character";

  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validateCredentials = (
  username: string,
  password: string
): { username?: string; password?: string } => {
  const errors: { username?: string; password?: string } = {};

  if (!username?.trim()) {
    errors.username = "Username is required";
  }

  if (!password?.trim()) {
    errors.password = "Password is required";
  }

  return errors;
};
