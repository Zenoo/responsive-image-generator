import sharp from 'sharp';
import fs from 'fs';
import sizeOf from 'image-size';

const WIDTHS = [320, 640, 960, 1280, 1920];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

// Reset output directory
fs.rmSync('output', {recursive: true});
fs.mkdirSync('output');

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
  const originalPromise = sharp(`input/${file}`).toFile(originalDestination);
  promises.push(originalPromise);

  // Resize the image to each target width
  WIDTHS.forEach(targetWidth => {
    if (targetWidth >= width) return;
    const fileName = file.split('.').slice(0, -1).join('.');
    const destination = `output/${fileName}-${targetWidth}w.${extension}`;
    const promise = sharp(`input/${file}`)
      .resize(targetWidth)
      .toFile(destination);

    promises.push(promise);
  });

  await Promise.all(promises);
}

console.log(`Processed ${files.length} files successfully!`);
