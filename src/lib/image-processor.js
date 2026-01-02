/**
 * Compress image
 * @param {File} file
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} quality
 * @returns {Promise<Blob>}
 */
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Resize image
 * @param {string} imageSrc
 * @param {number} width
 * @param {number} height
 * @returns {Promise<string>}
 */
export const resizeImage = (imageSrc, width, height) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };

    img.src = imageSrc;
  });
};

/**
 * Get image dimensions
 * @param {string} imageSrc
 * @returns {Promise<Object>}
 */
export const getImageDimensions = (imageSrc) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.src = imageSrc;
  });
};

/**
 * Crop image
 * @param {string} imageSrc
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {Promise<string>}
 */
export const cropImage = (imageSrc, x, y, width, height) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };

    img.src = imageSrc;
  });
};

/**
 * Apply filter to image
 * @param {string} imageSrc
 * @param {string} filter
 * @returns {Promise<string>}
 */
export const applyFilter = (imageSrc, filter = 'grayscale') => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');

      // Apply filter using CSS and canvas
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };

    img.src = imageSrc;
  });
};

/**
 * Convert image to grayscale
 * @param {string} imageSrc
 * @returns {Promise<string>}
 */
export const toGrayscale = (imageSrc) => applyFilter(imageSrc, 'grayscale(1)');

/**
 * Convert image to sepia
 * @param {string} imageSrc
 * @returns {Promise<string>}
 */
export const toSepia = (imageSrc) => applyFilter(imageSrc, 'sepia(1)');

/**
 * Adjust brightness
 * @param {string} imageSrc
 * @param {number} amount - 0.5 to 2
 * @returns {Promise<string>}
 */
export const adjustBrightness = (imageSrc, amount = 1) => {
  return applyFilter(imageSrc, `brightness(${amount})`);
};

/**
 * Adjust saturation
 * @param {string} imageSrc
 * @param {number} amount - 0 to 2
 * @returns {Promise<string>}
 */
export const adjustSaturation = (imageSrc, amount = 1) => {
  return applyFilter(imageSrc, `saturate(${amount})`);
};
