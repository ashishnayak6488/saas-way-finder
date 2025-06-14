"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Search,
  Upload,
  Trash2,
  ListPlus,
  SquareMousePointer,
  SquareDashedMousePointer,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
// import PlayListImage from "@/src/images/playlistImage.jpg";
import PlaylistModal from "./AddToPlaylistModal";
import AddContent from "./AddContent";
import MediaViewer from "@/components/MediaViewer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import ConfirmationModal from "@/components/ConfirmationModal";
import toast from "react-hot-toast";
import VideoPlayer from "@/components/VideoPlayer";
import { withProgressTracking } from "@/utils/uploadUtils";

// Use default import instead
import ShimmerCardContent from "@/components/ui/ShimmerCardContent";

// Type definitions
interface ContentItem {
  id: string;
  type: "image" | "video";
  title: string;
  thumbnail: string;
  time: number;
  dimensions: string;
  dateAdded: string;
  size: number;
}

interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
  time: string;
  dimensions: string;
}

interface TypeOption {
  value: string;
  label: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface MediaData {
  url: string;
  type: "image" | "video";
  title: string;
}

interface ApiResponse {
  data?: {
    results?: Array<{
      status: string;
      content_id: string;
      content_type: string;
      name?: string;
      filename?: string;
      content_path?: string;
      length?: number;
      resolution?: string;
      datetime?: number;
      size?: number;
    }>;
  };
  status?: string;
  message?: string;
}

interface ContentApiItem {
  content_id: string;
  content_type: string;
  name?: string;
  content_path?: string;
  length?: number;
  resolution?: string;
  datetime?: number;
  size?: number;
}

interface GetAllContentsResponse {
  data?: ContentApiItem[];
  detail?: string;
}

const TypeOptions: TypeOption[] = [
  { value: "all", label: "All Type" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
];

const SortOptions: SortOption[] = [
  { value: "name_asc", label: "Sort by name (↑)" },
  { value: "name_desc", label: "Sort by name (↓)" },
  { value: "date_asc", label: "Sort by date (↑)" },
  { value: "date_desc", label: "Sort by date (↓)" },
  { value: "size_asc", label: "Sort by size (↑)" },
  { value: "size_desc", label: "Sort by size (↓)" },
];

const ContentManagementPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [history, setHistory] = useState<ContentItem[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [isUploading, setIsUploading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("name"); // 'name', 'date', 'size'
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // 'asc' or 'desc'
  const [selectedType, setSelectedType] = useState<string>("all"); // 'all', 'image', 'video'
  const [sortOption, setSortOption] = useState<string>("name_asc");

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);

  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add this function to handle content removal
  const didFetchContent = useRef<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);

  const handleMediaClick = (item: ContentItem): void => {
    setSelectedMedia({
      url: item.thumbnail,
      type: item.type,
      title: item.title,
    });
  };

  const getAllContents = async (): Promise<GetAllContentsResponse> => {
    try {
      const response = await fetch(`/api/content/getAllContents`);
      const data: GetAllContentsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch contents");
      }

      return data;
    } catch (error) {
      throw new Error("Failed to fetch contents");
    }
  };

  const fetchContents = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const responseData = await getAllContents();
      const contents = responseData?.data || [];

      const formattedContent: ContentItem[] = contents.map((item) => ({
        id: item.content_id,
        type: item.content_type?.startsWith("image") ? "image" : "video",
        title: item.name || "Untitled",
        thumbnail: item.content_path || "",
        time: item.length || 0,
        dimensions: item.resolution || "",
        dateAdded: item.datetime
          ? new Date(item.datetime * 1000).toISOString()
          : new Date().toISOString(),
        size: item.size || 0,
      }));

      setContentItems(formattedContent);
    } catch (error) {
      setError("Failed to fetch contents");
      // console.error('Error fetching contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (didFetchContent.current) return;
    fetchContents();
    didFetchContent.current = true;
  }, []);

  const createContents = async (
    files: FileData[],
    descriptions: string | null = null,
    metadata: any = null,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<ApiResponse> => {
    try {
      // If we have a progress callback, use the withProgressTracking utility
      if (typeof onProgress === "function") {
        return await withProgressTracking(null, "default", files, onProgress);
      }

      // Otherwise, use the standard upload method
      // Create FormData to send files as multipart
      const formData = new FormData();

      // Add each file to the FormData
      for (const fileData of files) {
        formData.append("files", fileData.file);

        // Add metadata as separate fields
        formData.append(
          "metadata",
          JSON.stringify({
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            length: parseFloat(fileData.time),
            resolution: fileData.dimensions,
            description: descriptions || null,
            metadata: metadata || null,
          })
        );
      }

      // Optional: Add folder parameter if needed
      formData.append("folder", "content");

      // Send to backend
      const backendResponse = await fetch(`/api/content/createContents`, {
        method: "POST",
        body: formData, // Send as FormData instead of JSON
        credentials: "include",
      });

      const data: ApiResponse = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(data.message || "Failed to upload contents to backend");
      }

      return data;
    } catch (error) {
      console.error("Error in createContents:", error);
      throw error;
    }
  };

  const handleAddContent = async (
    playlistId: string,
    files: FileData[],
    progressCallback?: (fileIndex: number, progress: number) => void
  ): Promise<ApiResponse | false> => {
    const loadingToast = toast.loading("Uploading...");
    try {
      // Create a function to handle progress updates
      const handleProgress =
        progressCallback ||
        ((fileIndex: number, progress: number) => {
          console.log(`File ${fileIndex} progress: ${progress}%`);
        });

      // Use the createContents function with progress tracking
      const response = await createContents(files, null, null, handleProgress);

      if (response && response.data && response.data.results) {
        const successCount = response.data.results.filter(
          (r) => r.status === "success"
        ).length;

        const newContents: ContentItem[] = response.data.results
          .filter((r) => r.status === "success")
          .map((item) => ({
            id: item.content_id,
            type: item.content_type?.startsWith("image") ? "image" : "video",
            title: item.name || item.filename || "Untitled",
            thumbnail: item.content_path || "",
            time: item.length || 0,
            dimensions: item.resolution || "",
            dateAdded: item.datetime
              ? new Date(item.datetime * 1000).toISOString()
              : new Date().toISOString(),
            size: item.size || 0,
          }));

        // Update state directly with new content at the beginning
        setContentItems((prevItems) => [...newContents, ...prevItems]);

        toast.success(`Successfully uploaded ${successCount} files`, {
          id: loadingToast,
        });
        setIsModalOpen(false);
        return response;
      }
      return false;
    } catch (error) {
      console.error("Error uploading contents:", error);
      toast.error((error as Error).message || "Upload failed", {
        id: loadingToast,
      });
      throw error;
    }
  };

  // useEffect(() => {
  //   if (history.length === 0) {
  //     setHistory([contentItems]);
  //   }
  // }, [contentItems, history.length]);

  const handleStateChange = (newItems: ContentItem[]): void => {
    setContentItems(newItems);
  };

  // Selection handlers
  const handleSelectAll = (): void => {
    const displayedItemIds = displayedItems.map((item) => item.id);
    if (selectedItems.length === displayedItemIds.length) {
      setSelectedItems((prev) =>
        prev.filter((id) => !displayedItemIds.includes(id))
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        ...displayedItemIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleSelect = (id: string): void => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDeleteItems = (): void => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async (): Promise<void> => {
    try {
      const itemsToDelete = [...selectedItems];

      // Optimistically update UI
      setContentItems((prev) =>
        prev.filter((item) => !itemsToDelete.includes(item.id))
      );
      setSelectedItems([]);

      const response = await deleteContents(itemsToDelete);

      if (response.status === "success") {
        toast.success(`Successfully deleted ${itemsToDelete.length} items`);
      } else {
        // If deletion fails, revert the changes
        const originalContents = await getAllContents();
        if (originalContents.data) {
          const formattedContent: ContentItem[] = originalContents.data.map(
            (item) => ({
              id: item.content_id,
              type: item.content_type?.startsWith("image") ? "image" : "video",
              title: item.name || "Untitled",
              thumbnail: item.content_path || "",
              time: item.length || 0,
              dimensions: item.resolution || "",
              dateAdded: item.datetime
                ? new Date(item.datetime * 1000).toISOString()
                : new Date().toISOString(),
              size: item.size || 0,
            })
          );
          setContentItems(formattedContent);
        }
        throw new Error("Failed to delete contents");
      }
    } catch (error) {
      toast.error("Failed to delete contents");
      // Refresh content if needed
      try {
        const originalContents = await getAllContents();
        if (originalContents.data) {
          const formattedContent: ContentItem[] = originalContents.data.map(
            (item) => ({
              id: item.content_id,
              type: item.content_type?.startsWith("image") ? "image" : "video",
              title: item.name || "Untitled",
              thumbnail: item.content_path || "",
              time: item.length || 0,
              dimensions: item.resolution || "",
              dateAdded: item.datetime
                ? new Date(item.datetime * 1000).toISOString()
                : new Date().toISOString(),
              size: item.size || 0,
            })
          );
          setContentItems(formattedContent);
        }
      } catch (refreshError) {
        console.error("Failed to refresh content:", refreshError);
      }
    }
    setShowDeleteConfirmation(false);
  };

  const deleteContents = async (
    contentIds: string[]
  ): Promise<{ status: string; [key: string]: any }> => {
    try {
      setShowDeleteConfirmation(false);
      const response = await fetch(`/api/content/deleteContents`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contentIds),
        credentials: "include",
      });

      const data = await response.json();

      if (
        data.results &&
        data.results.every((r: any) => r.status === "success")
      ) {
        return { status: "success", ...data };
      } else {
        throw new Error(data.message || "Failed to delete some contents");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleAddPlaylist = (): void => {
    const selectedContentData = contentItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    setIsPlaylistModalOpen(true);
  };

  const getSelectedContentsData = (): ContentItem[] => {
    return contentItems.filter((item) => selectedItems.includes(item.id));
  };

  const handleRemoveContent = (contentId: string): void => {
    setSelectedItems((prev) => prev.filter((id) => id !== contentId));
  };

  const addContentsToPlaylists = async (
    contentIds: string[],
    playlistIds: string[]
  ): Promise<any> => {
    try {
      const response = await fetch("/api/content/addContentsToPlaylists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_ids: contentIds,
          playlist_ids: playlistIds,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add contents to playlists");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSaveToPlaylists = async (
    selectedPlaylistIds: string[]
  ): Promise<void> => {
    try {
      // Only proceed if there are still contents selected
      if (selectedItems.length === 0) {
        toast.error("No contents selected");
        setIsPlaylistModalOpen(false);
        return;
      }

      const loadingToast = toast.loading("Adding contents to playlists...");

      const response = await addContentsToPlaylists(
        selectedItems,
        selectedPlaylistIds
      );

      if (response.status === "success") {
        toast.success("Contents added to playlists successfully", {
          id: loadingToast,
        });
        setSelectedItems([]); // Clear selection after successful addition
      } else {
        toast.error("Failed to add contents to playlists", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error adding contents to playlists:", error);
      toast.error("Failed to add contents to playlists");
    } finally {
      setIsPlaylistModalOpen(false);
    }
  };

  const getFilteredAndSortedItems = (): ContentItem[] => {
    let filtered = contentItems;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Apply sorting
    const [sortBy, sortOrder] = sortOption.split("_");
    return filtered.sort((a, b) => {
      let compareValue: number;
      switch (sortBy) {
        case "name":
          compareValue = a.title.localeCompare(b.title);
          break;
        case "date":
          compareValue =
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case "size":
          compareValue = a.size - b.size;
          break;
        default:
          compareValue = 0;
      }
      return sortOrder === "asc" ? compareValue : -compareValue;
    });
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
  };

  const handleSortChange = (value: string): void => {
    setSortOption(value);
  };

  // Handle sort order change
  const toggleSortOrder = (): void => {
    setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
  };

  // Get filtered and sorted items
  const displayedItems = getFilteredAndSortedItems();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pb-8 pl-3">
        <div className="mx-auto min-h-[60vh]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl text-black font-semibold font-serif">
                Content
              </h1>
              <p className="text-gray-600 text-sm">
                Upload Images in .jpg .png & videos in .mp4
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>

            {isModalOpen && (
              <AddContent
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddContent}
                onSuccess={fetchContents} // Add this prop
                playlistId="default"
              />
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 pb-4 w-full sticky top-0 z-10 background-filter-10px">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name..."
              />
            </div>

            {/* Filters Container */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Type, Sort, and Arrow Container - Single row on all screens */}
              <div className="grid grid-cols-2 gap-3">
                <Select value={selectedType} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex justify-start items-center gap-2 sm:gap-4">
              {contentItems.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1 rounded-lg bg-green-50 hover:bg-green-100 transition-colors flex items-center gap-2"
                  onClick={() => {
                    if (selectedItems.length === contentItems.length) {
                      // Deselect all
                      setSelectedItems([]);
                    } else {
                      // Select all
                      setSelectedItems(contentItems.map((item) => item.id));
                    }
                  }}
                  title={
                    selectedItems.length === contentItems.length
                      ? "Deselect all"
                      : "Select all"
                  }
                >
                  {selectedItems.length === contentItems.length ? (
                    <>
                      <SquareDashedMousePointer />
                    </>
                  ) : (
                    <>
                      <SquareMousePointer />
                    </>
                  )}
                </motion.button>
              )}

              {selectedItems.length > 0 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-2"
                    onClick={handleDeleteItems}
                    title="Delete Selected"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-2"
                    onClick={handleAddPlaylist}
                    title="Add to playlist"
                  >
                    <ListPlus size={18} className="text-blue-500" />
                  </motion.button>
                  {isPlaylistModalOpen && (
                    <PlaylistModal
                      isOpen={isPlaylistModalOpen}
                      onClose={() => setIsPlaylistModalOpen(false)}
                      onSave={handleSaveToPlaylists}
                      selectedContents={getSelectedContentsData()}
                      onRemoveContent={handleRemoveContent}
                    />
                  )}
                </>
              )}
              {/* Add this before the closing div of your component */}
              {showDeleteConfirmation && (
                <ConfirmationModal
                  onClose={() => setShowDeleteConfirmation(false)}
                  onConfirm={confirmDelete}
                  message={`Are you sure you want to delete ${
                    selectedItems.length
                  } ${
                    selectedItems.length === 1
                      ? "selected item"
                      : "selected items"
                  }?`}
                />
              )}
            </div>
          </div>

          {/* Content Grid */}
          {isLoading ? (
            <ShimmerCardContent />
          ) : (
            <>
              {displayedItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  {searchTerm ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md border border-blue-100"
                    >
                      <div className="w-16 h-16 mb-4 text-gray-400">
                        <Search size={64} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No content Found
                      </h3>
                      <p className="text-gray-600 text-center">
                        No content found matching "{searchTerm}". Try different
                        keywords.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                        }}
                        variant="primary"
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <p className="text-lg font-medium text-gray-700">
                        No Content Available
                      </p>
                      <p className="text-sm text-gray-500">
                        Upload your first content to get started
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Upload Content
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {displayedItems.map((item, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      key={item.id}
                      className="bg-white border rounded-lg overflow-hidden flex flex-col card-hover transition-all duration-200 ease-in-out hover:shadow-lg"
                      style={{ height: "280px" }} // Fixed height for cards
                    >
                      {/* Checkbox and Selection Area */}
                      <div className="p-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelect(item.id)}
                        />
                      </div>

                      {/* Media Container */}
                      <div
                        className="relative w-full h-48 flex items-center justify-center overflow-hidden bg-gray-100"
                        onClick={() => handleMediaClick(item)}
                      >
                        {item.type === "video" ? (
                          <div className="relative w-full h-full">
                            <VideoPlayer
                              src={item.thumbnail}
                              type={item.type}
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="max-w-full max-h-full w-auto h-auto object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>

                      {/* Info Container */}
                      <div className="p-3 flex flex-col justify-between flex-grow">
                        <div>
                          <p className="w-[10vw] text-sm font-medium text-gray-900">
                            {item.title}
                          </p>
                          <div className="mt-1 flex flex-col space-y-1">
                            <span className="text-xs text-gray-500">
                              Dimensions: {item.dimensions}
                            </span>
                            <span className="text-xs text-gray-500">
                              Size:{" "}
                              {typeof item.size === "number"
                                ? formatFileSize(item.size)
                                : item.size}
                            </span>
                            <span className="text-xs text-gray-500">
                              Added:{" "}
                              {new Date(item.dateAdded).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}{" "}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      <MediaViewer
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        mediaUrl={selectedMedia?.url}
        mediaType={selectedMedia?.type}
        title={selectedMedia?.title}
      />
    </div>
  );
};

export default ContentManagementPage;
