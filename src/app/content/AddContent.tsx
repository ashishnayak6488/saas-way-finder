"use client";

import { CircleCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
// import ProgessAndCheck from "./UploadingProgess";
import CheckMark from "./CheckMark";
import UploadingProgess from "./UploadingProgess";
import { withProgressTracking } from "@/utils/uploadUtils";
import toast from "react-hot-toast";

// Type definitions
interface FileData {
  name: string;
  size: string;
  type: string;
  dimensions: string;
  file: File;
  time: string;
  dateAdded: string;
}

interface FormData {
  files: FileData[];
  acceptedTerms: boolean;
}

interface Errors {
  files: string;
  acceptedTerms: string;
}

interface Preview {
  type: "image" | "video";
  url: string;
  name: string;
}

interface UploadStatus {
  progress: number;
  completed: boolean;
}

interface UploadingStatusMap {
  [key: number]: UploadStatus;
}

interface Dimensions {
  width: number;
  height: number;
}

interface UploadResult {
  status: string;
  content_id?: string;
  id?: string;
  content_type?: string;
  type?: string;
  name?: string;
  filename?: string;
  content_path?: string;
  url?: string;
  length?: number;
  duration?: number;
  resolution?: string;
  dimensions?: string;
  datetime?: number;
  size?: number;
}

interface ApiResponse {
  data?: {
    results?: UploadResult[];
  };
  results?: UploadResult[];
  status?: string;
}

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

interface AddContentProps {
  onClose: () => void;
  onAdd: (
    playlistId: string,
    files: FileData[],
    progressCallback?: (fileIndex: number, progress: number) => void
  ) => Promise<ApiResponse>;
  onSuccess?: (newContents?: ContentItem[]) => Promise<void>;
  playlistId: string;
}

const AddContent: React.FC<AddContentProps> = ({
  onClose,
  onAdd,
  // onSuccess,
  // playlistId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    files: [],
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<Errors>({
    files: "",
    acceptedTerms: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [showCheckmark, setShowCheckmark] = useState<boolean>(false);
  const [uploadingStatus, setUploadingStatus] = useState<UploadingStatusMap>(
    {}
  );
  // const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const shouldShowTerms = formData.files.length > 0;
  const canSubmit = formData.files.length > 0 && formData.acceptedTerms;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getImageDimensions = (file: File): Promise<Dimensions> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const getVideoDimensions = (file: File): Promise<Dimensions> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
        });
      };
      video.src = URL.createObjectURL(file);
    });
  };

  // Helper function to get video duration
  const getVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        resolve(`${duration}s`);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleAddFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setErrors({ files: "", acceptedTerms: "" });

    // const validFiles: FileData[] = [];
    const filePromises: Promise<{ fileData: FileData; preview: Preview }>[] =
      [];

    for (const file of newFiles) {
      const error = validateFile(file);
      if (!error) {
        filePromises.push(
          (async (): Promise<{ fileData: FileData; preview: Preview }> => {
            let dimensions: Dimensions = { width: 0, height: 0 };
            let duration = "10s"; // Default duration for images

            try {
              if (file.type.startsWith("image/")) {
                dimensions = await getImageDimensions(file);
              } else if (file.type.startsWith("video/")) {
                dimensions = await getVideoDimensions(file);
                duration = await getVideoDuration(file);
              }
            } catch (err) {
              console.error("Error getting dimensions or duration:", err);
            }

            const fileData: FileData = {
              name: file.name,
              size: formatFileSize(file.size),
              type: file.type,
              dimensions: `${dimensions.width} x ${dimensions.height}`,
              file: file,
              time: duration, // Now uses actual video duration or default 10s for images
              dateAdded: new Date().toISOString(),
            };

            let preview: Preview;
            if (file.type.startsWith("image/")) {
              preview = await new Promise<Preview>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  resolve({
                    type: "image",
                    url: e.target?.result as string,
                    name: file.name,
                  });
                };
                reader.readAsDataURL(file);
              });
            } else if (file.type.startsWith("video/")) {
              preview = {
                type: "video",
                url: URL.createObjectURL(file),
                name: file.name,
              };
            } else {
              // Fallback preview
              preview = {
                type: "image",
                url: "",
                name: file.name,
              };
            }

            return { fileData, preview };
          })()
        );
      } else {
        setErrors((prev) => ({ ...prev, files: error }));
      }
    }

    try {
      const results = await Promise.all(filePromises);
      const newValidFiles = results.map((result) => result.fileData);
      const newPreviews = results.map((result) => result.preview);

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newValidFiles],
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error("Error processing files:", error);
      setErrors((prev) => ({ ...prev, files: "Error processing files" }));
    }
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!file) {
      return "No file provided";
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type ${
        file.type
      } is not allowed. Allowed types: ${allowedTypes.join(", ")}`;
    }

    if (file.size > maxSize) {
      return `File size (${(file.size / 1024 / 1024).toFixed(
        2
      )}MB) exceeds limit of 500MB`;
    }

    return null;
  };

  const removeFile = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (): Promise<void> => {
    if (formData.files.length === 0) {
      setErrors((prev) => ({
        ...prev,
        files: "Please select at least one file",
      }));
      return;
    }

    try {
      setIsSubmitting(true);

      // Initialize upload status for each file
      const initialStatus: UploadingStatusMap = {};
      formData.files.forEach((_, index) => {
        initialStatus[index] = { progress: 0, completed: false };
      });
      setUploadingStatus(initialStatus);

      // Progress tracking callback
      const handleProgress = (fileIndex: number, progress: number): void => {
        setUploadingStatus((prev) => ({
          ...prev,
          [fileIndex]: {
            progress,
            completed: progress === 100,
          },
        }));
      };

      // Use the provided onAdd function with progress tracking
      let result: ApiResponse | undefined;
      try {
        if (typeof onAdd === "function") {
          result = await onAdd("default", formData.files, handleProgress);
        } else {
          result = await withProgressTracking(
            onAdd,
            "default",
            formData.files,
            handleProgress
          );
        }

        if (!result) {
          throw new Error("No response received from upload");
        }

        // Check if the result has the expected structure
        console.log("Upload result:", result); // Add this for debugging

        // More flexible response structure checking
        let successfulUploads: UploadResult[] = [];

        // Check different possible response structures
        if (result && result.data && result.data.results) {
          // Structure: result.data.results[]
          successfulUploads = result.data.results.filter(
            (r) => r.status === "success"
          );
        } else if (result && result.results) {
          // Structure: result.results[]
          successfulUploads = result.results.filter(
            (r) => r.status === "success"
          );
        } else if (result && Array.isArray(result)) {
          // Structure: result[]
          successfulUploads = (result as UploadResult[]).filter(
            (r) => r.status === "success"
          );
        } else if (result && result.status === "success") {
          // Structure: single result object
          successfulUploads = [result as UploadResult];
        }

        if (successfulUploads.length > 0) {
          // Format the uploaded files data - with more flexible field mapping
          // const newContents: ContentItem[] = successfulUploads.map((item) => ({
          //   id: item.content_id || item.id || "",
          //   type: (item.content_type || item.type || "")?.startsWith("image")
          //     ? "image"
          //     : "video",
          //   title: item.name || item.filename || "Untitled",
          //   thumbnail: item.content_path || item.url || "",
          //   time: item.length || item.duration || 0,
          //   dimensions: item.resolution || item.dimensions || "",
          //   dateAdded: item.datetime
          //     ? new Date(
          //         typeof item.datetime === "number"
          //           ? item.datetime * 1000
          //           : item.datetime
          //       ).toISOString()
          //     : new Date().toISOString(),
          //   size: item.size || 0,
          // }));

          // Show overall success checkmark
          setShowCheckmark(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setShowCheckmark(false);

          onClose();
        } else {
          throw new Error("No files were uploaded successfully");
        }
      } catch (uploadError) {
        console.error("Upload processing error:", uploadError);
        console.error("Response data:", result); // Log the full response for debugging
        toast.error((uploadError as Error).message || "Upload failed");
        setErrors((prev) => ({
          ...prev,
          files:
            (uploadError as Error).message ||
            "Error adding files. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Upload failed");
      setErrors((prev) => ({
        ...prev,
        files: "Error adding files. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    return () => {
      // Cleanup previews when component unmounts
      previews.forEach((preview) => {
        if (preview.type === "video") {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({
      ...prev,
      acceptedTerms: e.target.checked,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col m-4">
        {showCheckmark && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-10">
            <CircleCheckBig className="h-24 w-24 text-blue-900" />
          </div>
        )}
        {/* Header */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Add Content</h2>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!shouldShowTerms && !showCheckmark && (
            <h1 className="flex justify-center items-center">
              You can Add new Content from Here!
            </h1>
          )}

          {/* Files Grid with Enhanced Information */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            {formData.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-lg p-3 bg-white"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    {previews[index]?.type === "image" ? (
                      <Image
                        src={previews[index].url}
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                    ) : previews[index]?.type === "video" ? (
                      <video
                        src={previews[index].url}
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                    ) : null}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {file.name}
                      </p>
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs text-gray-500">
                          Type: {file.type.split("/")[1].toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {file.size}
                        </p>
                        <p className="text-xs text-gray-500">
                          Dimensions: {file.dimensions}
                        </p>
                        <p className="text-xs text-gray-500">
                          length: {file.time}
                        </p>
                      </div>
                    </div>

                    <div className="ml-2">
                      {uploadingStatus[index] ? (
                        uploadingStatus[index].completed ? (
                          <CheckMark />
                        ) : (
                          <UploadingProgess
                            progress={uploadingStatus[index].progress}
                          />
                        )
                      ) : (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.files && (
            <p className="text-red-500 text-sm mb-4">{errors.files}</p>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="p-4 md:p-6">
          {shouldShowTerms && (
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptedTerms}
                onChange={handleTermsChange}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree with the{" "}
                <a
                  href="/termandcondition"
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <label
              htmlFor="file-add"
              className="w-full md:w-auto cursor-pointer text-white bg-indigo-500 px-4 md:px-6 py-3 md:py-2 rounded-lg hover:bg-indigo-600 transition-colors text-center"
            >
              <input
                id="file-add"
                type="file"
                className="hidden"
                multiple
                accept="image/*,video/*"
                onChange={handleAddFiles}
              />
              + Add new
            </label>
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-3 md:space-y-0 md:space-x-3">
              <button
                onClick={onClose}
                className="w-full md:w-auto px-4 md:px-6 py-3 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !canSubmit}
                className={`w-full md:w-auto px-4 md:px-6 py-3 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors
                                    ${
                                      isSubmitting || !canSubmit
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                type="button"
              >
                {isSubmitting ? "Adding..." : "Add Content"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContent;
