# Responsive Image Generator

This document provides instructions on how to convert images using our tool.

## Prerequisites

Ensure that you have Node.js and npm installed on your system. If not, you can download and install them from [here](https://nodejs.org/en/download/).

## Steps

1. **Place your images in the input directory**: The images that you want to convert should be placed in the `input` directory of the project.

2. **Run the conversion script**: After placing the images in the `input` directory, you can run the conversion script by executing the following command in your terminal:

```bash
npm run generate
```

Or by double-clicking the `generate.bat` file.

This command will start the conversion process. Once the process is complete, you can find the converted images in the `output` directory.

Please note that the conversion process might take some time depending on the size and number of images.

## HTML usage

To use the converted images in your HTML, you can refer to the following example:

```html
<img
  src="input/image.webp"
  alt="Image"
  srcset="output/image-320w.webp 320w, output/image-640w.webp 640w, output/image-960w.webp 960w output/image-1280w.webp 1280w output/image-1920w.webp 1920w"
  sizes="(max-width: 320px) 280px, (max-width: 640px) 640px, (max-width: 960px) 960px, (max-width: 1280px) 1280px, (max-width: 1920px) 1920px"
>
```

**Make sure to check the widths generated, as they may vary depending on the original image size.**

If you encounter any issues, please open a new issue in the repository.
