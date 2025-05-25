const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // CORS 문제 방지
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: any, size: number): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, size, size);

  return canvas.toDataURL('image/jpeg'); // 혹은 'image/png'
};

export default getCroppedImg;
