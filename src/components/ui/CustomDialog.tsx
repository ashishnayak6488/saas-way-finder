"use client";

import { Dialog } from "@headlessui/react";
import React from "react";

// Define props interface for the CustomDialog component
interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function CustomDialog({ isOpen, onClose, children }: CustomDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-4">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
