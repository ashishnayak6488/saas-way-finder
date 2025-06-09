import { useState } from "react";

export default function AttachFilesOne({ onNext }) {
    const [formData, setFormData] = useState({
        files: [],
        acceptedTerms: false
    });

    const [errors, setErrors] = useState({
        files: "",
        acceptedTerms: ""
    });

    const [previews, setPreviews] = useState([]);

    const validateFiles = (files) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
        const maxSize = 50 * 1024 * 1024; // 50MB

        return files.every(file => {
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, files: "Only images (JPEG, PNG, GIF) and videos (MP4, WEBM) are allowed" }));
                return false;
            }
            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, files: "File size should not exceed 50MB" }));
                return false;
            }
            return true;
        });
    };

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setErrors(prev => ({ ...prev, files: "" }));

        if (validateFiles(uploadedFiles)) {
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...uploadedFiles]
            }));

            // Generate previews
            uploadedFiles.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setPreviews(prev => [...prev, {
                            type: 'image',
                            url: e.target.result,
                            name: file.name
                        }]);
                    };
                    reader.readAsDataURL(file);
                } else if (file.type.startsWith('video/')) {
                    setPreviews(prev => [...prev, {
                        type: 'video',
                        url: URL.createObjectURL(file),
                        name: file.name
                    }]);
                }
            });
        }
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        let isValid = true;
        const newErrors = { files: "", acceptedTerms: "" };

        if (formData.files.length === 0) {
            newErrors.files = "Please upload at least one file";
            isValid = false;
        }

        if (!formData.acceptedTerms) {
            newErrors.acceptedTerms = "Please accept the Privacy Policy";
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            onNext(formData.files);
        }
    };

    const buttonStyles = {
        primary: "justify-center rounded-md bg-[#573CFA] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#7D64FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#573CFA]",
        secondary: "justify-center rounded-md bg-[#FB8D1A] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#FFAA4D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FB8D1A]",
        success: "flex w-full justify-center rounded-md bg-[#02864A] px-3 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#03A15C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#02864A]",
        danger: "flex w-full justify-center rounded-md bg-[#E8083E] px-3 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#F03C65] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8083E]",
        neutral: "flex w-full justify-center rounded-md bg-[#1C1A27] px-3 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#2F2D3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1A27]",
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                    Attach files (Image or video)
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

                <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg flex justify-center items-center flex-col hover:shadow-lg transition-shadow">
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600"
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                        />
                        <div className="flex flex-col items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-12 h-12 text-gray-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v12m0 0L8.25 11.25m3.75 3.75 3.75-3.75M9.75 19.5h4.5m-4.5 0h-3a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 016.75 3h10.5A2.25 2.25 0 0119.5 5.25v12a2.25 2.25 0 01-2.25 2.25h-3"
                                />
                            </svg>
                            <p className="text-sm text-white mt-2 bg-indigo-500 rounded-lg py-1 px-4">Upload</p>
                            <p className="text-xs text-gray-400">(or drop files to upload)</p>
                        </div>
                    </label>
                </div>
                {errors.files && (
                    <p className="text-red-500 text-sm mt-2">{errors.files}</p>
                )}

                {/* File Previews */}
                <div className="mt-4 space-y-2">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative border rounded-lg p-2">
                            {preview.type === 'image' ? (
                                <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="w-full h-32 object-cover rounded"
                                />
                            ) : (
                                <video
                                    src={preview.url}
                                    className="w-full h-32 object-cover rounded"
                                    controls
                                />
                            )}
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <p className="text-sm text-gray-600 mt-1">{preview.name}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        type="button"
                        // className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                        className={`font-medium py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform ${buttonStyles.secondary} ${errors.acceptedTerms ? 'cursor-not-allowed' : ''}`}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        // className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                        className={`ml-4 font-medium py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform ${buttonStyles.primary} ${errors.acceptedTerms ? 'cursor-not-allowed' : ''}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
