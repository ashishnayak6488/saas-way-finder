import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { Button } from "@/src/components/ui/Button";
import Image from "next/image";
import { toast } from "react-hot-toast";

const LogoManager = ({ 
  organization, 
  onClose, 
  onUploadLogo, 
  onRemoveLogo 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    try {
      await onUploadLogo(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error in logo upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!organization.logo_url) {
      return;
    }

    setIsRemoving(true);
    try {
      await onRemoveLogo();
    } catch (error) {
      console.error("Error removing logo:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Organization Logo</h2>
        <p className="text-gray-600 mb-6">{organization.name}</p>
        
        <div className="flex flex-col items-center mb-6">
          {/* Current or Preview Logo */}
          <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-200 mb-4 flex items-center justify-center bg-gray-50">
            {previewUrl ? (
              <Image 
                src={previewUrl} 
                alt="Logo preview" 
                width={128} 
                height={128} 
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : organization.logo_url ? (
              <Image 
                src={organization.logo_url} 
                alt={`${organization.name} logo`} 
                width={128} 
                height={128} 
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <p className="text-gray-400 text-sm text-center px-4">No logo uploaded</p>
            )}
          </div>
          
          {/* File Input */}
          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100 transition-colors mb-4 w-full">
            <Upload size={16} />
            <span>{selectedFile ? selectedFile.name : "Select new logo"}</span>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        <div className="flex gap-3 justify-between">
          {/* Remove Logo Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleRemoveLogo}
            disabled={!organization.logo_url || isRemoving || isUploading}
          >
            <Trash2 size={16} />
            {isRemoving ? "Removing..." : "Remove Logo"}
          </Button>
          
          {/* Upload Button */}
          <Button
            className="flex items-center gap-2"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || isRemoving}
          >
            <Upload size={16} />
            {isUploading ? "Uploading..." : "Upload Logo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoManager;
