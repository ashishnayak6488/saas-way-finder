/**
 * Uploads files with accurate real-time progress tracking
 * @param {Array} files - Array of file objects to upload
 * @param {Function} onProgress - Callback for progress updates (fileIndex, progress)
 * @param {Function} onComplete - Callback when all uploads complete
 * @param {Function} onError - Callback for upload errors
 */
export const uploadFilesWithProgress = async (files, onProgress, onComplete, onError) => {
    try {
        // Create an array to track each file's upload promise
        const uploadPromises = files.map((fileData, index) => {
            return uploadSingleFileWithProgress(fileData, (progress) => {
                // Call the progress callback with file index and progress percentage
                if (onProgress) onProgress(index, progress);
            });
        });

        // Wait for all uploads to complete
        const results = await Promise.allSettled(uploadPromises);

        // Process results
        const processedResults = results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return {
                    status: 'success',
                    ...result.value,
                    originalFile: files[index]
                };
            } else {
                return {
                    status: 'error',
                    error: result.reason?.message || 'Upload failed',
                    originalFile: files[index]
                };
            }
        });

        // Call the complete callback with results
        if (onComplete) onComplete({ results: processedResults });

        return { results: processedResults };
    } catch (error) {
        if (onError) onError(error);
        throw error;
    }
};

/**
 * Uploads a single file with accurate progress tracking
 * @param {Object} fileData - File object with metadata
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} - Resolves with upload result
 */
const uploadSingleFileWithProgress = (fileData, onProgress) => {
    return new Promise((resolve, reject) => {
        // Create a FormData instance for this file
        const formData = new FormData();
        formData.append("files", fileData.file);

        // Add metadata
        formData.append("metadata", JSON.stringify({
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            length: parseFloat(fileData.time.replace('s', '')),
            resolution: fileData.dimensions,
            description: null,
            metadata: null
        }));

        // Add folder parameter
        formData.append("folder", "content");

        // Create and configure XHR request
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                // Calculate percentage - ensure it never reaches 100% until complete
                const percent = Math.min(98, Math.round((event.loaded / event.total) * 100));
                onProgress(percent);
            }
        });

        // Handle successful completion
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    // Set progress to 100% when truly complete
                    onProgress(100);
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (error) {
                    reject(new Error('Invalid server response'));
                }
            } else {
                let errorMessage = 'Upload failed';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use default message
                }
                reject(new Error(errorMessage));
            }
        });

        // Handle network errors
        xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
        });

        // Handle aborted uploads
        xhr.addEventListener('abort', () => {
            reject(new Error('Upload was aborted'));
        });

        // Send the request
        xhr.open('POST', '/api/content/createContents');
        xhr.withCredentials = true;
        xhr.send(formData);
    });
};

/**
 * Wrapper function for existing upload functions to add progress tracking
 */
export const withProgressTracking = async (uploadFn, playlistId, files, onProgress) => {
    try {
        // If we have a real upload function, use it
        if (typeof uploadFn === 'function') {
            // Create an array to track progress for each file
            const progressMap = {};
            files.forEach((_, index) => {
                progressMap[index] = 0;
            });

            // Create a wrapper function to track progress
            const trackProgress = (index, progress) => {
                progressMap[index] = progress;
                if (onProgress) {
                    onProgress(index, progress);
                }
            };

            // Call the actual upload function
            const result = await uploadFn(playlistId, files);

            // Set all files to 100% complete
            files.forEach((_, index) => {
                trackProgress(index, 100);
            });

            return result;
        }

        // If no upload function provided, use FormData and XHR
        const formData = new FormData();

        // Add each file to the FormData
        files.forEach((fileData, index) => {
            formData.append("files", fileData.file);

            // Add metadata as separate fields
            formData.append("metadata", JSON.stringify({
                name: fileData.name,
                size: fileData.size,
                type: fileData.type,
                length: parseFloat(fileData.time.toString().replace('s', '')),
                resolution: fileData.dimensions,
                description: null,
                metadata: null
            }));
        });

        // Add folder parameter
        formData.append("folder", "content");

        // Use XMLHttpRequest to track upload progress
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const totalProgress = Math.min(98, Math.round((event.loaded / event.total) * 100));

                    // Update progress for all files
                    files.forEach((_, index) => {
                        if (onProgress) onProgress(index, totalProgress);
                    });
                }
            });

            // Handle successful completion
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        // Set all files to 100% complete
                        files.forEach((_, index) => {
                            if (onProgress) onProgress(index, 100);
                        });

                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Invalid server response format'));
                    }
                } else {
                    let errorMessage = 'Upload failed';
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        errorMessage = errorResponse.message || errorMessage;
                    } catch (e) {
                        // If parsing fails, use default message
                    }
                    reject(new Error(errorMessage));
                }
            });

            // Handle network errors
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            // Handle aborted uploads
            xhr.addEventListener('abort', () => {
                reject(new Error('Upload aborted'));
            });

            // Send the request
            xhr.open('POST', '/api/content/createContents');
            xhr.withCredentials = true;
            xhr.send(formData);
        });
    } catch (error) {
        console.error('Upload tracking error:', error);
        throw error;
    }
};
