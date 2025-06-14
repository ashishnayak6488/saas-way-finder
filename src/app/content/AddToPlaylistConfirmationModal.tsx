// AddToPlaylistConfirmationModal.tsx
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Play, X } from 'lucide-react'; // Import X icon from lucide-react

// Type definitions
interface ContentItem {
    id: string;
    title: string;
    type: 'image' | 'video';
    thumbnail: string;
    dimensions: string;
}

interface PlaylistItem {
    id: string;
    name: string;
}

interface LoadingStates {
    [key: string]: boolean;
}

interface AddToPlaylistConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedContents: ContentItem[];
    selectedPlaylists: PlaylistItem[];
    onRemoveContent: (contentId: string) => void;
    onRemovePlaylist: (playlistId: string) => void;
}

interface VideoPlayerProps {
    src: string;
    type: string;
}

const AddToPlaylistConfirmationModal: React.FC<AddToPlaylistConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    selectedContents,
    selectedPlaylists,
    onRemoveContent,
    onRemovePlaylist
}) => {
    if (!isOpen) return null;

    const canProceed = selectedContents.length > 0 && selectedPlaylists.length > 0;

    const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
    
    const handleContentRemove = async (contentId: string): Promise<void> => {
        setLoadingStates(prev => ({ ...prev, [contentId]: true }));

        // Simulate loading for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        onRemoveContent(contentId);
        setLoadingStates(prev => ({ ...prev, [contentId]: false }));

        if (selectedContents.length <= 1) {
            onClose();
        }
    };

    const handlePlaylistRemove = async (playlistId: string): Promise<void> => {
        setLoadingStates(prev => ({ ...prev, [playlistId]: true }));

        // Simulate loading for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        onRemovePlaylist(playlistId);
        setLoadingStates(prev => ({ ...prev, [playlistId]: false }));

        if (selectedPlaylists.length <= 1) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col m-4">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Confirm Addition
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Review contents and playlists before adding
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Selected Contents Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                            Selected Contents ({selectedContents.length})
                        </h3>
                        <div className="space-y-2">
                            {selectedContents.map((content) => (
                                <div key={content.id}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className="w-10 h-10 relative">
                                            {
                                                content.type === 'video' ? (
                                                    <VideoPlayer src={content.thumbnail} type={content.type} />
                                                ) : (
                                                    <img
                                                        src={content.thumbnail}
                                                        alt={content.title}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                )
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-500">{content.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {content.type} • {content.dimensions}
                                            </p>
                                        </div>
                                    </div>
                                    {loadingStates[content.id] ? (
                                        <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                    ) : (
                                        <button
                                            onClick={() => handleContentRemove(content.id)}
                                            className="text-red-500 hover:text-red-700 transition-opacity duration-200"
                                            type="button"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Playlists Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Target Playlists</h3>
                        <div className="space-y-2">
                            {selectedPlaylists.map((playlist) => (
                                <div key={playlist.id}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                    <span className="flex-1 text-gray-500">{playlist.name}</span>
                                    {loadingStates[playlist.id] ? (
                                        <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                    ) : (
                                        <button
                                            onClick={() => handlePlaylistRemove(playlist.id)}
                                            className="text-red-500 hover:text-red-700 transition-opacity duration-200"
                                            type="button"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t p-6">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={!canProceed}
                            className={`px-6 py-3 bg-blue-500 text-white rounded-lg 
                                ${canProceed ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`}
                            type="button"
                        >
                            Confirm ({selectedContents.length} contents to {selectedPlaylists.length} playlists)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Remove PropTypes since we're using TypeScript interfaces
// AddToPlaylistConfirmationModal.propTypes = {
//     isOpen: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
//     onConfirm: PropTypes.func.isRequired,
//     selectedContents: PropTypes.array.isRequired,
//     selectedPlaylists: PropTypes.array.isRequired,
//     onRemoveContent: PropTypes.func.isRequired,
//     onRemovePlaylist: PropTypes.func.isRequired,
// };

export default AddToPlaylistConfirmationModal;

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, type }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlayPause = (e: React.MouseEvent<HTMLVideoElement | HTMLButtonElement>): void => {
        e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleVideoEnded = (): void => {
        setIsPlaying(false);
    };

    const handleVideoPause = (): void => {
        setIsPlaying(false);
    };

    const handleVideoPlay = (): void => {
        setIsPlaying(true);
    };

    return (
        <div className="relative flex item-center justify-center w-full h-full">
            <video
                ref={videoRef}
                src={src}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
                muted
                playsInline
                onClick={handlePlayPause}
                onEnded={handleVideoEnded}
                onPause={handleVideoPause}
                onPlay={handleVideoPlay}
            >
                <source src={src} type={type} />
                Your browser does not support the video tag.
            </video>
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-opacity duration-200"
                        onClick={handlePlayPause}
                        type="button"
                    >
                        <Play className="w-6 h-6 text-white" />
                    </button>
                </div>
            )}
        </div>
    );
};
