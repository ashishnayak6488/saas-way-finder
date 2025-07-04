import { Button } from "@/components/ui/Button";
import React from "react";

/**
 * Props interface for LogoutConfirmationModal component
 */
interface LogoutConfirmationModalProps {
  /** Function to call when canceling logout */
  onClose: () => void;
  /** Function to call when confirming logout */
  onConfirm: () => void;
  /** Custom message to display in the modal */
  message?: string;
}

/**
 * LogoutConfirmationModal - A modal dialog to confirm user logout
 * 
 * @param {LogoutConfirmationModalProps} props - Component props
 * @returns {JSX.Element} Logout confirmation modal
 */
const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
    onClose,
    onConfirm,
    message = "Are you sure you want to log out?"
}) => {
    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle escape key press
    React.useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-full"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-description"
        >
            <div className="bg-white text-black rounded-xl p-6 w-full max-w-md shadow-lg">
                <h2 
                    id="logout-modal-title"
                    className="text-xl font-bold mb-4"
                >
                    Confirm Logout
                </h2>
                <p 
                    id="logout-modal-description"
                    className="text-gray-700 mb-6"
                >
                    {message}
                </p>
                <div className="flex justify-end space-x-3 mt-4">
                    <Button 
                        onClick={onClose} 
                        variant="secondary" 
                        className="px-4 py-2"
                        type="button"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="danger"
                        type="button"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationModal;
