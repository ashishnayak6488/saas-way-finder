import { useState } from "react";

export default function AttachFilesTwo() {
    const [formData, setFormData] = useState({
        files: [],
        acceptedTerms: false
    });

    const [errors, setErrors] = useState({
        files: "",
        acceptedTerms: ""
    });

    const [previews, setPreviews] = useState([]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
        const maxSize = 50 * 1024 * 1024; // 50MB

        if (!allowedTypes.includes(file.type)) {
            return "Only images (JPEG, PNG, GIF) and videos (MP4, WEBM) are allowed";
        }
        if (file.size > maxSize) {
            return "File size should not exceed 50MB";
        }
        return null;
    };

    const handleAddFiles = (event) => {
        const newFiles = Array.from(event.target.files);
        setErrors({ files: "" });

        const validFiles = [];
        const newPreviews = [];

        newFiles.forEach(file => {
            const error = validateFile(file);
            if (!error) {
                validFiles.push({
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.type,
                    file: file
                });

                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        newPreviews.push({
                            type: 'image',
                            url: e.target.result,
                            name: file.name
                        });
                        setPreviews(prev => [...prev, ...newPreviews]);
                    };
                    reader.readAsDataURL(file);
                } else if (file.type.startsWith('video/')) {
                    newPreviews.push({
                        type: 'video',
                        url: URL.createObjectURL(file),
                        name: file.name
                    });
                }
            } else {
                setErrors(prev => ({ ...prev, files: error }));
            }
        });

        if (validFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...validFiles]
            }));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const buttonStyles = {
        primary: "flex w-full justify-center rounded-md bg-[#573CFA] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#7D64FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#573CFA]",
        secondary: "flex w-full justify-center rounded-md bg-[#FB8D1A] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#FFAA4D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FB8D1A]",
        success: "flex w-full justify-center rounded-md bg-[#02864A] px-3 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#03A15C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#02864A]",
        danger: "flex w-full justify-center rounded-md bg-[#E8083E] px-3 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#F03C65] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8083E]",
        neutral: "flex w-full justify-center rounded-md bg-[#1C1A27] px-3 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#2F2D3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1A27]",
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                    Attaching files
                </h2>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={formData.acceptedTerms}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            acceptedTerms: e.target.checked
                        }))}
                        className="mr-2"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree with the{" "}
                        <a href="#" className="text-blue-500 hover:underline">
                            Privacy Policy
                        </a>
                    </label>
                </div>

                {errors.acceptedTerms && (
                    <p className="text-red-500 text-sm mb-4">{errors.acceptedTerms}</p>
                )}

                <div className="space-y-4 mb-4">
                    {formData.files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between border rounded-lg p-3"
                        >
                            <div className="flex-1">
                                <div className="flex items-center">
                                    {previews[index]?.type === 'image' ? (
                                        <img
                                            src={previews[index].url}
                                            alt={file.name}
                                            className="w-12 h-12 object-cover rounded mr-3"
                                        />
                                    ) : previews[index]?.type === 'video' ? (
                                        <video
                                            src={previews[index].url}
                                            className="w-12 h-12 object-cover rounded mr-3"
                                        />
                                    ) : null}
                                    <div>
                                        <p className="text-sm text-gray-700 font-medium">{file.name}</p>
                                        <p className="text-xs text-gray-500">{file.size}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 ml-4"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {errors.files && (
                    <p className="text-red-500 text-sm mb-4">{errors.files}</p>
                )}

                <div className="flex justify-between">
                    <label
                        htmlFor="file-add"
                        // className="cursor-pointer text-white bg-indigo-500 border border-gray-300 rounded-lg px-4 py-2 hover:bg-indigo-600"
                        className={`cursor-pointer mr-4 ${buttonStyles.primary}`}
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
                    <button
                        type="button"
                        // className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                        className={`ml-4 ${buttonStyles.secondary} ${buttonStyles.small}`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
