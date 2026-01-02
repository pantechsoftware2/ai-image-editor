import { supabase } from './supabase';

/**
 * Upload base64 image to Supabase Storage
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} mimeType - MIME type (e.g., 'image/jpeg')
 * @param {string} bucketName - Storage bucket name
 * @param {string} fileName - File name (optional, auto-generated if not provided)
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadBase64ImageToStorage = async (
  base64Data,
  mimeType = 'image/jpeg',
  bucketName = 'generated-images',
  fileName = null
) => {
  try {
    if (!base64Data) {
      throw new Error('Base64 data is required');
    }

    // Convert base64 to Blob
    const base64WithoutPrefix = base64Data.startsWith('data:')
      ? base64Data.split(',')[1]
      : base64Data;

    const byteCharacters = atob(base64WithoutPrefix);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Generate file name if not provided
    const finalFileName = fileName || `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;

    // Ensure bucket exists and user has access
    try {
      await supabase.storage.getBucket(bucketName);
    } catch {
      console.warn(`Bucket ${bucketName} not found, attempting to create...`);
      // If bucket doesn't exist, we'll still try to upload
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(finalFileName, blob, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl,
      fileName: finalFileName,
      mimeType,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Storage upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple images and return URLs
 * @param {Array<Object>} images - Array of {base64Data, mimeType}
 * @param {string} bucketName - Storage bucket name
 * @returns {Promise<Array>} Array of upload results with URLs
 */
export const uploadMultipleImages = async (images, bucketName = 'generated-images') => {
  try {
    const uploadPromises = images.map((img, idx) =>
      uploadBase64ImageToStorage(
        img.base64Data || img.base64,
        img.mimeType || 'image/jpeg',
        bucketName,
        `image-${Date.now()}-${idx}.jpg`
      )
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Batch upload error:', error);
    return [];
  }
};

/**
 * Delete image from Supabase Storage
 * @param {string} filePath - Full file path
 * @param {string} bucketName - Storage bucket name
 * @returns {Promise<Object>} Deletion result
 */
export const deleteImageFromStorage = async (filePath, bucketName = 'generated-images') => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    return {
      success: true,
      deletedPath: filePath,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Storage delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * List images in storage bucket
 * @param {string} bucketName - Storage bucket name
 * @param {string} prefix - Optional path prefix
 * @returns {Promise<Array>} Array of file objects
 */
export const listImagesInStorage = async (bucketName = 'generated-images', prefix = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      throw new Error(`List failed: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Storage list error:', error);
    return [];
  }
};
