"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import AddToPlaylistConfirmationModal from "./AddToPlaylistConfirmationModal";

// Type definitions
interface ContentItem {
  id: string;
  title: string;
  type: "image" | "video";
  thumbnail: string;
  dimensions: string;
}

interface PlaylistItem {
  id: string;
  name: string;
}

interface ApiResponse {
  status: string;
  data?: PlaylistItem[];
  message?: string;
}

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedPlaylistIds: string[]) => Promise<void>;
  selectedContents: ContentItem[];
  onRemoveContent: (contentId: string) => void;
}

const LoadingState: React.FC = () => (
  <div className="text-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
    <p className="mt-2">Loading playlists...</p>
  </div>
);

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedContents,
  onRemoveContent,
}) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [selectedPlaylistsData, setSelectedPlaylistsData] = useState<
    PlaylistItem[]
  >([]);

  // ✅ Stable fetch function using useCallback to fix ESLint exhaustive-deps
  const fetchPlaylists = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/playlist/getAllPlaylistNameAndId`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      if (!data || !data.data) {
        throw new Error("Invalid response format");
      }

      setPlaylists(data.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to fetch playlists: ${errorMessage}`);
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }

    return () => {
      setPlaylists([]);
      setSelectedPlaylists([]);
      setIsLoading(false);
    };
  }, [isOpen, fetchPlaylists]); // ✅ Dependency added

  const handlePlaylistSelect = (playlistId: string): void => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleSelectAll = (): void => {
    setSelectedPlaylists(
      selectedPlaylists.length === playlists.length
        ? []
        : playlists.map((p) => p.id)
    );
  };

  const handleSave = (): void => {
    if (selectedPlaylists.length === 0) {
      toast.error("Please select at least one playlist");
      return;
    }

    const selectedInfo = playlists.filter((p) =>
      selectedPlaylists.includes(p.id)
    );
    setSelectedPlaylistsData(selectedInfo);
    setShowConfirmation(true);
  };

  const handleConfirmAdd = async (): Promise<void> => {
    try {
      const loadingToast = toast.loading("Adding contents to playlists...");
      await onSave(selectedPlaylists);
      toast.success("Successfully added to playlists", { id: loadingToast });
      setSelectedPlaylists([]);
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to playlists");
    }
  };

  const handleRemovePlaylist = (playlistId: string): void => {
    setSelectedPlaylists((prev) => prev.filter((id) => id !== playlistId));
    setSelectedPlaylistsData((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const handleConfirmationClose = (): void => {
    setShowConfirmation(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col m-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Select Playlist
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Add Content to Playlist
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {playlists.length > 0 && (
            <div className="mb-4">
              <button
                onClick={handleSelectAll}
                className="bg-gray-700 px-6 py-3 rounded-lg text-white hover:bg-gray-800"
                type="button"
              >
                {selectedPlaylists.length === playlists.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          )}

          <div className="grid gap-4">
            {isLoading ? (
              <LoadingState />
            ) : playlists.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No playlists available
              </div>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center text-black justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <label
                    htmlFor={`playlist-${playlist.id}`}
                    className="flex-1 px-3 text-black cursor-pointer"
                  >
                    <p>{playlist.name}</p>
                  </label>
                  <input
                    type="checkbox"
                    id={`playlist-${playlist.id}`}
                    checked={selectedPlaylists.includes(playlist.id)}
                    onChange={() => handlePlaylistSelect(playlist.id)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))
            )}
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
              onClick={handleSave}
              disabled={selectedPlaylists.length === 0}
              className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                selectedPlaylists.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <AddToPlaylistConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmAdd}
        selectedContents={selectedContents}
        selectedPlaylists={selectedPlaylistsData}
        onRemoveContent={onRemoveContent}
        onRemovePlaylist={handleRemovePlaylist}
      />
    </div>
  );
};

export default PlaylistModal;
