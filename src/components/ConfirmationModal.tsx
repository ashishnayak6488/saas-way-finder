"use client";
import React from "react";
import { Button } from "@/components/ui/Button";

// Define props interface for the ConfirmationModal component
interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-[100vw] h-[100vh]">
      <div className="bg-white text-black rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            variant="secondary"
            aria-label="Cancel deletion"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            aria-label="Confirm deletion"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
