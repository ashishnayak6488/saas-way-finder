import { Button } from "@/src/components/ui/Button";
import React from "react";

const ConfirmationModal = ({ onClose, onConfirm, message }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-[100vw] h-[100vh] -left-4">
            <div className="bg-white text-black rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p>{message}</p>
                <div className="flex justify-end space-x-3 mt-4">
                    <Button onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="danger">
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;