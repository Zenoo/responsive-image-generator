import sharp, { Sharp } from 'sharp';
import fs from 'fs';
import sizeOf from 'image-size';

const optimizeImage = (sharpInstance: Sharp, file: string) => {
  const extension = file.split('.').pop();

  if (!extension) {
    throw new Error(`Could not determine extension of ${file}`);
  }

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      sharpInstance = sharpInstance.jpeg({quality: 80});
      break;
    case 'png':
      sharpInstance = sharpInstance.png({quality: 80});
      break;
    case 'webp':
      sharpInstance = sharpInstance.webp({quality: 80});
      break;
  }

  return sharpInstance;
};

const WIDTHS = [320, 640, 960, 1280, 1920];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

// Create output directory if it doesn't exist
if (!fs.existsSync('output')) {
  fs.mkdirSync('output');
}

// Reset output directory
fs.rmSync('output', {recursive: true});
fs.mkdirSync('output');

// Create input directory if it doesn't exist
if (!fs.existsSync('input')) {
  fs.mkdirSync('input');
}

const files = fs.readdirSync('input');

for (const file of files) {
  const extension = file.split('.').pop();

  if (!extension) {
    console.warn(`Skipping ${file} because it has no extension`);
    continue;
  }

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    console.warn(`Skipping ${file} because it has an unsupported extension`);
    continue;
  }
  const {width} = sizeOf(`input/${file}`);

  if (!width) {
    throw new Error(`Could not read dimensions of ${file}`);
  }

  const promises: Promise<sharp.OutputInfo>[] = [];

  // Optimize the original image
  const originalDestination = `output/${file}`;
  let sharpInstance = sharp(`input/${file}`);

  // Optimize the image depending on the extension
  sharpInstance = optimizeImage(sharpInstance, file);
  const originalPromise = sharpInstance.toFile(originalDestination);
  promises.push(originalPromise);

  // Resize the image to each target width
  WIDTHS.forEach(targetWidth => {
    if (targetWidth >= width) return;
    const fileName = file.split('.').slice(0, -1).join('.');
    const destination = `output/${fileName}-${targetWidth}w.${extension}`;
    let sharpInstance = sharp(`input/${file}`);

    // Optimize the image depending on the extension
    sharpInstance = optimizeImage(sharpInstance, file);

    const promise = sharpInstance
      .resize(targetWidth)
      .toFile(destination);

    promises.push(promise);
  });

  await Promise.all(promises);
}

console.log(`Processed ${files.length} files successfully!`);
