import { round } from "lodash";

export const resizeImage = (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = dataUrl;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 768;
      const maxHeight = 768;
      let width = image.width;
      let height = image.height;

      // Calculate the new dimensions, maintaining the aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx!.drawImage(image, 0, 0, round(width), round(height));

      resolve(canvas.toDataURL());
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
};
