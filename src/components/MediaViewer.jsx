import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const MediaViewer = ({ isOpen, onClose, mediaUrl, mediaType, title }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="relative max-w-[90vw] max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {mediaType === "video" ? (
                        <video
                            src={mediaUrl}
                            controls
                            autoPlay
                            className="max-w-full max-h-[90vh] rounded-lg"
                        />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt={title}
                            className="max-w-full max-h-[90vh] rounded-lg object-contain"
                        />
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MediaViewer;
