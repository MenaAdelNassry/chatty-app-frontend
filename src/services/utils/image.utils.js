export class ImageUtils {
  // 1. File verification (image or video + size)
  static validateFile(file) {
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
    ];
    const validVideoTypes = ['video/mp4', 'video/mkv', 'video/webm'];

    // Maximum size (e.g., 20 MB for video and 5 MB for image)
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

    const fileType = file.type;

    // A. Check if Image
    if (validImageTypes.includes(fileType)) {
      if (file.size > MAX_IMAGE_SIZE) {
        return { valid: false, message: 'Image size must be less than 5MB' };
      }
      return { valid: true, type: 'image' };
    }

    // B. Check if Video
    if (validVideoTypes.includes(fileType)) {
      if (file.size > MAX_VIDEO_SIZE) {
        return { valid: false, message: 'Video size must be less than 20MB' };
      }
      return { valid: true, type: 'video' };
    }

    // C. Invalid Type
    return { valid: false, message: 'File type not supported' };
  }

  // 2. Convert the file to Base64 (for the backend)
  static readFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  static getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await this.createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  static createImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });
  };

  static extractCloudinaryInfo = (url) => {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');

    if (uploadIndex === -1) return null;

    const version = parts[uploadIndex + 1].startsWith('v')
      ? parts[uploadIndex + 1]
      : null;

    const publicId = parts.slice(uploadIndex + (version ? 2 : 1)).join('/');

    return {
      publicId,
      version,
      fullUrl: url,
    };
  };
}
