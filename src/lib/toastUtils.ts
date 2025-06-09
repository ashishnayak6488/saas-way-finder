import toast, { ToastOptions } from "react-hot-toast";

// Define toast options with TypeScript
const toastOptions: ToastOptions = {
  duration: 5000,
  position: "top-right",
  style: {
    padding: "16px",
    borderRadius: "8px",
  },
  // closeButton: false,
  // closeOnClick: true,
  // dismissible: true,
};

// Define types for promise messages
interface PromiseMessages {
  loading?: string;
  success?: string;
  error?: string;
}

// Define the showToast utility with typed methods
export const showToast = {
  success: (message: string): string => toast.success(message, toastOptions),
  error: (message: string): string => toast.error(message, toastOptions),
  loading: (message: string): string => toast.loading(message, toastOptions),
  promise: <T>(promise: Promise<T>, messages: PromiseMessages): Promise<T> => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || "Loading...",
        success: messages.success || "Success!",
        error: (err: Error) =>
          messages.error || err.message || "Error occurred",
      },
      toastOptions
    );
  },
};
