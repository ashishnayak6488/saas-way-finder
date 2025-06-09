import { Button } from "@/src/components/ui/Button";
import React from "react";

/**
 * LogoutConfirmationModal - A modal dialog to confirm user logout
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when canceling logout
 * @param {Function} props.onConfirm - Function to call when confirming logout
 * @param {string} [props.message="Are you sure you want to log out?"] - Custom message to display
 * @returns {JSX.Element} Logout confirmation modal
 */
const LogoutConfirmationModal = ({
    onClose,
    onConfirm,
    message = "Are you sure you want to log out?"
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-full">
            <div className="bg-white text-black rounded-xl p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3 mt-4">
                    <Button onClick={onClose} variant="secondary" className="px-4 py-2">
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
